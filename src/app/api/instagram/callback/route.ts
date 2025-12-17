import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard?ig=missing_code", req.url)
    );
  }

  const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    console.error("IG short token error", tokenData);
    return NextResponse.redirect(new URL("/dashboard?ig=short_error", req.url));
  }

  const llRes = await fetch(
    "https://graph.instagram.com/access_token?" +
      new URLSearchParams({
        grant_type: "ig_exchange_token",
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        access_token: tokenData.access_token,
      })
  );

  const llData = await llRes.json();

  if (!llRes.ok || !llData.access_token) {
    console.error("IG long token error", llData);
    return NextResponse.redirect(new URL("/dashboard?ig=long_error", req.url));
  }

  const expiresAt = new Date(Date.now() + llData.expires_in * 1000);

  return NextResponse.redirect(
    new URL(
      `/dashboard/instagram-connect?token=${llData.access_token}&expires=${llData.expires_in}&igUserId=${tokenData.user_id}`,
      req.url
    )
  );
}
