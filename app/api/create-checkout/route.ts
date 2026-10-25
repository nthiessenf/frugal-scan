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

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    // Only allow our own configured prices; never trust a client-supplied price/mode.
    const allowedPrices = [
      process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    ].filter(Boolean);

    if (typeof priceId !== 'string' || !allowedPrices.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    const client = getStripeClient();

    // Create Checkout Session
    const session = await client.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pro?canceled=true`,
      metadata: {
        // Store any custom data you need
        source: 'checkout',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('[create-checkout] Error:', error);
    // Don't leak Stripe/internal error details to the client.
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
