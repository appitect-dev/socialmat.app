import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { cache: "no-store" as const };
const IG_BASE = "https://graph.instagram.com";

// „Všechno“, co se typicky dá na IG User vytáhnout.
// (shopping_product_tag_eligibility může vyžadovat extra nastavení/permissions)
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

// Fallback, kdyby část fieldů nebyla pro tvůj token / typ účtu / produkt podporovaná.
const FALLBACK_FIELDS = [
  "id",
  "username",
  "profile_picture_url",
  "followers_count",
  "follows_count",
  "media_count",
];

async function fetchMe(accessToken: string, fields: string[]) {
  const url =
    `${IG_BASE}/me?` +
    new URLSearchParams({
      fields: fields.join(","),
      access_token: accessToken,
    }).toString();

  const res = await fetch(url, NO_STORE);
  const data = await res.json().catch(() => null);

  return { res, data, url };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const accessToken = auth.slice("Bearer ".length).trim();

  // volitelně: /api/instagram/account?fields=id,username,...
  const { searchParams } = new URL(req.url);
  const fieldsParam = searchParams.get("fields");
  const requestedFields = fieldsParam
    ? fieldsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_FIELDS;

  // 1) zkus požadované (defaultně „všechno“)
  const first = await fetchMe(accessToken, requestedFields);

  if (first.res.ok && first.data?.id) {
    return NextResponse.json({
      account: first.data, // raw = „všechno co vrátilo API“
      normalized: {
        id: first.data.id,
        username: first.data.username,
        name: first.data.name ?? null,
        biography: first.data.biography ?? null,
        website: first.data.website ?? null,
        profilePictureUrl: first.data.profile_picture_url ?? null,
        followersCount: first.data.followers_count ?? null,
        followsCount: first.data.follows_count ?? null,
        mediaCount: first.data.media_count ?? null,
        igId: first.data.ig_id ?? null,
        shoppingProductTagEligibility:
          first.data.shopping_product_tag_eligibility ?? null,
      },
      meta: {
        fieldsUsed: requestedFields,
      },
    });
  }

  // 2) fallback, pokud default „všechno“ neprošlo
  // (když user zadal fieldsParam ručně, tak fallback nedělám — očekávám, že chceš vidět chybu)
  if (!fieldsParam) {
    const second = await fetchMe(accessToken, FALLBACK_FIELDS);

    if (second.res.ok && second.data?.id) {
      return NextResponse.json({
        account: second.data,
        normalized: {
          id: second.data.id,
          username: second.data.username,
          name: second.data.name ?? null,
          biography: second.data.biography ?? null,
          website: second.data.website ?? null,
          profilePictureUrl: second.data.profile_picture_url ?? null,
          followersCount: second.data.followers_count ?? null,
          followsCount: second.data.follows_count ?? null,
          mediaCount: second.data.media_count ?? null,
          igId: second.data.ig_id ?? null,
          shoppingProductTagEligibility:
            second.data.shopping_product_tag_eligibility ?? null,
        },
        meta: {
          fieldsUsed: FALLBACK_FIELDS,
          note: "Default fields were not fully supported; used fallback fields.",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to load account summary", details: second.data },
      { status: second.res.status || 500 }
    );
  }

  // 3) když user explicitně poslal ?fields=..., vrať chybu natvrdo
  return NextResponse.json(
    { error: "Failed to load account summary", details: first.data },
    { status: first.res.status || 500 }
  );
}
