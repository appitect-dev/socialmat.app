"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChartCard, type LineSeries } from "@/components/ChartCard";
import { useDashboardTheme } from "./dashboard-theme";

type IgAuth = { accessToken: string; igUserId: string; expiresAt: number };

type JsonObject = Record<string, unknown>;
type InsightValue = number | Record<string, unknown> | null;
type InsightItem = {
  name: string;
  period: string;
  title?: string;
  description?: string;
  values: { value: InsightValue; end_time?: string }[];
};

type IgAccountNormalized = {
  id: string;
  username: string;
  name: string | null;
  biography: string | null;
  website: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
};

type AccountResponse = {
  normalized: IgAccountNormalized;
  account?: JsonObject;
  meta?: JsonObject;
};

type InsightsBlock = {
  ok?: boolean;
  insights?: InsightItem[];
  metricsUsed?: string[];
  droppedMetrics?: string[];
  note?: string | null;
  period?: string;
  requestedMetrics?: string[];
};

type AccountInsightsResponse = {
  user: { id: string; username: string };
  performance?: InsightsBlock;
  audience?: InsightsBlock;
};

type MediaItem = {
  id: string;
  media_type?: string;
  media_product_type?: string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink?: string;
  timestamp?: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
};

type MediaListResponse = {
  user: { id: string; username: string };
  media: MediaItem[];
  paging: { cursors?: { after?: string }; next?: string } | null;
};

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

type MediaInsightsResponse = {
  media: {
    id: string;
    media_type: string | null;
    media_product_type: string | null;
  };
  requested: {
    metrics: string[];
    includeBreakdowns: boolean;
    includeDeprecated: boolean;
  };
  result: {
    baseInsights: InsightItem[];
    breakdowns: BreakdownResult[];
    metricsUsed: string[];
    droppedMetrics: string[];
    note: string | null;
  };
};

type IgCaps = {
  checkedAt: number;
  performance: string[];
  audience: string[];
};

type DashboardCache = {
  savedAt: number;
  account: IgAccountNormalized;
  perf: InsightItem[];
  audience: InsightItem[];
  media: MediaItem[];
  mediaPaging: MediaListResponse["paging"];
};

const CAPS_TTL_MS = 24 * 60 * 60 * 1000;
const DASHBOARD_CACHE_TTL_MS = 10 * 60 * 1000;

