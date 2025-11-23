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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const res = await fetch(finalUrl, {
    ...init,
    method,
    signal,
    headers,
    body,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const parsedBody =
    [204, 205, 304].includes(res.status) ? null : isJson ? await res.json() : await res.text();

  return {
    data: parsedBody ?? {},
    status: res.status,
    headers: res.headers,
  } as T;
}
