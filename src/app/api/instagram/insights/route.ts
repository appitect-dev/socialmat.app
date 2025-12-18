import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.replace("Bearer ", "");

  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );

  const meData = await meRes.json();

  if (!meRes.ok || !meData.id) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const insightsRes = await fetch(
    `https://graph.instagram.com/${meData.id}/insights` +
      `?metric=reach,profile_views,accounts_engaged,follower_count&period=day&access_token=${accessToken}`
  );

  const insightsData = await insightsRes.json();

  if (!insightsRes.ok) {
    return NextResponse.json(insightsData, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: meData.id,
      username: meData.username,
    },
    insights: insightsData.data,
  });
}
