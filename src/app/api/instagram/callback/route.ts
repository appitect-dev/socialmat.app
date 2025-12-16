import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // short-lived token
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
  console.log("IG SHORT TOKEN:", tokenData);

  if (!tokenRes.ok || !tokenData.access_token) {
    return NextResponse.json(tokenData, { status: 500 });
  }

  // long-lived token
  const llRes = await fetch(
    "https://graph.instagram.com/access_token?" +
      new URLSearchParams({
        grant_type: "ig_exchange_token",
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        access_token: tokenData.access_token,
      })
  );

  const llData = await llRes.json();
  console.log("IG LONG TOKEN:", llData);

  if (!llRes.ok) {
    return NextResponse.json(llData, { status: 500 });
  }

  return NextResponse.json({
    short: tokenData,
    long: llData,
  });
}
