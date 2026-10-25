import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { checkSubscription } from '@/lib/stripe-server';

/**
 * Server-verified Pro status, stateless (no database).
 *
 * Cookie `fs_pro` = base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, PRO_COOKIE_SECRET)).
 * Payload: { c: customerId, s: subscriptionId, exp: unix seconds, chk: unix seconds of last Stripe check }.
 * The cookie is httpOnly, so client JS can neither read nor forge it.
 * Every RECHECK_SECONDS the subscription is re-checked with Stripe, so cancellations
 * take effect within that window without needing a webhook-backed store.
 */
export const PRO_COOKIE = 'fs_pro';
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const RECHECK_SECONDS = 24 * 60 * 60; // re-verify with Stripe daily

export interface ProPayload {
  c: string;
  s: string;
  exp: number;
  chk: number;
}

function secret(): string | null {
  const s = process.env.PRO_COOKIE_SECRET;
  if (!s || s.length < 32) {
    console.error('[pro-session] PRO_COOKIE_SECRET missing or shorter than 32 chars; Pro disabled');
    return null;
  }
  return s;
}

const now = () => Math.floor(Date.now() / 1000);

function sign(data: string, key: string): string {
  return createHmac('sha256', key).update(data).digest('base64url');
}

export function encodeProCookie(payload: ProPayload): string | null {
  const key = secret();
  if (!key) return null;
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data, key)}`;
}

export function decodeProCookie(value: string | undefined): ProPayload | null {
  if (!value) return null;
  const key = secret();
  if (!key) return null;
  const [data, mac] = value.split('.');
  if (!data || !mac) return null;
  const expected = Buffer.from(sign(data, key));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const p = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as ProPayload;
    if (typeof p.c !== 'string' || typeof p.s !== 'string' || typeof p.exp !== 'number' || typeof p.chk !== 'number') return null;
    if (p.exp <= now()) return null;
    return p;
  } catch {
    return null;
  }
}

export function newPayload(customerId: string, subscriptionId: string): ProPayload {
  const t = now();
  return { c: customerId, s: subscriptionId, exp: t + MAX_AGE_SECONDS, chk: t };
}

export function setProCookie(res: NextResponse, payload: ProPayload): boolean {
  const value = encodeProCookie(payload);
  if (!value) return false;
  res.cookies.set(PRO_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(0, payload.exp - now()),
  });
  return true;
}

export function clearProCookie(res: NextResponse) {
  res.cookies.set(PRO_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export interface ProResult {
  isPro: boolean;
  payload: ProPayload | null;
  /** Set when the cookie was re-verified and should be re-issued (or cleared if isPro is false). */
  refreshed: boolean;
}

/**
 * Resolve Pro status for a request. Verifies the signature and expiry, and re-checks
 * the subscription with Stripe if the last check is older than RECHECK_SECONDS.
 * Use applyProResult() on the response to persist a refresh/clear.
 */
export async function getProFromRequest(req: NextRequest): Promise<ProResult> {
  const payload = decodeProCookie(req.cookies.get(PRO_COOKIE)?.value);
  if (!payload) return { isPro: false, payload: null, refreshed: !!req.cookies.get(PRO_COOKIE) };
  if (now() - payload.chk < RECHECK_SECONDS) return { isPro: true, payload, refreshed: false };

  const { ok } = await checkSubscription(payload.s);
  if (!ok) return { isPro: false, payload: null, refreshed: true };
  return { isPro: true, payload: { ...payload, chk: now() }, refreshed: true };
}

export function applyProResult(res: NextResponse, result: ProResult) {
  if (!result.refreshed) return;
  if (result.isPro && result.payload) setProCookie(res, result.payload);
  else clearProCookie(res);
}
