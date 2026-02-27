// In-memory rate limiter — serverless-safe via globalThis.
// Les invocations chaudes réutilisent le store ; cold starts repartent de zéro (acceptable pour landing page).
// Pour production à grande échelle : @upstash/ratelimit + Redis.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

type RateLimitStore = Map<string, RateLimitEntry>;

declare global {
  // eslint-disable-next-line no-var
  var _rateLimitStore: RateLimitStore | undefined;
  // eslint-disable-next-line no-var
  var _rateLimitCleanup: ReturnType<typeof setInterval> | undefined;
}

const store: RateLimitStore =
  globalThis._rateLimitStore ?? new Map<string, RateLimitEntry>();
globalThis._rateLimitStore = store;

// Un seul cleanup interval par process (évite les duplicates en dev hot-reload)
if (!globalThis._rateLimitCleanup) {
  globalThis._rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt + 60 * 60 * 1000) store.delete(key);
    }
  }, 60 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 60 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs, limit };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, limit };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt, limit };
}

export function getClientIp(request: {
  headers: { get: (key: string) => string | null };
}): string {
  // x-real-ip est défini par Vercel avec le vrai IP client (non spoofable).
  // x-forwarded-for peut contenir des IPs forgées par le client au début de la chaîne ;
  // le vrai IP Vercel est toujours le dernier élément — on le prend en fallback.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    return parts[parts.length - 1].trim(); // dernier = vrai IP Vercel
  }

  return "unknown";
}
