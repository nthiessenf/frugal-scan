/**
 * Client-side view of Pro status.
 *
 * Pro is now verified on the server (signed httpOnly cookie set by /api/pro/verify-session,
 * see lib/pro-session.ts). The browser can't read or forge that cookie, so the client asks
 * /api/pro/status and caches the answer for UI purposes only. Server routes must use
 * getProFromRequest() for any real gating.
 */

const LEGACY_KEY = 'frugalscan_pro_status';

let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

/** Last known Pro status (false until refreshProStatus() has resolved). */
export function isPro(): boolean {
  return cached === true;
}

/** Ask the server for the current Pro status. */
export function refreshProStatus(force = false): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (!force && cached !== null) return Promise.resolve(cached);
  if (!force && inflight) return inflight;

  // Old builds stored a forgeable flag in localStorage; it's no longer trusted.
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }

  inflight = fetch('/api/pro/status', { credentials: 'same-origin', cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : { isPro: false }))
    .then((d: { isPro?: boolean }) => {
      cached = d.isPro === true;
      return cached;
    })
    .catch(() => {
      cached = false;
      return false;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Verify a Stripe Checkout session server-side; sets the Pro cookie on success. */
export async function verifyCheckoutSession(sessionId: string): Promise<{ isPro: boolean; error?: string }> {
  const r = await fetch('/api/pro/verify-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ sessionId }),
  });
  const d = (await r.json().catch(() => ({}))) as { isPro?: boolean; error?: string };
  cached = d.isPro === true;
  return { isPro: cached, error: d.error };
}
