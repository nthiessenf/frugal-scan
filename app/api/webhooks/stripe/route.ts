import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazily initialize Stripe so build doesn't fail if env vars are missing
let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripe = new Stripe(apiKey);
  }
  return stripe;
}

// Disable body parsing, we need the raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const client = getStripeClient();

    event = client.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Only process if it's a subscription
      if (session.mode === 'subscription') {
        const customerEmail = session.customer_details?.email;
        const subscriptionId = session.subscription as string;

        // Avoid logging customer PII (email) to Vercel logs.
        console.log('[webhook] Subscription activated:', {
          hasEmail: !!customerEmail,
          subscriptionId,
          sessionId: session.id,
        });

        // TODO: In Session 23 (Supabase), store this in database
        // For now, we'll use a simple approach: email the user a Pro code
        // Or you can manually activate via Stripe Dashboard

        // You could also call an API to send them a Pro activation code via email
        // For now, we'll just log it - you can manually activate or send codes
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      if (event.type === 'customer.subscription.deleted') {
        console.log('[webhook] Subscription canceled:', subscription.id);
        // TODO: In Session 23, revoke Pro access in database
      } else {
        console.log('[webhook] Subscription updated:', subscription.id);
        // Handle subscription changes (e.g., plan upgrade/downgrade)
      }
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