const IG_METRIC_LABELS: Record<string, string> = {
  reach: "Reach",
  profile_views: "Profile views",
  accounts_engaged: "Accounts engaged",
  follower_count: "Follower count (series)",
  website_clicks: "Website clicks",
  online_followers: "Online followers",
  views: "Views",
  saved: "Saved",
  shares: "Shares",
  likes: "Likes",
  comments: "Comments",
  total_interactions: "Total interactions",
  replies: "Replies",
  navigation: "Navigation",
  ig_reels_avg_watch_time: "Avg watch time (ms)",
  ig_reels_video_view_total_time: "Total view time (ms)",
  profile_activity: "Profile activity",
  profile_visits: "Profile visits",
  follows: "Follows",
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function pickErrorMessage(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;

  const msg = payload.message;
  if (typeof msg === "string") return msg;

  const err = payload.error;
  if (typeof err === "string") return err;
  if (isRecord(err) && typeof err.message === "string") return err.message;

  return undefined;
}

function readIgAuth(): IgAuth | null {
  const raw = localStorage.getItem("ig_auth");
  if (!raw) return null;

  try {
    const ig = JSON.parse(raw) as Partial<IgAuth>;
    if (
      typeof ig.accessToken !== "string" ||
      typeof ig.igUserId !== "string" ||
      typeof ig.expiresAt !== "number"
    ) {
      return null;
    }
    if (Date.now() >= ig.expiresAt) return null;
    return ig as IgAuth;
  } catch {
    return null;
  }
}

function capsKey(accountId: string) {
  return `ig_caps_${accountId}`;
}

function dashboardCacheKey(igUserId: string) {
  return `ig_dashboard_cache_${igUserId}`;
}

function readCaps(accountId: string): IgCaps | null {
  const raw = localStorage.getItem(capsKey(accountId));
  if (!raw) return null;

  try {
    const caps = JSON.parse(raw) as Partial<IgCaps>;
    if (
      typeof caps.checkedAt !== "number" ||
      !Array.isArray(caps.performance) ||
      !Array.isArray(caps.audience)
    ) {
      return null;
    }
    if (Date.now() - caps.checkedAt > CAPS_TTL_MS) return null;
    return {
      checkedAt: caps.checkedAt,
      performance: caps.performance.filter(
        (x): x is string => typeof x === "string"
      ),
      audience: caps.audience.filter((x): x is string => typeof x === "string"),
    };
  } catch {
    return null;
  }
}

function writeCaps(accountId: string, caps: IgCaps) {
  localStorage.setItem(capsKey(accountId), JSON.stringify(caps));
}

function readDashboardCache(igUserId: string): DashboardCache | null {
  const raw = sessionStorage.getItem(dashboardCacheKey(igUserId));
  if (!raw) return null;

  try {
    const cache = JSON.parse(raw) as Partial<DashboardCache>;
    if (
      typeof cache.savedAt !== "number" ||
      Date.now() - cache.savedAt > DASHBOARD_CACHE_TTL_MS ||
      !cache.account ||
      !Array.isArray(cache.perf) ||
      !Array.isArray(cache.audience) ||
      !Array.isArray(cache.media)
    ) {
      return null;
    }
    return cache as DashboardCache;
  } catch {
    return null;
  }
}

function writeDashboardCache(igUserId: string, cache: DashboardCache) {
  sessionStorage.setItem(dashboardCacheKey(igUserId), JSON.stringify(cache));
}

function toNumberOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function formatTimestamp(ts?: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function summarizeObjectValue(obj: Record<string, unknown>): string {
  const entries = Object.entries(obj);
  if (entries.length === 0) return "—";

  // if all numbers, show max
  const numeric = entries
    .map(([k, v]) => [k, typeof v === "number" ? v : null] as const)
    .filter(([, v]) => typeof v === "number" && Number.isFinite(v));

  if (numeric.length > 0) {
    numeric.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    const [k, v] = numeric[0];
    return `${(v ?? 0).toLocaleString()} at ${k}`;
  }

  return `${entries.length} items`;
}

function formatInsightValue(v: InsightValue): string {
  if (typeof v === "number" && Number.isFinite(v)) return v.toLocaleString();
  if (v && typeof v === "object") return summarizeObjectValue(v);
  return "—";
}

function getHttpStatus(err: unknown): number | null {
  if (!err || typeof err !== "object") return null;
  if (!("status" in err)) return null;
  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

async function fetchJson<T>(
  url: string,
  accessToken: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal,
  });

  const ct = res.headers.get("content-type") || "";
  const payload: unknown = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      typeof payload === "string"
        ? payload
        : pickErrorMessage(payload) ?? "Request failed";
    const error = new Error(`${msg} (HTTP ${res.status})`);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }

  return payload as T;
}

function metricLabel(m: InsightItem): string {
  return IG_METRIC_LABELS[m.name] ?? m.title ?? m.name;
}

const chartLabels = Array.from({ length: 14 }, (_, i) => `D${i + 1}`);

const chartOptions: Array<{
  id: string;
  label: string;
  title: string;
  value: string;
  description: string;
  xLabels: string[];
  series: LineSeries[];
}> = [
  {
    id: "reach",
    label: "Reach",
    title: "Reach",
    value: "19.5K",
    description: "Unique accounts reached",
    xLabels: chartLabels,
    series: [
      {
        data: [
          1200, 1700, 2400, 2100, 1900, 2600, 3200, 3000, 2800, 3500, 4100,
          3900, 3800, 4200,
        ],
        color: "#4584E9",
      },
    ],
  },
  {
    id: "profile-views",
    label: "Profile views",
    title: "Profile views",
    value: "3.1K",
    description: "Profile visits this week",
    xLabels: chartLabels,
    series: [
      {
        data: [
          320, 360, 410, 390, 380, 430, 520, 480, 470, 530, 610, 560, 520, 590,
        ],
        color: "#3FA7A7",
      },
    ],
  },
  {
    id: "engaged",
    label: "Accounts engaged",
    title: "Accounts engaged",
    value: "2.4K",
    description: "Likes, comments, shares",
    xLabels: chartLabels,
    series: [
      {
        data: [
          210, 260, 330, 290, 280, 340, 360, 390, 410, 460, 520, 480, 470, 510,
        ],
        color: "#F59E0B",
      },
    ],
  },
];

