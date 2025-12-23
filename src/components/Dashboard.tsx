"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";
import { useDashboardTheme } from "./dashboard-theme";

type IgAuth = { accessToken: string; igUserId: string; expiresAt: number };

type IgInsightValue = number | Record<string, unknown> | null;

interface IgInsightItem {
  name: string;
  period: string;
  title?: string;
  description?: string;
  values: { value: IgInsightValue; end_time?: string }[];
}

interface IgAccountNormalized {
  id: string;
  username: string;
  name: string | null;
  biography: string | null;
  website: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
}

interface AccountResponse {
  normalized: IgAccountNormalized;
}

interface InsightsBlock {
  ok?: boolean;
  insights?: IgInsightItem[];
  metricsUsed?: string[];
  droppedMetrics?: string[];
  note?: string | null;
}

interface AccountInsightsResponse {
  user: { id: string; username: string };
  performance?: InsightsBlock & {
    period?: string;
    requestedMetrics?: string[];
  };
  audience?: InsightsBlock & { period?: string; requestedMetrics?: string[] };
}

type IgCaps = {
  checkedAt: number;
  performance: string[];
  audience: string[];
};

const CAPS_TTL_MS = 24 * 60 * 60 * 1000;

const IG_METRIC_LABELS: Record<string, string> = {
  reach: "Reach",
  profile_views: "Profile views",
  accounts_engaged: "Accounts engaged",
  follower_count: "Follower count (series)",
  website_clicks: "Website clicks",
  online_followers: "Online followers",
};

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

function formatValue(v: IgInsightValue): string {
  if (typeof v === "number" && Number.isFinite(v)) return v.toLocaleString();
  if (v && typeof v === "object") {
    const keys = Object.keys(v);
    if (keys.length === 0) return "—";
    // nechceme spamovat UI obřím JSONem
    return `${keys.length} items`;
  }
  return "—";
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
        : (payload as any)?.error?.message ||
          (payload as any)?.error ||
          (payload as any)?.message ||
          "Request failed";
    throw new Error(`${msg} (HTTP ${res.status})`);
  }

  return payload as T;
}

