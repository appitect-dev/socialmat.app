import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length);

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ?? "10";
  const after = searchParams.get("after"); // cursor z paging.cursors.after

  // 1) Get IG user
  const meRes = await fetch(
    `${IG_BASE}/me?fields=id,username&access_token=${encodeURIComponent(
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

  // 2) Get media list (supports paging via "after")
  const params = new URLSearchParams({
    fields:
      "id,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,caption,like_count,comments_count",
    limit,
    access_token: accessToken,
  });
  if (after) params.set("after", after);

  const mediaRes = await fetch(
    `${IG_BASE}/${encodeURIComponent(meData.id)}/media?${params.toString()}`,
    NO_STORE
  );

  const mediaData = await mediaRes.json();

  if (!mediaRes.ok) {
    return NextResponse.json(
      { error: "Failed to load media", details: mediaData },
      { status: mediaRes.status }
    );
  }

  return NextResponse.json({
    user: { id: meData.id, username: meData.username },
    media: mediaData?.data ?? [],
    paging: mediaData?.paging ?? null,
  });
}
