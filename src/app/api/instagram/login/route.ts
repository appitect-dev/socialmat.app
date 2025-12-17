import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    response_type: "code",
    scope: [
      "instagram_business_basic",
      "instagram_business_manage_insights",
    ].join(","),
    state: crypto.randomUUID(),
  });

  const url = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(url);
}
