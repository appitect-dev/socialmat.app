import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

type IGMediaProductType = "FEED" | "REELS" | "STORY" | string;

const DEPRECATED_METRICS = ["impressions", "video_views", "plays"];

// Default "max" kandidáti – reálně se část vyfiltruje podle typu média / dostupnosti v API.
const DEFAULT_METRICS_BY_TYPE: Record<string, string[]> = {
  FEED: [
    "views",
    "reach",
    "saved",
    "shares",
    "likes",
    "comments",
    "total_interactions",
    "profile_activity",
    "profile_visits",
    "follows",
  ],
  REELS: [
    "views",
    "reach",
    "saved",
    "shares",
    "likes",
    "comments",
    "total_interactions",
    "profile_activity",
    "profile_visits",
    "follows",
    "ig_reels_avg_watch_time",
    "ig_reels_video_view_total_time",
  ],
  STORY: [
    "views",
    "reach",
    "shares",
    "replies",
    "total_interactions",
    "profile_activity",
    "profile_visits",
    "follows",
    "navigation",
  ],
};

function parseCsv(param: string | null): string[] {
  return (param ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function unique(arr: string[]) {
  return Array.from(new Set(arr));
}

function extractAllowedMetrics(msg?: string): string[] | null {
  if (!msg) return null;
  // e.g. "metric[2] must be one of the following values: impressions, reach, ..."
  const m = msg.match(/must be one of the following values:\s*(.+)$/i);
  if (!m?.[1]) return null;
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractUnsupportedMetric(msg?: string): string | null {
  if (!msg) return null;
  // e.g. "does not support the impressions metric"
  const m = msg.match(/does not support the ([a-z0-9_]+) metric/i);
  return m?.[1]?.trim() ?? null;
}

async function fetchJson(url: string) {
  const res = await fetch(url, NO_STORE);
  const data = await res.json().catch(() => null);
  return { res, data };
}

async function fetchMediaMeta(accessToken: string, mediaId: string) {
  const url =
    `${IG_BASE}/${encodeURIComponent(mediaId)}?` +
    new URLSearchParams({
      fields: "id,media_type,media_product_type",
      access_token: accessToken,
    }).toString();

  const out = await fetchJson(url);
  return out;
}

async function fetchInsightsWithAutoFilter(args: {
  accessToken: string;
  mediaId: string;
  metrics: string[];
  breakdown?: string;
}) {
  const { accessToken, mediaId, breakdown } = args;

  let metrics = unique(args.metrics);
  const dropped: string[] = [];
  let lastError: any = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    if (metrics.length === 0) {
      return {
        ok: true as const,
        insights: [] as any[],
        metricsUsed: [] as string[],
        dropped,
        note: "No supported metrics left after filtering.",
      };
    }

    const params = new URLSearchParams({
      metric: metrics.join(","),
      access_token: accessToken,
    });
    if (breakdown) params.set("breakdown", breakdown);

    const url = `${IG_BASE}/${encodeURIComponent(
      mediaId
    )}/insights?${params.toString()}`;
    const out = await fetchJson(url);

    if (out.res.ok) {
      return {
        ok: true as const,
        insights: out.data?.data ?? [],
        metricsUsed: metrics,
        dropped,
        note: null as string | null,
      };
    }

    lastError = out.data;
    const msg: string | undefined = out.data?.error?.message;

    // 1) "metric must be one of" → filtruj na allowed list
    const allowed = extractAllowedMetrics(msg);
    if (allowed?.length) {
      const next = metrics.filter((m) => allowed.includes(m));
      dropped.push(...metrics.filter((m) => !next.includes(m)));
      metrics = unique(next);
      continue;
    }

    // 2) "does not support the X metric" → vyhoď X
    const unsupported = extractUnsupportedMetric(msg);
    if (unsupported) {
      const next = metrics.filter((m) => m !== unsupported);
      if (next.length !== metrics.length) dropped.push(unsupported);
      metrics = unique(next);
      continue;
    }

    // 3) Neznámá chyba → stop
    break;
  }

  return {
    ok: false as const,
    error: lastError,
    dropped,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length).trim();

  const mediaId = params.mediaId;
  if (!mediaId) {
    return NextResponse.json({ error: "Missing mediaId" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const metricParam = searchParams.get("metric");
  const includeBreakdowns =
    (searchParams.get("includeBreakdowns") ?? "1") !== "0";
  const includeDeprecated =
    (searchParams.get("includeDeprecated") ?? "0") === "1";

  // 1) zjisti typ média (FEED/REELS/STORY)
  const metaOut = await fetchMediaMeta(accessToken, mediaId);
  if (!metaOut.res.ok || !metaOut.data?.id) {
    return NextResponse.json(
      { error: "Failed to load media meta", details: metaOut.data },
      { status: metaOut.res.status || 500 }
    );
  }

  const mediaProductType: IGMediaProductType =
    metaOut.data.media_product_type ?? "FEED";
  const typeDefaults =
    DEFAULT_METRICS_BY_TYPE[mediaProductType] ?? DEFAULT_METRICS_BY_TYPE.FEED;

  // 2) vyber metriky: buď user param, nebo default dle typu
  let requestedMetrics = metricParam
    ? parseCsv(metricParam)
    : [...typeDefaults];

  if (!includeDeprecated) {
    requestedMetrics = requestedMetrics.filter(
      (m) => !DEPRECATED_METRICS.includes(m)
    );
  }

  requestedMetrics = unique(requestedMetrics);

  // 3) breakdown metriky řeš separátně (jinak by breakdown rozbil ostatní metriky)
  const wantNavigation =
    includeBreakdowns && requestedMetrics.includes("navigation");
  const wantProfileActivityBreakdown =
    includeBreakdowns && requestedMetrics.includes("profile_activity");

  const baseMetrics = requestedMetrics.filter(
    (m) => m !== "navigation" // navigation jen s breakdownem
  );

  // 4) base insights (bez breakdown)
  const base = await fetchInsightsWithAutoFilter({
    accessToken,
    mediaId,
    metrics: baseMetrics,
  });

  if (!base.ok) {
    return NextResponse.json(
      { error: "Failed to load media insights", details: base.error },
      { status: 400 }
    );
  }

  const extraCalls: any[] = [];
  const droppedMetrics = [...base.dropped];

  // 5) STORY navigation breakdown
  if (wantNavigation) {
    const nav = await fetchInsightsWithAutoFilter({
      accessToken,
      mediaId,
      metrics: ["navigation"],
      breakdown: "story_navigation_action_type",
    });

    if (nav.ok) {
      extraCalls.push({
        kind: "breakdown",
        metric: "navigation",
        breakdown: "story_navigation_action_type",
        insights: nav.insights,
        dropped: nav.dropped,
      });
      droppedMetrics.push(...nav.dropped);
    } else {
      extraCalls.push({
        kind: "breakdown_error",
        metric: "navigation",
        breakdown: "story_navigation_action_type",
        error: nav.error,
      });
    }
  }

  // 6) profile_activity breakdown (action_type)
  if (wantProfileActivityBreakdown) {
    const pa = await fetchInsightsWithAutoFilter({
      accessToken,
      mediaId,
      metrics: ["profile_activity"],
      breakdown: "action_type",
    });

    if (pa.ok) {
      extraCalls.push({
        kind: "breakdown",
        metric: "profile_activity",
        breakdown: "action_type",
        insights: pa.insights,
        dropped: pa.dropped,
      });
      droppedMetrics.push(...pa.dropped);
    } else {
      extraCalls.push({
        kind: "breakdown_error",
        metric: "profile_activity",
        breakdown: "action_type",
        error: pa.error,
      });
    }
  }

  return NextResponse.json({
    media: {
      id: metaOut.data.id,
      media_type: metaOut.data.media_type ?? null,
      media_product_type: metaOut.data.media_product_type ?? null,
    },
    requested: {
      metrics: requestedMetrics,
      includeBreakdowns,
      includeDeprecated,
    },
    result: {
      baseInsights: base.insights,
      breakdowns: extraCalls,
      metricsUsed: base.metricsUsed,
      droppedMetrics: unique(droppedMetrics),
      note: base.note ?? null,
    },
  });
}
