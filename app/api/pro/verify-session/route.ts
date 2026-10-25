import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, isProSubscription } from '@/lib/stripe-server';
import { newPayload, setProCookie } from '@/lib/pro-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST { sessionId } — verify a Stripe Checkout session server-side and, if it is a
 * completed subscription on an allowed Pro price, issue the signed httpOnly Pro cookie.
 * Re-verifying the same session later only works while the subscription is still active.
 */
export async function POST(request: NextRequest) {
  let sessionId: unknown;
  try {
    ({ sessionId } = await request.json());
  } catch {
    return NextResponse.json({ isPro: false, error: 'Invalid request' }, { status: 400 });
  }

  if (typeof sessionId !== 'string' || !/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ isPro: false, error: 'Invalid session' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    const sub = session.subscription as Stripe.Subscription | string | null;
    if (
      session.mode !== 'subscription' ||
      session.status !== 'complete' ||
      !sub ||
      typeof sub === 'string' ||
      !isProSubscription(sub)
    ) {
      return NextResponse.json({ isPro: false, error: 'Payment not verified' }, { status: 402 });
    }

    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    const res = NextResponse.json({ isPro: true });
    if (!setProCookie(res, newPayload(customerId, sub.id))) {
      return NextResponse.json({ isPro: false, error: 'Pro is temporarily unavailable' }, { status: 500 });
    }
    return res;
  } catch (err) {
    console.error('[verify-session] Stripe lookup failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ isPro: false, error: 'Could not verify payment' }, { status: 400 });
  }
}
