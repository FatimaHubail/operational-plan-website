const API_BASE = "http://127.0.0.1:5050"

type ApiError = { message: string; code?: string }
export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options, // method/body/headers
    credentials: "include", // send/receive cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiError
    throw new Error(err.message || res.statusText) 
  }

  if (res.status === 204) return undefined as T // logout
  return res.json() as Promise<T> // login/success
}