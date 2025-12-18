import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.replace("Bearer ", "");

  // 1️⃣ Get IG user (Instagram Graph)
  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );
  const meData = await meRes.json();

  if (!meRes.ok || !meData.id) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const igUserId = meData.id;

  // 2️⃣ Daily metrics (Facebook Graph)
  const dailyRes = await fetch(
    `https://graph.facebook.com/v19.0/${igUserId}/insights` +
      `?metric=reach,profile_views,&period=day&access_token=${accessToken}`
  );
  const dailyData = await dailyRes.json();

  if (!dailyRes.ok) {
    return NextResponse.json(dailyData, { status: 500 });
  }

  // 3️⃣ Lifetime metrics (Facebook Graph)
  const lifetimeRes = await fetch(
    `https://graph.facebook.com/v19.0/${igUserId}/insights` +
      `?metric=follower_count&period=lifetime&access_token=${accessToken}`
  );
  const lifetimeData = await lifetimeRes.json();

  if (!lifetimeRes.ok) {
    return NextResponse.json(lifetimeData, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: igUserId,
      username: meData.username,
    },
    insights: [...dailyData.data, ...lifetimeData.data],
  });
}
