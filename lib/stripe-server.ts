import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error('STRIPE_SECRET_KEY is not set');
    stripe = new Stripe(apiKey);
  }
  return stripe;
}

export function allowedPriceIds(): string[] {
  return [
    process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
  ].filter((p): p is string => typeof p === 'string' && p.length > 0);
}

const ACTIVE_STATUSES: Stripe.Subscription.Status[] = ['active', 'trialing'];

/** True when the subscription is active/trialing and on one of our Pro prices. */
export function isProSubscription(sub: Stripe.Subscription): boolean {
  if (!ACTIVE_STATUSES.includes(sub.status)) return false;
  const allowed = allowedPriceIds();
  return sub.items.data.some((item) => allowed.includes(item.price.id));
}

/** Fetch the subscription from Stripe and check it is still a valid Pro subscription. */
export async function checkSubscription(subscriptionId: string): Promise<{ ok: boolean }> {
  try {
    const sub = await getStripe().subscriptions.retrieve(subscriptionId);
    return { ok: isProSubscription(sub) };
  } catch (err) {
    console.error('[stripe-server] subscription lookup failed:', err instanceof Error ? err.message : err);
    return { ok: false };
  }
}
