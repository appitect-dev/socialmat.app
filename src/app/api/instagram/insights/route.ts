import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.replace("Bearer ", "");
  const noStore = { cache: "no-store" as const };

  // 1️⃣ Get IG user
  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(
      accessToken
    )}`,
    noStore
  );
  const meData = await meRes.json();

  if (!meRes.ok || !meData.id) {
    return NextResponse.json(
      { error: "Invalid token", details: meData },
      { status: 401 }
    );
  }

  // 2️⃣ Get last 10 media items
  const mediaRes = await fetch(
    `https://graph.instagram.com/${meData.id}/media` +
      `?fields=id,media_type,media_url,permalink,timestamp` +
      `&limit=10` +
      `&access_token=${encodeURIComponent(accessToken)}`,
    noStore
  );

  const mediaData = await mediaRes.json();

  if (!mediaRes.ok) {
    return NextResponse.json(
      { error: "Failed to load media", details: mediaData },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: {
      id: meData.id,
      username: meData.username,
    },
    media: mediaData.data,
    paging: mediaData.paging ?? null,
  });
}