function isAbortError(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === "AbortError") ||
    (err instanceof Error && err.name === "AbortError") ||
    (err instanceof Error && /aborted|aborterror/i.test(err.message))
  );
}

export function Dashboard() {
  const { isDark, palette } = useDashboardTheme();

  // instagram state
  const [igConnected, setIgConnected] = useState(false);
  const [igAccount, setIgAccount] = useState<IgAccountNormalized | null>(null);

  const [igPerf, setIgPerf] = useState<InsightItem[] | null>(null);
  const [igAudience, setIgAudience] = useState<InsightItem[] | null>(null);

  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);

  // media list
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaPaging, setMediaPaging] =
    useState<MediaListResponse["paging"]>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // media details
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [selectedInsights, setSelectedInsights] =
    useState<MediaInsightsResponse | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  // UI options
  const [showEmptyMetricCards, setShowEmptyMetricCards] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState(0);

  const pageClass = useMemo(
    () =>
      isDark
        ? "bg-black text-white"
        : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900",
    [isDark]
  );

  const panelClass = `${palette.card} rounded-3xl backdrop-blur border ${palette.border}`;
  const softCardClass = `rounded-2xl border ${palette.border} ${palette.card}`;

  const connectButtonClass = `px-4 py-2 text-sm rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`;

  const handleIgAuthFailure = (err: unknown) => {
    const status = getHttpStatus(err);
    if (status === 401 || status === 403) {
      localStorage.removeItem("ig_auth");
      setIgConnected(false);
      setIgError("Instagram session expired. Please reconnect.");
      return true;
    }
    return false;
  };

  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selected) return;

    const id = window.setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [selected]);

  // initial connected check
  useEffect(() => {
    const auth = readIgAuth();
    setIgConnected(Boolean(auth));
    if (!auth) localStorage.removeItem("ig_auth");
  }, []);

  // load account + insights + media list
  useEffect(() => {
    if (!igConnected) {
      setIgAccount(null);
      setIgPerf(null);
      setIgAudience(null);
      setMedia([]);
      setMediaPaging(null);
      setIgError(null);
      setMediaError(null);
      return;
    }

    const auth = readIgAuth();
    if (!auth) {
      setIgConnected(false);
      localStorage.removeItem("ig_auth");
      return;
    }

    const cached = readDashboardCache(auth.igUserId);
    if (cached) {
      setIgAccount(cached.account);
      setIgPerf(cached.perf);
      setIgAudience(cached.audience);
      setMedia(cached.media);
      setMediaPaging(cached.mediaPaging ?? null);
      setIgError(null);
      setMediaError(null);
      setIgLoading(false);
      setMediaLoading(false);
      return;
    }

    const ac = new AbortController();
    const accessToken = auth.accessToken;

    (async () => {
      setIgLoading(true);
      setIgError(null);

      // 1) account
      const accountRes = await fetchJson<AccountResponse>(
        "/api/instagram/account",
        accessToken,
        ac.signal
      );
      setIgAccount(accountRes.normalized);

      // 2) insights with caps cache
      const accountId = accountRes.normalized.id;
      const caps = readCaps(accountId);
      let perfInsights: InsightItem[] = [];
      let audInsights: InsightItem[] = [];

      if (caps) {
        const perfQs = new URLSearchParams({
          kind: "performance",
          period: "day",
          metric: caps.performance.join(","),
        });

        const audQs = new URLSearchParams({
          kind: "audience",
          audienceMetric: caps.audience.join(","),
        });

        const [perfRes, audRes] = await Promise.all([
          fetchJson<AccountInsightsResponse>(
            `/api/instagram/account/insights?${perfQs.toString()}`,
            accessToken,
            ac.signal
          ),
          fetchJson<AccountInsightsResponse>(
            `/api/instagram/account/insights?${audQs.toString()}`,
            accessToken,
            ac.signal
          ),
        ]);

        const perf = perfRes.performance;
        const aud = audRes.audience;
        perfInsights = perf?.ok ? perf.insights ?? [] : [];
        audInsights = aud?.ok ? aud.insights ?? [] : [];

        setIgPerf(perfInsights);
        setIgAudience(audInsights);

        writeCaps(accountId, {
          checkedAt: Date.now(),
          performance:
            (perf?.metricsUsed && perf.metricsUsed.length > 0
              ? perf.metricsUsed
              : caps.performance) ?? [],
          audience:
            (aud?.metricsUsed && aud.metricsUsed.length > 0
              ? aud.metricsUsed
              : caps.audience) ?? [],
        });
      } else {
        const allRes = await fetchJson<AccountInsightsResponse>(
          "/api/instagram/account/insights?kind=all&period=day",
          accessToken,
          ac.signal
        );

        const perf = allRes.performance;
        const aud = allRes.audience;

        perfInsights = perf?.ok ? perf.insights ?? [] : [];
        audInsights = aud?.ok ? aud.insights ?? [] : [];

        setIgPerf(perfInsights);
        setIgAudience(audInsights);

        const perfCaps =
          (perf?.metricsUsed && perf.metricsUsed.length > 0
            ? perf.metricsUsed
            : perfInsights.map((x) => x.name)) ?? [];

        const audCaps =
          (aud?.metricsUsed && aud.metricsUsed.length > 0
            ? aud.metricsUsed
            : audInsights.map((x) => x.name)) ?? [];

        writeCaps(accountId, {
          checkedAt: Date.now(),
          performance: perfCaps,
          audience: audCaps,
        });
      }

      // 3) media list first page
      setMediaLoading(true);
      setMediaError(null);

      const mediaRes = await fetchJson<MediaListResponse>(
        "/api/instagram/media?limit=10",
        accessToken,
        ac.signal
      );
      setMedia(mediaRes.media ?? []);
      setMediaPaging(mediaRes.paging ?? null);

      writeDashboardCache(auth.igUserId, {
        savedAt: Date.now(),
        account: accountRes.normalized,
        perf: perfInsights,
        audience: audInsights,
        media: mediaRes.media ?? [],
        mediaPaging: mediaRes.paging ?? null,
      });
    })()
      .catch((err) => {
        if (ac.signal.aborted || isAbortError(err)) return;
        console.error(err);
        if (handleIgAuthFailure(err)) return;
        setIgError(
          err instanceof Error ? err.message : "Failed to load Instagram data"
        );
      })
      .finally(() => {
        setIgLoading(false);
        setMediaLoading(false);
      });

    return () => ac.abort();
  }, [igConnected]);

  // load more media
  async function loadMoreMedia() {
    const auth = readIgAuth();
    if (!auth) return;

    const after = mediaPaging?.cursors?.after;
    if (!after) return;

    setMediaLoading(true);
    setMediaError(null);

    try {
      const qs = new URLSearchParams({ limit: "10", after });
      const out = await fetchJson<MediaListResponse>(
        `/api/instagram/media?${qs.toString()}`,
        auth.accessToken
      );
      setMedia((prev) => {
        const next = [...prev, ...(out.media ?? [])];
        if (igAccount) {
          writeDashboardCache(auth.igUserId, {
            savedAt: Date.now(),
            account: igAccount,
            perf: igPerf ?? [],
            audience: igAudience ?? [],
            media: next,
            mediaPaging: out.paging ?? null,
          });
        }
        return next;
      });
      setMediaPaging(out.paging ?? null);
    } catch (e) {
      if (isAbortError(e)) return;
      console.error(e);
      if (handleIgAuthFailure(e)) return;
      setMediaError(
        e instanceof Error ? e.message : "Failed to load more media"
      );
    } finally {
      setMediaLoading(false);
    }
  }

  // media details fetch
  async function openMediaDetails(item: MediaItem) {
    setSelected(item);
    setSelectedInsights(null);
    setSelectedError(null);
    setSelectedLoading(true);

    const auth = readIgAuth();
    if (!auth) {
      setSelectedLoading(false);
      setSelectedError("Missing Instagram auth");
      return;
    }

    try {
      const out = await fetchJson<MediaInsightsResponse>(
        `/api/instagram/media/${encodeURIComponent(item.id)}/insights`,
        auth.accessToken
      );
      setSelectedInsights(out);
    } catch (e) {
      if (isAbortError(e)) return;
      console.error(e);
      if (handleIgAuthFailure(e)) return;
      setSelectedError(
        e instanceof Error ? e.message : "Failed to load media insights"
      );
    } finally {
      setSelectedLoading(false);
    }
  }

  const combinedInsightCards = useMemo(() => {
    const perf = igPerf ?? [];
    const aud = igAudience ?? [];
    const all = [...perf, ...aud];

    if (showEmptyMetricCards) return all;

    return all.filter((m) => {
      const last = m.values?.at(-1)?.value ?? null;

      // hide empty object values (online_followers often returns {})
      if (last && typeof last === "object") {
        return Object.keys(last).length > 0;
      }

      // hide meaningless 0 follower_count series if we already have real followers count
      if (
        m.name === "follower_count" &&
        typeof last === "number" &&
        last === 0
      ) {
        const realFollowers = igAccount?.followersCount ?? null;
        return realFollowers === null || realFollowers === 0;
      }

      return true;
    });
  }, [igPerf, igAudience, showEmptyMetricCards, igAccount?.followersCount]);

  const inferredPostsCount = useMemo(() => {
    // if account mediaCount is 0/unknown, but we do have media list, show that
    const accountCount = igAccount?.mediaCount ?? null;
    if (accountCount && accountCount > 0) return accountCount;
    if (media.length > 0) return media.length;
    return accountCount ?? 0;
  }, [igAccount?.mediaCount, media.length]);

  const isInstagramConnected = igConnected;
  const activeChart = chartOptions[activeChartIndex] ?? chartOptions[0];


  return (
    <div
      className={`relative overflow-hidden min-h-screen ${pageClass} transition-colors`}
    >
      <div className="relative max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Instagram panel */}
        <div className={`${panelClass} p-6 space-y-4`}>
          <div className="flex items-center justify-between gap-4">
            <div className="text-base">
              Instagram: <b>{igConnected ? "Connected" : "Not connected"}</b>
            </div>

            <div className="flex items-center gap-2">
              {igConnected && (
                <button
                  className={`px-3 py-2 text-sm rounded-full border ${palette.border}`}
                  onClick={() => {
                    // cache reset (optional)
                    if (igAccount?.id)
                      localStorage.removeItem(capsKey(igAccount.id));
                    const auth = readIgAuth();
                    if (auth)
                      sessionStorage.removeItem(
                        dashboardCacheKey(auth.igUserId)
                      );
                    window.location.reload();
                  }}
                >
                  Refresh metrics
                </button>
              )}

              <button
                className={connectButtonClass}
                onClick={() => {
                  window.location.href = "/api/instagram/login";
                }}
              >
                {igConnected ? "Reconnect Instagram" : "Connect Instagram"}
              </button>
            </div>
          </div>

          {igLoading && <div>Loading Instagram data…</div>}
          {igError && <div className="text-red-500">{igError}</div>}

          {igConnected && igAccount && (
            <div className={`${softCardClass} p-5`}>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200/60 overflow-hidden shrink-0">
                  {igAccount.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={igAccount.profilePictureUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="text-xl font-semibold">
                    {igAccount.name ?? igAccount.username}
                  </div>
                  <div className="text-sm opacity-70">
                    @{igAccount.username}
                  </div>

                  {igAccount.biography && (
                    <div className="mt-2 text-sm whitespace-pre-wrap opacity-90">
                      {igAccount.biography}
                    </div>
                  )}

                  {igAccount.website && (
                    <div className="mt-2 text-sm opacity-80">
                      {igAccount.website}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div>
                      <b>{igAccount.followersCount ?? "—"}</b> followers
                    </div>
                    <div>
                      <b>{igAccount.followsCount ?? "—"}</b> following
                    </div>
                    <div>
                      <b>{inferredPostsCount}</b> posts
                    </div>
                  </div>
                </div>

                <label className="text-sm flex items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={showEmptyMetricCards}
                    onChange={(e) => setShowEmptyMetricCards(e.target.checked)}
                  />
                  show empty metrics
                </label>
              </div>
            </div>
          )}

          {igConnected && !igLoading && combinedInsightCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combinedInsightCards.map((m) => {
                const last = m.values?.at(-1)?.value ?? null;
                return (
                  <div
                    key={`${m.name}:${m.period}`}
                    className={`${softCardClass} p-4`}
                  >
                    <div className="text-sm opacity-70">{metricLabel(m)}</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {formatInsightValue(last)}
                    </div>
                    {m.description ? (
                      <div className="mt-2 text-xs opacity-60 line-clamp-2">
                        {m.description}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          {igConnected && igAccount && activeChart && (
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap gap-2">
                {chartOptions.map((chart, index) => {
                  const isActive = index === activeChartIndex;
                  return (
                    <button
                      key={chart.id}
                      type="button"
                      onClick={() => setActiveChartIndex(index)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                        palette.border
                      } ${isActive ? palette.accentButton : "bg-transparent"}`}
                    >
                      {chart.label}
                    </button>
                  );
                })}
              </div>

              <ChartCard
                title={activeChart.title}
                value={activeChart.value}
                description={activeChart.description}
                xLabels={activeChart.xLabels}
                series={activeChart.series}
              />
            </div>
          )}
        </div>

        {!isInstagramConnected && (
          <div
            className={`${softCardClass} p-5 flex items-center justify-between gap-4`}
          >
            <div>
              <div className="text-sm font-semibold">Connect Instagram</div>
              <div className="text-xs opacity-70">
                Connect your account to see analytics charts.
              </div>
            </div>
            <button
              className={connectButtonClass}
              onClick={() => {
                window.location.href = "/api/instagram/login";
              }}
            >
              Connect Instagram
            </button>
          </div>
        )}
        {/* Media grid */}
        {igConnected && (
          <div className={`${panelClass} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Recent media</div>
              {mediaLoading && (
                <div className="text-sm opacity-70">Loading…</div>
              )}
            </div>

            {mediaError && <div className="text-red-500">{mediaError}</div>}

            {media.length === 0 && !mediaLoading ? (
              <div className="text-sm opacity-70">
                No media returned from API (or the account has very limited
                access).
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map((item) => {
                  const preview = item.thumbnail_url ?? item.media_url ?? null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => openMediaDetails(item)}
                      className={`${softCardClass} p-3 text-left hover:opacity-95 transition ${
                        selected?.id === item.id
                          ? "ring-2 ring-indigo-500/40"
                          : ""
                      }`}
                    >
                      <div className="rounded-xl overflow-hidden bg-slate-200/40 aspect-video">
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt={item.id}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="mt-3 space-y-1">
                        <div className="text-xs opacity-70">
                          {(
                            item.media_product_type ??
                            item.media_type ??
                            "MEDIA"
                          ).toString()}{" "}
                          • {formatTimestamp(item.timestamp)}
                        </div>

                        {item.caption ? (
                          <div className="text-sm line-clamp-2">
                            {item.caption}
                          </div>
                        ) : (
                          <div className="text-sm opacity-60">No caption</div>
                        )}

                        <div className="text-xs opacity-70 flex gap-3">
                          <span>
                            ♥ {toNumberOrNull(item.like_count) ?? "—"}
                          </span>
                          <span>
                            💬 {toNumberOrNull(item.comments_count) ?? "—"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {mediaPaging?.next ? (
              <div>
                <button
                  className={connectButtonClass}
                  onClick={loadMoreMedia}
                  disabled={mediaLoading}
                >
                  Load more
                </button>
              </div>
            ) : null}
            {/* Inline media details (instead of modal) */}
            {selected && (
              <div
                ref={detailsRef}
                className={`${softCardClass} p-5 space-y-4`}
                style={{ scrollMarginTop: 24 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">Media details</div>
                    <div className="text-xs opacity-70">
                      {selected.media_product_type ??
                        selected.media_type ??
                        "MEDIA"}{" "}
                      • {formatTimestamp(selected.timestamp)}
                    </div>
                  </div>

                  <button
                    className={`px-3 py-2 text-sm rounded-full border ${palette.border}`}
                    onClick={() => {
                      setSelected(null);
                      setSelectedInsights(null);
                      setSelectedError(null);
                    }}
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* left: preview + caption */}
                  <div className={`${softCardClass} p-3 space-y-3`}>
                    <div className="rounded-xl overflow-hidden bg-slate-200/40">
                      {selected.media_url ? (
                        selected.media_type === "VIDEO" ||
                        selected.media_product_type === "REELS" ? (
                          <video
                            controls
                            className="w-full h-auto"
                            src={selected.media_url}
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selected.media_url}
                            alt={selected.id}
                            className="w-full h-auto object-cover"
                          />
                        )
                      ) : selected.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selected.thumbnail_url}
                          alt={selected.id}
                          className="w-full h-auto object-cover"
                        />
                      ) : null}
                    </div>

                    {selected.caption ? (
                      <div className="text-sm whitespace-pre-wrap">
                        {selected.caption}
                      </div>
                    ) : (
                      <div className="text-sm opacity-60">No caption</div>
                    )}

                    {selected.permalink ? (
                      <a
                        href={selected.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm opacity-80 break-all underline"
                      >
                        Open on Instagram
                      </a>
                    ) : null}
                  </div>

                  {/* right: insights */}
                  <div className={`${softCardClass} p-3 space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Insights</div>
                      {selectedLoading ? (
                        <div className="text-sm opacity-70">Loading…</div>
                      ) : null}
                    </div>

                    {selectedError && (
                      <div className="text-red-500">{selectedError}</div>
                    )}

                    {selectedInsights && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedInsights.result.baseInsights.map((m) => {
                            const last = m.values?.at(-1)?.value ?? null;
                            return (
                              <div
                                key={`${m.name}:${m.period}`}
                                className={`rounded-xl border ${palette.border} p-3`}
                              >
                                <div className="text-xs opacity-70">
                                  {metricLabel(m)}
                                </div>
                                <div className="text-lg font-semibold">
                                  {formatInsightValue(last)}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {selectedInsights.result.breakdowns.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold">
                              Breakdowns
                            </div>

                            {selectedInsights.result.breakdowns.map(
                              (b, idx) => {
                                if (b.kind === "breakdown_error") {
                                  const msg =
                                    typeof b.error === "string"
                                      ? b.error
                                      : pickErrorMessage(b.error) ??
                                        "Breakdown failed";
                                  return (
                                    <div
                                      key={idx}
                                      className="text-sm text-red-500"
                                    >
                                      {b.metric} ({b.breakdown}): {msg}
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`rounded-xl border ${palette.border} p-3`}
                                  >
                                    <div className="text-xs opacity-70">
                                      {b.metric} • {b.breakdown}
                                    </div>

                                    {b.insights.length === 0 ? (
                                      <div className="text-sm opacity-60">
                                        No breakdown data
                                      </div>
                                    ) : (
                                      <div className="mt-2 space-y-2">
                                        {b.insights.map((m) => {
                                          const last =
                                            m.values?.at(-1)?.value ?? null;
                                          return (
                                            <div
                                              key={`${m.name}:${m.period}`}
                                              className="flex items-center justify-between gap-3 text-sm"
                                            >
                                              <span className="opacity-80">
                                                {metricLabel(m)}
                                              </span>
                                              <b>{formatInsightValue(last)}</b>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                        {selectedInsights.result.droppedMetrics.length > 0 ? (
                          <div className="text-xs opacity-70">
                            Dropped metrics:{" "}
                            {selectedInsights.result.droppedMetrics.join(", ")}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
