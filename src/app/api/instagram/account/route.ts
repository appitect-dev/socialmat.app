import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

// Kandidáti = “všechno”, co se typicky uvádí pro IG User.
// shopping_product_tag_eligibility může být často problémový (shop/eligibility), proto je v seznamu,
// ale kód ho umí sám vyhodit, pokud to token/účet nepodporuje.
const DEFAULT_FIELDS = [
  "id",
  "username",
  "name",
  "biography",
  "website",
  "profile_picture_url",
  "followers_count",
  "follows_count",
  "media_count",
  "ig_id",
  "shopping_product_tag_eligibility",
];

async function fetchJson(url: string) {
  const res = await fetch(url, NO_STORE);
  const data = await res.json().catch(() => null);
  return { res, data };
}

// Pokusí se z error message vytáhnout “nonexisting field (X)” / podobné varianty
function extractBadField(message: string | undefined): string | null {
  if (!message) return null;

  // nejčastější: "Tried accessing nonexisting field (name) on node type ..."
  const m1 = message.match(/nonexisting field\s*\(([^)]+)\)/i);
  if (m1?.[1]) return m1[1].trim();

  // občas: "Unsupported field: profile_picture_url"
  const m2 = message.match(/Unsupported field:\s*([a-z0-9_]+)/i);
  if (m2?.[1]) return m2[1].trim();

  return null;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const accessToken = auth.slice("Bearer ".length).trim();

  const { searchParams } = new URL(req.url);
  const fieldsParam = searchParams.get("fields");
  const requestedFields = fieldsParam
    ? fieldsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_FIELDS;

  // 1) /me jen pro id+username (stabilní)
  const meUrl =
    `${IG_BASE}/me?` +
    new URLSearchParams({
      fields: "id,username",
      access_token: accessToken,
    }).toString();

  const me = await fetchJson(meUrl);
  if (!me.res.ok || !me.data?.id) {
    return NextResponse.json(
      { error: "Invalid token", details: me.data },
      { status: 401 }
    );
  }

  const igUserId: string = me.data.id;

  // 2) /{id}?fields=... – tady se snažíme získat “maximum”
  let fields = [...requestedFields];
  const droppedFields: string[] = [];
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    const url =
      `${IG_BASE}/${encodeURIComponent(igUserId)}?` +
      new URLSearchParams({
        fields: fields.join(","),
        access_token: accessToken,
      }).toString();

    const out = await fetchJson(url);

    if (out.res.ok && out.data?.id) {
      const a = out.data;
      return NextResponse.json({
        account: a,
        normalized: {
          id: a.id ?? null,
          username: a.username ?? null,
          name: a.name ?? null,
          biography: a.biography ?? null,
          website: a.website ?? null,
          profilePictureUrl: a.profile_picture_url ?? null,
          followersCount: a.followers_count ?? null,
          followsCount: a.follows_count ?? null,
          mediaCount: a.media_count ?? null,
          igId: a.ig_id ?? null,
          shoppingProductTagEligibility:
            a.shopping_product_tag_eligibility ?? null,
        },
        meta: {
          igUserId,
          fieldsUsed: fields,
          droppedFields,
        },
      });
    }

    // pokud user poslal explicitně ?fields=..., nechceme mu to “tichým” dropováním měnit
    if (fieldsParam) {
      return NextResponse.json(
        { error: "Failed to load account", details: out.data },
        { status: out.res.status || 500 }
      );
    }

    const msg: string | undefined = out.data?.error?.message;
    const bad = extractBadField(msg);

    lastError = out.data;

    // když neumíme identifikovat problem field, nemá smysl retry
    if (!bad) break;

    // vyhoď problem field a zkus znovu
    const next = fields.filter((f) => f !== bad);
    if (next.length === fields.length) break;

    droppedFields.push(bad);
    fields = next;
  }

  return NextResponse.json(
    { error: "Failed to load account", details: lastError },
    { status: 500 }
  );
}
