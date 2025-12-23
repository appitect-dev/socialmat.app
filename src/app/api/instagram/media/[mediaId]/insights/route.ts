import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

type JsonObject = Record<string, unknown>;
type InsightItem = Record<string, unknown>;

function isObject(v: unknown): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function getErrorMessage(data: unknown): string | undefined {
  if (!isObject(data)) return undefined;
  const err = data.error;
  if (!isObject(err)) return undefined;
  const msg = err.message;
  return typeof msg === "string" ? msg : undefined;
}

const DEPRECATED_METRICS = ["impressions", "video_views", "plays"] as const;

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

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function extractAllowedMetrics(msg?: string): string[] | null {
  if (!msg) return null;
  const m = msg.match(/must be one of the following values:\s*(.+)$/i);
  if (!m?.[1]) return null;
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractUnsupportedMetrics(msg?: string): string[] | null {
  if (!msg) return null;

  // Handles:
  // "does not support the impressions metric ..."
  // "does not support the profile_activity, profile_visits, follows metric ..."
  // "does not support the X, Y metrics ..."
  const m = msg.match(/does not support the (.+?) metrics?\b/i);
  if (!m?.[1]) return null;

  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function fetchJson(
  url: string
): Promise<{ res: Response; data: unknown }> {
  const res = await fetch(url, NO_STORE);
  const data = await res.json().catch(() => null);
  return { res, data };
}

type MediaMeta = {
  id: string;
  media_type: string | null;
  media_product_type: string | null;
};

function parseMediaMeta(data: unknown): MediaMeta | null {
  if (!isObject(data)) return null;
  const id = data.id;
  if (typeof id !== "string" || !id) return null;

  const media_type =
    typeof data.media_type === "string" ? data.media_type : null;
  const media_product_type =
    typeof data.media_product_type === "string"
      ? data.media_product_type
      : null;

  return { id, media_type, media_product_type };
}

async function fetchMediaMeta(accessToken: string, mediaId: string) {
  const url =
    `${IG_BASE}/${encodeURIComponent(mediaId)}?` +
    new URLSearchParams({
      fields: "id,media_type,media_product_type",
      access_token: accessToken,
    }).toString();

  return fetchJson(url);
}

type InsightsOk = {
  ok: true;
  insights: InsightItem[];
  metricsUsed: string[];
  dropped: string[];
  note: string | null;
};

type InsightsErr = {
  ok: false;
  error: unknown;
  dropped: string[];
};

async function fetchInsightsWithAutoFilter(args: {
  accessToken: string;
  mediaId: string;
  metrics: string[];
  breakdown?: string;
}): Promise<InsightsOk | InsightsErr> {
  const { accessToken, mediaId, breakdown } = args;

  let metrics = unique(args.metrics);
  const dropped: string[] = [];
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    if (metrics.length === 0) {
      return {
        ok: true,
        insights: [],
        metricsUsed: [],
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
      const itemsRaw = isObject(out.data) ? out.data.data : null;
      const insights: InsightItem[] = Array.isArray(itemsRaw)
        ? (itemsRaw.filter(isObject) as InsightItem[])
        : [];

      return {
        ok: true,
        insights,
        metricsUsed: metrics,
        dropped,
        note: null,
      };
    }

    lastError = out.data;
    const msg = getErrorMessage(out.data);

    const allowed = extractAllowedMetrics(msg);
    if (allowed?.length) {
      const next = metrics.filter((m) => allowed.includes(m));
      dropped.push(...metrics.filter((m) => !next.includes(m)));
      metrics = unique(next);
      continue;
    }

    const unsupported = extractUnsupportedMetrics(msg);
    if (unsupported?.length) {
      const next = metrics.filter((m) => !unsupported.includes(m));
      dropped.push(...metrics.filter((m) => unsupported.includes(m)));
      metrics = unique(next);
      continue;
    }

    break;
  }

  return { ok: false, error: lastError, dropped };
}

type BreakdownOk = {
  kind: "breakdown";
  metric: string;
  breakdown: string;
  insights: InsightItem[];
  dropped: string[];
};

type BreakdownErr = {
  kind: "breakdown_error";
  metric: string;
  breakdown: string;
  error: unknown;
};

type BreakdownResult = BreakdownOk | BreakdownErr;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length).trim();

  const { mediaId } = await params;
  if (!mediaId) {
    return NextResponse.json({ error: "Missing mediaId" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const metricParam = searchParams.get("metric");
  const includeBreakdowns =
    (searchParams.get("includeBreakdowns") ?? "1") !== "0";
  const includeDeprecated =
    (searchParams.get("includeDeprecated") ?? "0") === "1";

  // 1) media meta
  const metaOut = await fetchMediaMeta(accessToken, mediaId);
  const meta = parseMediaMeta(metaOut.data);

  if (!metaOut.res.ok || !meta) {
    return NextResponse.json(
      { error: "Failed to load media meta", details: metaOut.data },
      { status: metaOut.res.status || 500 }
    );
  }

  const mediaProductType = meta.media_product_type ?? "FEED";
  const typeDefaults =
    DEFAULT_METRICS_BY_TYPE[mediaProductType] ?? DEFAULT_METRICS_BY_TYPE.FEED;

  // 2) metrics
  let requestedMetrics = metricParam
    ? parseCsv(metricParam)
    : [...typeDefaults];

  if (!includeDeprecated) {
    requestedMetrics = requestedMetrics.filter(
      (m) =>
        !DEPRECATED_METRICS.includes(m as (typeof DEPRECATED_METRICS)[number])
    );
  }
  requestedMetrics = unique(requestedMetrics);

  const requestedHasNavigation =
    includeBreakdowns && requestedMetrics.includes("navigation");

  const baseMetrics = requestedMetrics.filter((m) => m !== "navigation");

  // 3) base insights
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

  const wantProfileActivityBreakdown =
    includeBreakdowns &&
    mediaProductType === "STORY" &&
    base.metricsUsed.includes("profile_activity");

  const wantNavigation = requestedHasNavigation && mediaProductType === "STORY";

  const breakdowns: BreakdownResult[] = [];
  const droppedMetrics = [...base.dropped];

  // 4) navigation breakdown (story)
  if (wantNavigation) {
    const nav = await fetchInsightsWithAutoFilter({
      accessToken,
      mediaId,
      metrics: ["navigation"],
      breakdown: "story_navigation_action_type",
    });

    if (nav.ok) {
      breakdowns.push({
        kind: "breakdown",
        metric: "navigation",
        breakdown: "story_navigation_action_type",
        insights: nav.insights,
        dropped: nav.dropped,
      });
      droppedMetrics.push(...nav.dropped);
    } else {
      breakdowns.push({
        kind: "breakdown_error",
        metric: "navigation",
        breakdown: "story_navigation_action_type",
        error: nav.error,
      });
    }
  }

  // 5) profile_activity breakdown
  if (wantProfileActivityBreakdown) {
    const pa = await fetchInsightsWithAutoFilter({
      accessToken,
      mediaId,
      metrics: ["profile_activity"],
      breakdown: "action_type",
    });

    if (pa.ok) {
      breakdowns.push({
        kind: "breakdown",
        metric: "profile_activity",
        breakdown: "action_type",
        insights: pa.insights,
        dropped: pa.dropped,
      });
      droppedMetrics.push(...pa.dropped);
    } else {
      breakdowns.push({
        kind: "breakdown_error",
        metric: "profile_activity",
        breakdown: "action_type",
        error: pa.error,
      });
    }
  }

  return NextResponse.json({
    media: {
      id: meta.id,
      media_type: meta.media_type,
      media_product_type: meta.media_product_type,
    },
    requested: {
      metrics: requestedMetrics,
      includeBreakdowns,
      includeDeprecated,
    },
    result: {
      baseInsights: base.insights,
      breakdowns,
      metricsUsed: base.metricsUsed,
      droppedMetrics: unique(droppedMetrics),
      note: base.note,
    },
  });
}
