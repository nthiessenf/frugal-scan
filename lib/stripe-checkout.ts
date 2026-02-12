/**
 * Create a Stripe Checkout session
 * @param priceId Stripe Price ID (from your Stripe Dashboard)
 * @param mode 'subscription' for recurring payments
 */
export async function createCheckoutSession(priceId: string, mode: 'subscription' = 'subscription') {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, mode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data;
  } catch (error) {
    console.error('[stripe-checkout] Error:', error);
    throw error;
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(priceId: string) {
  const { url } = await createCheckoutSession(priceId);
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL returned');
  }
}
