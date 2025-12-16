import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!, // ⬅️ IG App ID
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!, // ⬅️ IG redirect
    response_type: "code",
    scope: "instagram_business_basic,instagram_business_manage_insights",
  });

  const url = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(url);
}