export function Dashboard() {
  const { isDark, palette } = useDashboardTheme();

  // Video state (ponecháno)
  const [videoData, setVideoData] = useState<{
    file: File;
    url: string;
    uploadDate: Date;
    duration: number;
    resolution?: string;
  } | null>(null);

  const [videoDuration, setVideoDuration] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<
    "uploaded" | "processing" | "ready"
  >("uploaded");

  // Instagram state
  const [igConnected, setIgConnected] = useState(false);
  const [igAccount, setIgAccount] = useState<IgAccountNormalized | null>(null);
  const [igInsights, setIgInsights] = useState<IgInsightItem[] | null>(null);
  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);

  const pageClass = useMemo(
    () =>
      isDark
        ? "bg-black text-white"
        : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900",
    [isDark]
  );

  const handleVideoUploaded = (data: { file: File; url: string }) => {
    setVideoData({
      file: data.file,
      url: data.url,
      uploadDate: new Date(),
      duration: 0,
    });
    setProcessingStatus("uploaded");
  };

  const handleReset = () => {
    if (videoData?.url) URL.revokeObjectURL(videoData.url);
    setVideoData(null);
    setVideoDuration(0);
    setProcessingStatus("uploaded");
  };

  const handleSubtitlesSuccess = () => setProcessingStatus("ready");

  const handleSubtitlesError = (error: string) => {
    console.error("Subtitle generation error:", error);
    setProcessingStatus("uploaded");
  };

  // 1) initial igConnected check
  useEffect(() => {
    const auth = readIgAuth();
    setIgConnected(Boolean(auth));

    if (!auth) {
      localStorage.removeItem("ig_auth");
    }
  }, []);

  // 2) load IG data (account + insights) with capability caching
  useEffect(() => {
    if (!igConnected) {
      setIgAccount(null);
      setIgInsights(null);
      setIgError(null);
      return;
    }

    const auth = readIgAuth();
    if (!auth) {
      setIgConnected(false);
      localStorage.removeItem("ig_auth");
      return;
    }

    const ac = new AbortController();
    const accessToken = auth.accessToken;

    (async () => {
      setIgLoading(true);
      setIgError(null);

      // A) account (potřebujeme accountId pro caps key)
      const accountRes = await fetchJson<AccountResponse>(
        "/api/instagram/account",
        accessToken,
        ac.signal
      );
      const account = accountRes.normalized;
      setIgAccount(account);

      const accountId = account.id;
      const caps = readCaps(accountId);

      // B) insights
      if (caps) {
        // rychlá cesta – voláme jen to, co už víme, že funguje
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

        const perfInsights = perf?.ok ? perf.insights ?? [] : [];
        const audInsights = aud?.ok ? aud.insights ?? [] : [];

        setIgInsights([...perfInsights, ...audInsights]);

        // refresh caps timestamp (a případně update metricsUsed)
        const nextCaps: IgCaps = {
          checkedAt: Date.now(),
          performance:
            (perf?.metricsUsed && perf.metricsUsed.length > 0
              ? perf.metricsUsed
              : caps.performance) ?? [],
          audience:
            (aud?.metricsUsed && aud.metricsUsed.length > 0
              ? aud.metricsUsed
              : caps.audience) ?? [],
        };
        writeCaps(accountId, nextCaps);
      } else {
        // první běh – discovery (max) bez tlačítka
        const allRes = await fetchJson<AccountInsightsResponse>(
          "/api/instagram/account/insights?kind=all&period=day",
          accessToken,
          ac.signal
        );

        const perf = allRes.performance;
        const aud = allRes.audience;

        const perfInsights = perf?.ok ? perf.insights ?? [] : [];
        const audInsights = aud?.ok ? aud.insights ?? [] : [];

        setIgInsights([...perfInsights, ...audInsights]);

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
    })()
      .catch((err) => {
        console.error(err);
        setIgError(
          err instanceof Error ? err.message : "Failed to load Instagram"
        );
      })
      .finally(() => setIgLoading(false));

    return () => ac.abort();
  }, [igConnected]);

  // video metadata
  useEffect(() => {
    if (!videoData?.url) return;

    const video = document.createElement("video");
    video.src = videoData.url;
    video.onloadedmetadata = () => {
      const resolution = `${video.videoWidth} × ${video.videoHeight}`;
      setVideoDuration(video.duration);
      setVideoData((prev) =>
        prev ? { ...prev, duration: video.duration, resolution } : null
      );
    };

    return () => {
      video.src = "";
      video.load();
      URL.revokeObjectURL(videoData.url);
    };
  }, [videoData?.url]);

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${pageClass} transition-colors`}
    >
      <div style={{ marginBottom: 12 }}>
        Instagram: <b>{igConnected ? "Connected" : "Not connected"}</b>
      </div>

      <button
        onClick={() => {
          window.location.href = "/api/instagram/login";
        }}
      >
        {igConnected ? "Reconnect Instagram" : "Connect Instagram"}
      </button>

      {igConnected && (
        <div className="mt-4 space-y-3">
          {igLoading && <div>Loading Instagram data…</div>}
          {igError && <div className="text-red-500">{igError}</div>}

          {igAccount && (
            <div className={`p-4 rounded-xl border ${palette.border}`}>
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden">
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
                  <div className="text-lg font-semibold">
                    {igAccount.name ?? igAccount.username}
                  </div>
                  <div className="text-sm opacity-70">
                    @{igAccount.username}
                  </div>

                  {igAccount.biography && (
                    <div className="mt-2 text-sm whitespace-pre-wrap">
                      {igAccount.biography}
                    </div>
                  )}

                  <div className="mt-3 flex gap-4 text-sm">
                    <div>
                      <b>{igAccount.followersCount ?? "—"}</b> followers
                    </div>
                    <div>
                      <b>{igAccount.followsCount ?? "—"}</b> following
                    </div>
                    <div>
                      <b>{igAccount.mediaCount ?? "—"}</b> posts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {igInsights && (
            <div className="grid grid-cols-2 gap-4">
              {igInsights.map((metric) => {
                const last = metric.values?.at(-1)?.value ?? null;
                return (
                  <div
                    key={`${metric.name}:${metric.period}`}
                    className="p-3 rounded-lg border"
                  >
                    <div className="text-sm opacity-70">
                      {IG_METRIC_LABELS[metric.name] ??
                        metric.title ??
                        metric.name}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatValue(last)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* zbytek dashboardu (video) ponechán */}
      <div className="relative max-w-6xl mx-auto px-4 py-12 space-y-8">
        {!videoData && <VideoUploader onVideoUploaded={handleVideoUploaded} />}

        {videoData && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className={`px-4 py-2 text-sm rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
              >
                ← Nahrát nové video
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VideoPlayer src={videoData.url} />
              </div>

              <div className="space-y-6">
                <VideoInfo
                  fileName={videoData.file.name}
                  fileSize={videoData.file.size}
                  duration={videoDuration}
                  resolution={videoData.resolution}
                  uploadDate={videoData.uploadDate}
                  status={processingStatus}
                />

                <SubtitleGenerator
                  videoFile={videoData.file}
                  onSuccess={handleSubtitlesSuccess}
                  onError={handleSubtitlesError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
