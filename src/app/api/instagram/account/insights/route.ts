import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };

// U Instagram API with Instagram Login se insights řeší v Instagram Platform.
// Base URL nechám konfigurovatelnou, default je graph.instagram.com (jak už používáš).
const IG_GRAPH_BASE =
  process.env.IG_GRAPH_BASE_URL ?? "https://graph.instagram.com";

function pickMetrics(raw: string | null) {
  if (!raw)
    return ["reach", "profile_views", "accounts_engaged", "follower_count"];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.replace("Bearer ", "");

  const { searchParams } = new URL(req.url);
  const metrics = pickMetrics(searchParams.get("metric"));
  const period = searchParams.get("period") ?? "day"; // default
  const since = searchParams.get("since"); // optional unix timestamp
  const until = searchParams.get("until"); // optional unix timestamp

  // 1) Get IG user id (consistent with your other routes)
  const meRes = await fetch(
    `${IG_GRAPH_BASE}/me?fields=id,username&access_token=${encodeURIComponent(
      accessToken
    )}`,
    NO_STORE
  );
  const meData = await meRes.json();

  if (!meRes.ok || !meData?.id) {
    return NextResponse.json(
      { error: "Invalid token", details: meData },
      { status: 401 }
    );
  }

  // 2) Account insights
  const params = new URLSearchParams({
    metric: metrics.join(","),
    period,
    access_token: accessToken,
  });

  if (since) params.set("since", since);
  if (until) params.set("until", until);

  const insightsRes = await fetch(
    `${IG_GRAPH_BASE}/${encodeURIComponent(
      meData.id
    )}/insights?${params.toString()}`,
    NO_STORE
  );

  const insightsData = await insightsRes.json();

  if (!insightsRes.ok) {
    return NextResponse.json(
      { error: "Failed to load account insights", details: insightsData },
      { status: insightsRes.status }
    );
  }

  return NextResponse.json({
    user: { id: meData.id, username: meData.username },
    insights: insightsData?.data ?? [],
  });
}
