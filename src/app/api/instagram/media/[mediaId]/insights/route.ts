import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

const DEFAULT_METRICS = ["views", "reach", "saved", "shares"];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length);

  const { mediaId } = await params;

  if (!mediaId) {
    return NextResponse.json({ error: "Missing mediaId" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const metricParam = searchParams.get("metric");

  const metrics =
    metricParam
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? DEFAULT_METRICS;

  const url =
    `${IG_BASE}/${encodeURIComponent(mediaId)}/insights?` +
    new URLSearchParams({
      metric: metrics.join(","),
      access_token: accessToken,
    }).toString();

  const res = await fetch(url, NO_STORE);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to load media insights", details: data },
      { status: res.status }
    );
  }

  return NextResponse.json({
    mediaId,
    insights: data?.data ?? [],
  });
}
