/**
 * In-memory sliding-window rate limiter.
 *
 * Tracks request timestamps per key (usually IP).
 * Rejects requests that exceed `maxRequests` within `windowMs`.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60_000);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Check if a request from the given key is allowed.
 *
 * @param key       - Usually the client IP address
 * @param maxReqs   - Maximum requests allowed in the window (default: 10)
 * @param windowMs  - Window size in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxReqs = 10,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxReqs) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = windowMs - (now - oldest);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: maxReqs - entry.timestamps.length };
}
