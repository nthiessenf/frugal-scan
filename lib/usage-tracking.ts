const FREE_TIER_LIMIT = 3;
const STORAGE_KEY = 'frugalscan_usage';

export interface UsageData {
  analysisCount: number;
  monthYear: string; // "2025-02" format - resets each month
  lastAnalysisDate: string | null;
}

/**
 * Get current month as "YYYY-MM" format
 */
function getCurrentMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get current usage data from localStorage
 * Resets count if it's a new month
 * Returns fresh data if none exists
 */
export function getUsageData(): UsageData {
  // Handle SSR - return default if window is undefined
  if (typeof window === 'undefined') {
    return {
      analysisCount: 0,
      monthYear: getCurrentMonthYear(),
      lastAnalysisDate: null,
    };
  }

  const currentMonthYear = getCurrentMonthYear();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // No data exists - return fresh object
      return {
        analysisCount: 0,
        monthYear: currentMonthYear,
        lastAnalysisDate: null,
      };
    }

    const data: UsageData = JSON.parse(stored);
    
    // If it's a new month, reset the count
    if (data.monthYear !== currentMonthYear) {
      const resetData: UsageData = {
        analysisCount: 0,
        monthYear: currentMonthYear,
        lastAnalysisDate: null,
      };
      // Save the reset data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
      return resetData;
    }

    return data;
  } catch (error) {
    console.error('[usage-tracking] Error reading usage data:', error);
    // Return fresh data on error
    return {
      analysisCount: 0,
      monthYear: currentMonthYear,
      lastAnalysisDate: null,
    };
  }
}

/**
 * Increment analysis count and save to localStorage
 */
export function incrementUsage(): UsageData {
  if (typeof window === 'undefined') {
    return getUsageData();
  }

  const current = getUsageData();
  const currentMonthYear = getCurrentMonthYear();
  
  // If month changed since last check, reset
  if (current.monthYear !== currentMonthYear) {
    const resetData: UsageData = {
      analysisCount: 1,
      monthYear: currentMonthYear,
      lastAnalysisDate: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    return resetData;
  }

  const updated: UsageData = {
    analysisCount: current.analysisCount + 1,
    monthYear: current.monthYear,
    lastAnalysisDate: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Check if user can perform another analysis
 * Pro users have unlimited analyses
 * Note: Import isPro from pro-status.ts in calling code to avoid circular deps
 */
export function canAnalyze(checkPro?: () => boolean): boolean {
  // Check Pro status if provided
  if (checkPro && checkPro()) {
    return true; // Pro users have unlimited
  }
  
  const usage = getUsageData();
  return usage.analysisCount < FREE_TIER_LIMIT;
}

/**
 * Get number of remaining free analyses
 * Returns -1 for Pro users (unlimited)
 * Note: Import isPro from pro-status.ts in calling code to avoid circular deps
 */
export function getRemainingAnalyses(checkPro?: () => boolean): number {
  // Check Pro status if provided
  if (checkPro && checkPro()) {
    return -1; // -1 means unlimited (Pro)
  }
  
  const usage = getUsageData();
  return Math.max(0, FREE_TIER_LIMIT - usage.analysisCount);
}

/**
 * Get usage percentage (0-100)
 */
export function getUsagePercentage(): number {
  const usage = getUsageData();
  return Math.min(100, (usage.analysisCount / FREE_TIER_LIMIT) * 100);
}

/**
 * Get the free tier limit (for display purposes)
 */
export function getFreeTierLimit(): number {
  return FREE_TIER_LIMIT;
}
