export async function apiFetch(url: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const baseUrl = "https://api.socialmat.cz";

  const res = await fetch(baseUrl + url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res;
}
