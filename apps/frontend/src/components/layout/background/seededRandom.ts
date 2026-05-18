/**
 * djb2 hash — turns any string into a uint32
 */
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep uint32
  }
  return hash;
}

/**
 * mulberry32 — fast, high-quality 32-bit seeded PRNG.
 * Returns a function that yields floats in [0, 1).
 */
export function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * Derive a seed from a cookie value, or fall back to a stable default.
 * Pass your auth cookie name (e.g. "session_id") and it will be used if present.
 */
export function getSeedFromCookie(cookieName: string, fallback = "hexbg-default"): number {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(cookieName + "="));

  const value = match ? match.split("=")[1] : fallback;
  return hashString(value);
}
