// Local dev: always use localhost when opened in browser on this machine
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const PRODUCTION_API = 'https://shopease-api.onrender.com';

const API_BASE = isLocalhost
  ? 'http://localhost:9999'
  : process.env.REACT_APP_API_URL || PRODUCTION_API;

export default API_BASE;

export async function apiFetch(path, options = {}, timeoutMs = 15000) {
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

export async function apiJson(path, options = {}, timeoutMs = 15000) {
  const res = await apiFetch(path, options, timeoutMs);
  if (!res.ok) throw new Error(`API ${path} failed (${res.status})`);
  return res.json();
}
