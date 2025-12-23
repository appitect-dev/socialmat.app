"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";
import { useDashboardTheme } from "./dashboard-theme";

type IgAuth = {
  accessToken: string;
  igUserId: string;
  expiresAt: number;
};

type IgAccount = {
  id: string;
  username: string;
  profilePicture?: string | null;
  followersCount?: number | null;
};

type IgInsightMetric = {
  name: string;
  period?: string;
  title?: string;
  description?: string;
  values: Array<{ value: number | Record<string, number>; end_time?: string }>;
};

type IgMediaItem = {
  id: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  caption?: string;
  thumbnail_url?: string;
};

type MediaResponse = {
  user?: { id: string; username: string };
  media: IgMediaItem[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
  } | null;
};

const IG_METRIC_LABELS: Record<string, string> = {
  reach: "Reach",
  profile_views: "Profile views",
  accounts_engaged: "Accounts engaged",
  follower_count: "Followers",
  impressions: "Impressions",
  plays: "Plays",
  video_views: "Video views",
  likes: "Likes",
  comments: "Comments",
  saves: "Saves",
  shares: "Shares",
  replies: "Replies",
};

interface VideoData {
  file: File;
  url: string;
  uploadDate: Date;
  duration: number;
  resolution?: string;
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readPayload(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;

  if (typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    const error = p["error"];

    if (error && typeof error === "object") {
      const e = error as Record<string, unknown>;
      if (typeof e["message"] === "string") return e["message"];
    }

    if (typeof p["message"] === "string") return p["message"];
    if (typeof p["details"] === "object" && p["details"]) {
      const d = p["details"] as Record<string, unknown>;
      const de = d["error"];
      if (de && typeof de === "object") {
        const ee = de as Record<string, unknown>;
        if (typeof ee["message"] === "string") return ee["message"];
      }
    }
  }

  return fallback;
}

export function Dashboard() {
  const { isDark, palette } = useDashboardTheme();

  // Video states
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<
    "uploaded" | "processing" | "ready"
  >("uploaded");

  // IG auth/state
  const [igAuth, setIgAuth] = useState<IgAuth | null>(null);
  const igConnected = useMemo(() => {
    if (!igAuth) return false;
    return (
      typeof igAuth.expiresAt === "number" && Date.now() < igAuth.expiresAt
    );
  }, [igAuth]);

  // IG data
  const [igAccount, setIgAccount] = useState<IgAccount | null>(null);
  const [igAccountInsights, setIgAccountInsights] = useState<
    IgInsightMetric[] | null
  >(null);

  const [media, setMedia] = useState<IgMediaItem[]>([]);
  const [mediaAfter, setMediaAfter] = useState<string | null>(null); // cursor for load-more

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [mediaInsightsById, setMediaInsightsById] = useState<
    Record<string, IgInsightMetric[]>
  >({});

  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);
  const [mediaLoadingMore, setMediaLoadingMore] = useState(false);
  const [mediaDetailLoading, setMediaDetailLoading] = useState(false);

  // ---- Video handlers
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

  // ---- Load auth from localStorage once
  useEffect(() => {
    const parsed = safeJsonParse<IgAuth>(localStorage.getItem("ig_auth"));
    if (!parsed) {
      setIgAuth(null);
      return;
    }
    if (
      typeof parsed.expiresAt !== "number" ||
      Date.now() >= parsed.expiresAt
    ) {
      localStorage.removeItem("ig_auth");
      setIgAuth(null);
      return;
    }
    setIgAuth(parsed);
  }, []);

