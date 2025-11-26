type ApiFetchConfig = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  data?: unknown;
  signal?: AbortSignal;
};

type ApiFetchArgs = ApiFetchConfig | string;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "https://api.socialmat.cz";

const mergeHeaders = (target: Headers, source?: HeadersInit): Headers => {
  if (!source) return target;
  new Headers(source).forEach((value, key) => target.set(key, value));
  return target;
};

type SessionPayload = {
  token?: string;
  refreshToken?: string;
};

const getClientSession = (): SessionPayload | null => {
  if (typeof window === "undefined") return null;
  const raw = document.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.split("=")[1] ?? "")) as SessionPayload;
  } catch {
    return null;
  }
};

const persistClientSession = (payload: SessionPayload) => {
  if (typeof window === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(payload));
  document.cookie = `session=${value}; path=/; max-age=604800; samesite=lax; secure`;
  if (payload.token) {
    localStorage.setItem("token", payload.token);
  }
  if (payload.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }
};

const clearSessionAndRedirect = () => {
  if (typeof window === "undefined") return;
  document.cookie = "session=; path=/; max-age=0; samesite=lax; secure";
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export async function apiFetch<T>(
  input: ApiFetchArgs,
  init: RequestInit = {}
): Promise<T> {
  const isStringInput = typeof input === "string";
  const url = isStringInput ? input : input.url;

  const method =
    (isStringInput ? init.method : input.method ?? init.method) ?? "GET";
  const signal = isStringInput ? init.signal : input.signal ?? init.signal;

  const headers = mergeHeaders(
    mergeHeaders(new Headers(), isStringInput ? undefined : input.headers),
    init.headers
  );

  const session = getClientSession();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || session?.token || null
      : null;

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const hasJsonPayload =
    !isStringInput && input.data !== undefined && method !== "GET";

  if (hasJsonPayload && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const body =
    !isStringInput && input.data !== undefined && method !== "GET"
      ? JSON.stringify(input.data)
      : init.body;

  const finalUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const doFetch = async () =>
    fetch(finalUrl, {
      ...init,
      method,
      signal,
      headers,
      body,
    });

  let res = await doFetch();

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  // If unauthorized/forbidden on client, try refresh once
  if (typeof window !== "undefined" && (res.status === 401 || res.status === 403)) {
    const refreshToken =
      localStorage.getItem("refreshToken") || session?.refreshToken;
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshed = await refreshRes.json();
          persistClientSession({
            token: refreshed?.token,
            refreshToken: refreshed?.refreshToken ?? refreshToken,
          });
          headers.set("Authorization", `Bearer ${refreshed?.token ?? ""}`);
          res = await doFetch();
        } else {
          clearSessionAndRedirect();
        }
      } catch {
        // ignore and fall through with original 401
        clearSessionAndRedirect();
      }
    } else {
      clearSessionAndRedirect();
    }
  }

  const parsedBody =
    [204, 205, 304].includes(res.status) ? null : isJson ? await res.json() : await res.text();

  return {
    data: parsedBody ?? {},
    status: res.status,
    headers: res.headers,
  } as T;
}
