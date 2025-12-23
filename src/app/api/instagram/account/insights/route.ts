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

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function parseCsv(param: string | null): string[] {
  return (param ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// e.g. "metric[2] must be one of the following values: reach, ..."
function extractAllowedMetrics(msg?: string): string[] | null {
  if (!msg) return null;
  const m = msg.match(/must be one of the following values:\s*(.+)$/i);
  if (!m?.[1]) return null;
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// supports:
// "does not support the X metric"
// "does not support the X, Y, Z metric/metrics"
function extractUnsupportedMetrics(msg?: string): string[] | null {
  if (!msg) return null;

  const m = msg.match(/does not support the (.+?) metrics?\b/i);
  if (!m?.[1]) return null;

  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isFollowerThresholdError(msg?: string): boolean {
  if (!msg) return false;
  return /100 followers|at least 100 followers|requires.*followers/i.test(msg);
}

async function fetchJson(
  url: string
): Promise<{ res: Response; data: unknown }> {
  const res = await fetch(url, NO_STORE);
  const data = await res.json().catch(() => null);
  return { res, data };
}

type MeInfo = { id: string; username: string };

async function fetchMe(
  accessToken: string
): Promise<
  { ok: true; me: MeInfo } | { ok: false; error: unknown; status: number }
> {
  const url =
    `${IG_BASE}/me?` +
    new URLSearchParams({
      fields: "id,username",
      access_token: accessToken,
    }).toString();

  const out = await fetchJson(url);
  if (!out.res.ok || !isObject(out.data) || typeof out.data.id !== "string") {
    return { ok: false, error: out.data, status: out.res.status || 401 };
  }

  return {
    ok: true,
    me: {
      id: out.data.id,
      username: typeof out.data.username === "string" ? out.data.username : "",
    },
  };
}

type InsightsOk = {
  ok: true;
  insights: InsightItem[];
  metricsUsed: string[];
  droppedMetrics: string[];
  note: string | null;
};

type InsightsErr = {
  ok: false;
  error: unknown;
  status: number;
  droppedMetrics: string[];
  note: string | null;
};

async function fetchAccountInsightsWithAutoFilter(args: {
  accessToken: string;
  igUserId: string;
  metrics: string[];
  period: string; // day|week|days_28|lifetime
  since?: string | null;
  until?: string | null;
}): Promise<InsightsOk | InsightsErr> {
  const { accessToken, igUserId, period } = args;

  let metrics = unique(args.metrics);
  const droppedMetrics: string[] = [];
  let lastError: unknown = null;
  let lastStatus = 400;

  for (let attempt = 0; attempt < 6; attempt++) {
    if (metrics.length === 0) {
      return {
        ok: true,
        insights: [],
        metricsUsed: [],
        droppedMetrics,
        note: "No supported metrics left after filtering.",
      };
    }

    const params = new URLSearchParams({
      metric: metrics.join(","),
      period,
      access_token: accessToken,
    });

    if (args.since) params.set("since", args.since);
    if (args.until) params.set("until", args.until);

    const url = `${IG_BASE}/${encodeURIComponent(
      igUserId
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
        droppedMetrics,
        note: null,
      };
    }

    lastError = out.data;
    lastStatus = out.res.status || 400;

    const msg = getErrorMessage(out.data);

    // follower threshold – u audience to může být běžné
    if (isFollowerThresholdError(msg)) {
      return {
        ok: false,
        error: out.data,
        status: lastStatus,
        droppedMetrics,
        note: msg ?? "Insights not available (follower threshold).",
      };
    }

    // "must be one of" → intersect
    const allowed = extractAllowedMetrics(msg);
    if (allowed?.length) {
      const next = metrics.filter((m) => allowed.includes(m));
      droppedMetrics.push(...metrics.filter((m) => !next.includes(m)));
      metrics = unique(next);
      continue;
    }

    // "does not support the X, Y metric(s)" → drop them
    const unsupported = extractUnsupportedMetrics(msg);
    if (unsupported?.length) {
      const next = metrics.filter((m) => !unsupported.includes(m));
      droppedMetrics.push(...metrics.filter((m) => unsupported.includes(m)));
      metrics = unique(next);
      continue;
    }

    // nevíme jak auto-fixnout → stop
    break;
  }

  return {
    ok: false,
    error: lastError,
    status: lastStatus,
    droppedMetrics,
    note: getErrorMessage(lastError) ?? null,
  };
}

// “max” kandidáti (auto-filter to sám ořeže dle podpory účtu/period)
const PERFORMANCE_CANDIDATES = [
  "reach",
  "profile_views",
  "accounts_engaged",
  "follower_count",
  "website_clicks",
  "email_contacts",
  "phone_call_clicks",
  "text_message_clicks",
  "get_directions_clicks",
  "impressions", // často problematické / deprecated → necháme jen pokud includeDeprecated=1
];

const AUDIENCE_CANDIDATES = [
  "audience_gender_age",
  "audience_country",
  "audience_city",
  "online_followers",
];

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length).trim();

  const { searchParams } = new URL(req.url);

  const kind = (searchParams.get("kind") ?? "all").toLowerCase(); // performance|audience|all
  const period = searchParams.get("period") ?? "day"; // performance period
  const since = searchParams.get("since"); // optional (unix seconds)
  const until = searchParams.get("until"); // optional (unix seconds)

  const includeDeprecated =
    (searchParams.get("includeDeprecated") ?? "0") === "1";

  const metricParam = searchParams.get("metric"); // overrides performance metrics
  const audienceMetricParam = searchParams.get("audienceMetric"); // overrides audience metrics

  const meOut = await fetchMe(accessToken);
  if (!meOut.ok) {
    return NextResponse.json(
      { error: "Invalid token", details: meOut.error },
      { status: meOut.status }
    );
  }

  const { id: igUserId, username } = meOut.me;

  const perfMetricsRaw = metricParam
    ? parseCsv(metricParam)
    : [...PERFORMANCE_CANDIDATES];
  const perfMetrics = unique(
    includeDeprecated
      ? perfMetricsRaw
      : perfMetricsRaw.filter((m) => m !== "impressions")
  );

  const audMetrics = unique(
    audienceMetricParam
      ? parseCsv(audienceMetricParam)
      : [...AUDIENCE_CANDIDATES]
  );

  const out: {
    user: { id: string; username: string };
    performance?: unknown;
    audience?: unknown;
  } = {
    user: { id: igUserId, username },
  };

  // performance
  if (kind === "performance" || kind === "all") {
    const perf = await fetchAccountInsightsWithAutoFilter({
      accessToken,
      igUserId,
      metrics: perfMetrics,
      period,
      since,
      until,
    });

    out.performance = {
      period,
      requestedMetrics: perfMetrics,
      ...(perf.ok
        ? {
            ok: true,
            insights: perf.insights,
            metricsUsed: perf.metricsUsed,
            droppedMetrics: perf.droppedMetrics,
            note: perf.note,
          }
        : {
            ok: false,
            error: "Failed to load performance insights",
            details: perf.error,
            status: perf.status,
            droppedMetrics: perf.droppedMetrics,
            note: perf.note,
          }),
    };
  }

  // audience (always lifetime)
  if (kind === "audience" || kind === "all") {
    const aud = await fetchAccountInsightsWithAutoFilter({
      accessToken,
      igUserId,
      metrics: audMetrics,
      period: "lifetime",
      since: null,
      until: null,
    });

    out.audience = {
      period: "lifetime",
      requestedMetrics: audMetrics,
      ...(aud.ok
        ? {
            ok: true,
            insights: aud.insights,
            metricsUsed: aud.metricsUsed,
            droppedMetrics: aud.droppedMetrics,
            note: aud.note,
          }
        : {
            ok: false,
            error: "Failed to load audience insights",
            details: aud.error,
            status: aud.status,
            droppedMetrics: aud.droppedMetrics,
            note: aud.note,
          }),
    };
  }

  return NextResponse.json(out);
}