  // ---- Fetch IG: account header + account insights + media list (first page)
  useEffect(() => {
    if (!igConnected || !igAuth?.accessToken) return;

    const accessToken = igAuth.accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    setIgLoading(true);
    setIgError(null);

    // reset data on (re)connect
    setIgAccount(null);
    setIgAccountInsights(null);
    setMedia([]);
    setMediaAfter(null);
    setSelectedMediaId(null);

    const p1 = fetch("/api/instagram/account", { headers, cache: "no-store" })
      .then(async (res) => {
        const payload = await readPayload(res);
        if (!res.ok)
          throw new Error(
            `${extractErrorMessage(payload, "Failed to load account")} (HTTP ${
              res.status
            })`
          );
        return payload as IgAccount;
      })
      .then(setIgAccount);

    const p2 = fetch("/api/instagram/account/insights", {
      headers,
      cache: "no-store",
    })
      .then(async (res) => {
        const payload = await readPayload(res);
        if (!res.ok)
          throw new Error(
            `${extractErrorMessage(
              payload,
              "Failed to load account insights"
            )} (HTTP ${res.status})`
          );
        // očekávám { insights: [...] }, ale toleruju i čisté pole
        const insights = Array.isArray(payload) ? payload : payload?.insights;
        setIgAccountInsights(
          Array.isArray(insights) ? (insights as IgInsightMetric[]) : null
        );
      })
      .catch((e) => {
        // Account insights mohou být někdy nedostupné dle účtu/permissions — nechci tím shodit celý dashboard.
        console.warn("Account insights not available:", e);
        setIgAccountInsights(null);
      });

    const p3 = fetch("/api/instagram/media?limit=10", {
      headers,
      cache: "no-store",
    })
      .then(async (res) => {
        const payload = await readPayload(res);
        if (!res.ok)
          throw new Error(
            `${extractErrorMessage(payload, "Failed to load media")} (HTTP ${
              res.status
            })`
          );
        return payload as MediaResponse;
      })
      .then((data) => {
        setMedia(Array.isArray(data.media) ? data.media : []);
        const after = data?.paging?.cursors?.after ?? null;
        setMediaAfter(after);
      });

    Promise.all([p1, p2, p3])
      .catch((err) => {
        console.error(err);
        setIgError(
          err instanceof Error ? err.message : "Instagram load failed"
        );
      })
      .finally(() => setIgLoading(false));
  }, [igConnected, igAuth?.accessToken]);

  // ---- Load more media (expects your /api/instagram/media to accept ?after= cursor)
  const loadMoreMedia = async () => {
    if (!igConnected || !igAuth?.accessToken) return;
    if (!mediaAfter) return;

    setMediaLoadingMore(true);
    setIgError(null);

    try {
      const res = await fetch(
        `/api/instagram/media?limit=10&after=${encodeURIComponent(mediaAfter)}`,
        {
          headers: { Authorization: `Bearer ${igAuth.accessToken}` },
          cache: "no-store",
        }
      );
      const payload = await readPayload(res);
      if (!res.ok)
        throw new Error(
          `${extractErrorMessage(payload, "Failed to load more media")} (HTTP ${
            res.status
          })`
        );

      const data = payload as MediaResponse;
      const nextItems = Array.isArray(data.media) ? data.media : [];
      setMedia((prev) => [...prev, ...nextItems]);

      const after = data?.paging?.cursors?.after ?? null;
      setMediaAfter(after);
    } catch (e) {
      console.error(e);
      setIgError(e instanceof Error ? e.message : "Failed to load more media");
    } finally {
      setMediaLoadingMore(false);
    }
  };

  // ---- Open media details and fetch its insights (cached per mediaId)
  const openMedia = async (mediaId: string) => {
    setSelectedMediaId((prev) => (prev === mediaId ? null : mediaId));

    if (!igConnected || !igAuth?.accessToken) return;
    if (mediaInsightsById[mediaId]) return; // cached
    if (selectedMediaId === mediaId) return; // closing

    setMediaDetailLoading(true);
    setIgError(null);

    try {
      const res = await fetch(
        `/api/instagram/media/${encodeURIComponent(mediaId)}/insights`,
        {
          headers: { Authorization: `Bearer ${igAuth.accessToken}` },
          cache: "no-store",
        }
      );
      const payload = await readPayload(res);
      if (!res.ok)
        throw new Error(
          `${extractErrorMessage(
            payload,
            "Failed to load media insights"
          )} (HTTP ${res.status})`
        );

      const insights = Array.isArray(payload) ? payload : payload?.insights;
      const normalized = Array.isArray(insights)
        ? (insights as IgInsightMetric[])
        : [];
      setMediaInsightsById((prev) => ({ ...prev, [mediaId]: normalized }));
    } catch (e) {
      console.error(e);
      setIgError(
        e instanceof Error ? e.message : "Failed to load media insights"
      );
    } finally {
      setMediaDetailLoading(false);
    }
  };

  // ---- Video metadata effect
  useEffect(() => {
    if (!videoData?.url) return;

    const v = document.createElement("video");
    v.src = videoData.url;

    v.onloadedmetadata = () => {
      const resolution = `${v.videoWidth} × ${v.videoHeight}`;
      setVideoDuration(v.duration);
      setVideoData((prev) =>
        prev ? { ...prev, duration: v.duration, resolution } : null
      );
    };

    return () => {
      v.src = "";
      v.load();
      URL.revokeObjectURL(videoData.url);
    };
  }, [videoData?.url]);

  const pageClass = isDark
    ? "bg-black text-white"
    : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900";

