import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.replace("Bearer ", "");
  const noStore = { cache: "no-store" as const };

  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username,profile_picture_url,followers_count&access_token=${encodeURIComponent(
      accessToken
    )}`,
    noStore
  );

  const meData = await meRes.json();

  if (!meRes.ok || !meData.id) {
    return NextResponse.json(
      { error: "Failed to load account summary", details: meData },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: meData.id,
    username: meData.username,
    profilePicture: meData.profile_picture_url,
    followersCount: meData.followers_count,
  });
}
