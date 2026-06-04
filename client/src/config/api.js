// Production fallback — Vercel preview builds often miss REACT_APP_API_URL at build time
const PRODUCTION_API = 'https://shopease-api.onrender.com';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API : 'http://localhost:9999');

export default API_BASE;

/** Fetch with timeout so slow/dead APIs never block the UI for minutes */
export async function apiFetch(path, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function apiJson(path, options = {}, timeoutMs = 8000) {
  const res = await apiFetch(path, options, timeoutMs);
  if (!res.ok) throw new Error(`API ${path} failed (${res.status})`);
  return res.json();
}