  const cardClass = `rounded-2xl border ${palette.border} ${palette.card} backdrop-blur`;

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${pageClass} transition-colors`}
    >
      {/* background */}
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      )}
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140%] h-[120%] rounded-full blur-[160px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,70,229,0.22), rgba(14,165,233,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Instagram section */}
        <section className={`p-5 ${cardClass}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Instagram</div>
              <div className="text-lg font-semibold">
                {igConnected ? "Connected" : "Not connected"}
              </div>
            </div>

            <button
              className={`px-4 py-2 text-sm rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
              onClick={() => {
                window.location.href = "/api/instagram/login";
              }}
            >
              {igConnected ? "Reconnect" : "Connect Instagram"}
            </button>
          </div>

          {igLoading && (
            <div className="mt-4 text-sm opacity-70">
              Loading Instagram data…
            </div>
          )}
          {igError && (
            <div className="mt-4 text-sm text-red-500">{igError}</div>
          )}

          {igConnected && !igLoading && (
            <div className="mt-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                {igAccount?.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={igAccount.profilePicture}
                    alt=""
                    className="w-12 h-12 rounded-full border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center text-xs opacity-70">
                    —
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {igAccount?.username ? `@${igAccount.username}` : "—"}
                  </div>
                  <div className="text-sm opacity-70">
                    Followers: {igAccount?.followersCount ?? "—"}
                  </div>
                </div>
              </div>

              {/* Account insights */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  Account insights
                </div>
                {igAccountInsights && igAccountInsights.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {igAccountInsights.map((m) => {
                      const label =
                        IG_METRIC_LABELS[m.name] ?? m.title ?? m.name;
                      const last = m.values?.at(-1)?.value;
                      const value =
                        typeof last === "number"
                          ? last
                          : last && typeof last === "object"
                          ? JSON.stringify(last)
                          : "—";

                      return (
                        <div key={m.name} className={`p-3 ${cardClass}`}>
                          <div className="text-xs opacity-70">{label}</div>
                          <div className="text-lg font-semibold break-words">
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm opacity-70">
                    No account insights available.
                  </div>
                )}
              </div>

              {/* Media list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Posts</div>
                  <button
                    className={`px-3 py-1.5 text-xs rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
                    onClick={loadMoreMedia}
                    disabled={!mediaAfter || mediaLoadingMore}
                    title={!mediaAfter ? "No more posts" : "Load more"}
                  >
                    {mediaLoadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>

                {media.length === 0 ? (
                  <div className="text-sm opacity-70">No media loaded.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {media.map((item) => {
                      const isOpen = selectedMediaId === item.id;
                      return (
                        <div key={item.id} className={`p-4 ${cardClass}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs opacity-70">
                                {item.media_type ?? "MEDIA"} •{" "}
                                {item.timestamp
                                  ? new Date(item.timestamp).toLocaleString()
                                  : "—"}
                              </div>
                              <div className="text-sm font-semibold truncate">
                                {item.caption ?? item.permalink ?? item.id}
                              </div>
                            </div>

                            <button
                              className={`px-3 py-1.5 text-xs rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
                              onClick={() => openMedia(item.id)}
                            >
                              {isOpen ? "Hide" : "Insights"}
                            </button>
                          </div>

                          {isOpen && (
                            <div className="mt-4">
                              {mediaDetailLoading &&
                                !mediaInsightsById[item.id] && (
                                  <div className="text-sm opacity-70">
                                    Loading media insights…
                                  </div>
                                )}

                              {mediaInsightsById[item.id] ? (
                                mediaInsightsById[item.id].length > 0 ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    {mediaInsightsById[item.id].map((m) => {
                                      const label =
                                        IG_METRIC_LABELS[m.name] ??
                                        m.title ??
                                        m.name;
                                      const last = m.values?.at(-1)?.value;
                                      const value =
                                        typeof last === "number"
                                          ? last
                                          : last && typeof last === "object"
                                          ? JSON.stringify(last)
                                          : "—";

                                      return (
                                        <div
                                          key={m.name}
                                          className={`p-3 ${cardClass}`}
                                        >
                                          <div className="text-xs opacity-70">
                                            {label}
                                          </div>
                                          <div className="text-lg font-semibold break-words">
                                            {value}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-sm opacity-70">
                                    No insights for this media.
                                  </div>
                                )
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Video section (unchanged from your flow) */}
        <section className="space-y-8">
          {!videoData && (
            <VideoUploader onVideoUploaded={handleVideoUploaded} />
          )}

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
        </section>
      </div>
    </div>
  );
}
