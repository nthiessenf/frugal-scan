const PRO_STATUS_KEY = 'frugalscan_pro_status';

export interface ProStatus {
  isPro: boolean;
  activatedAt: string | null; // ISO date string
  expiresAt: string | null; // ISO date string (null = lifetime)
  source: 'manual' | 'stripe' | 'code'; // How they got Pro
}

/**
 * Get current Pro status from localStorage
 * Returns default (not Pro) if none exists or on SSR
 */
export function getProStatus(): ProStatus {
  if (typeof window === 'undefined') {
    return {
      isPro: false,
      activatedAt: null,
      expiresAt: null,
      source: 'manual',
    };
  }

  try {
    const stored = localStorage.getItem(PRO_STATUS_KEY);
    if (!stored) {
      return {
        isPro: false,
        activatedAt: null,
        expiresAt: null,
        source: 'manual',
      };
    }

    const data: ProStatus = JSON.parse(stored);
    
    // Check if Pro has expired (if expiresAt is set)
    if (data.isPro && data.expiresAt) {
      const now = new Date();
      const expires = new Date(data.expiresAt);
      if (now > expires) {
        // Pro expired - clear it
        clearProStatus();
        return {
          isPro: false,
          activatedAt: null,
          expiresAt: null,
          source: 'manual',
        };
      }
    }

    return data;
  } catch (error) {
    console.error('[pro-status] Error reading Pro status:', error);
    return {
      isPro: false,
      activatedAt: null,
      expiresAt: null,
      source: 'manual',
    };
  }
}

/**
 * Check if user currently has Pro status
 */
export function isPro(): boolean {
  return getProStatus().isPro;
}

/**
 * Activate Pro status (manual activation for early customers)
 * @param source How they got Pro ('manual', 'stripe', 'code')
 * @param expiresAt Optional expiration date (null = lifetime)
 */
export function setProStatus(
  source: 'manual' | 'stripe' | 'code' = 'manual',
  expiresAt: string | null = null
): ProStatus {
  if (typeof window === 'undefined') {
    return getProStatus();
  }

  const status: ProStatus = {
    isPro: true,
    activatedAt: new Date().toISOString(),
    expiresAt,
    source,
  };

  localStorage.setItem(PRO_STATUS_KEY, JSON.stringify(status));
  return status;
}

/**
 * Clear Pro status (e.g., on cancellation)
 */
export function clearProStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRO_STATUS_KEY);
}

/**
 * Activate Pro with a simple code (for manual activation)
 * In production, you'd email customers a unique code after payment
 */
export function activateProWithCode(code: string): boolean {
  // For now, accept a simple dev code
  // In Session 16, this will validate against Stripe webhooks
  const validCodes = [
    'PRO2025', // Simple dev code
    // Add more codes as needed for early customers
  ];

  if (validCodes.includes(code.toUpperCase())) {
    setProStatus('code');
    return true;
  }

  return false;
}
