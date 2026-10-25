import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting for Claude-calling routes.
 *
 * Storage: Upstash Redis (Vercel Marketplace) when its REST env vars are present
 * (UPSTASH_REDIS_REST_URL/TOKEN, or KV_REST_API_URL/TOKEN as injected by the Vercel integration).
 * Otherwise an in-memory fallback is used so local dev, builds and previews keep working.
 * In-memory limits are per serverless instance only, so production should have Redis configured.
 */

type Window = { limit: number; window: Duration; windowMs: number };
type RouteLimits = { free: Window[]; pro: Window[] };

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const LIMITS: Record<'parse' | 'analyze', RouteLimits> = {
  // PDF parsing is the expensive call (several Claude requests per statement).
  parse: {
    free: [
      { limit: 5, window: '1 h', windowMs: HOUR },
      { limit: 15, window: '1 d', windowMs: DAY },
    ],
    pro: [
      { limit: 20, window: '1 h', windowMs: HOUR },
      { limit: 100, window: '1 d', windowMs: DAY },
    ],
  },
  analyze: {
    free: [
      { limit: 10, window: '1 h', windowMs: HOUR },
      { limit: 30, window: '1 d', windowMs: DAY },
    ],
    pro: [
      { limit: 40, window: '1 h', windowMs: HOUR },
      { limit: 200, window: '1 d', windowMs: DAY },
    ],
  },
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

let warned = false;
const limiterCache = new Map<string, Ratelimit>();

function upstashLimiter(name: string, w: Window): Ratelimit {
  const key = `${name}:${w.limit}:${w.window}`;
  let l = limiterCache.get(key);
  if (!l) {
    l = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(w.limit, w.window),
      prefix: `fs:rl:${name}`,
      analytics: false,
    });
    limiterCache.set(key, l);
  }
  return l;
}

// In-memory fallback: sliding log per key.
const memory = new Map<string, number[]>();
function memoryLimit(key: string, w: Window): { success: boolean; reset: number } {
  const now = Date.now();
  const hits = (memory.get(key) || []).filter((t) => t > now - w.windowMs);
  if (hits.length >= w.limit) {
    memory.set(key, hits);
    return { success: false, reset: hits[0] + w.windowMs };
  }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 10_000) memory.clear(); // bound memory on long-lived instances
  return { success: true, reset: now + w.windowMs };
}

/** Client IP as seen by Vercel's edge (first x-forwarded-for hop). */
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Enforce limits for a route. `identity` is the verified Pro subscription id when present
 * (higher limits, keyed per user); otherwise limits are keyed per IP.
 * Returns a 429 response to send, or null if the request may proceed.
 */
export async function enforceRateLimit(
  req: NextRequest,
  route: keyof typeof LIMITS,
  identity?: { proSubscriptionId?: string | null }
): Promise<NextResponse | null> {
  const isPro = !!identity?.proSubscriptionId;
  const windows = isPro ? LIMITS[route].pro : LIMITS[route].free;
  const subject = isPro ? `sub:${identity!.proSubscriptionId}` : `ip:${getClientIp(req)}`;

  if (!redis && !warned && process.env.VERCEL_ENV === 'production') {
    warned = true;
    console.warn('[rate-limit] No Upstash Redis configured; using per-instance in-memory limits');
  }

  for (const w of windows) {
    const name = `${route}:${isPro ? 'pro' : 'free'}`;
    let result: { success: boolean; reset: number };
    try {
      result = redis
        ? await upstashLimiter(name, w).limit(subject)
        : memoryLimit(`${name}:${w.window}:${subject}`, w);
    } catch (err) {
      // Fail open on limiter outages so a Redis blip doesn't take the product down,
      // but fall back to the in-memory limiter so there is still some protection.
      console.error('[rate-limit] limiter error, using in-memory fallback:', err instanceof Error ? err.message : err);
      result = memoryLimit(`${name}:${w.window}:${subject}`, w);
    }

    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: isPro
            ? 'You are going a bit fast. Please try again shortly.'
            : 'Too many analyses from this network. Please try again later.',
        },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }
  }
  return null;
}
