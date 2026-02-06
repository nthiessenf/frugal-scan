'use client';

import { useEffect, useState } from 'react';
import { getRemainingAnalyses } from '@/lib/usage-tracking';
import Link from 'next/link';

export function UsageIndicator() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(getRemainingAnalyses());
  }, []);

  if (!mounted || remaining === null) return null;

  const total = 3;
  const used = total - remaining;

  // Full quota - barely visible, just small text
  if (remaining === 3) {
    return (
      <p className="text-xs text-[#86868b]">
        3 free analyses available
      </p>
    );
  }

  // Some used but not urgent - subtle indicator
  if (remaining >= 2) {
    return (
      <p className="text-xs text-[#86868b]">
        {remaining} of {total} free analyses remaining
      </p>
    );
  }

  // Last one - gentle warning
  if (remaining === 1) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-amber-600 font-medium">Last free analysis</span>
        <span className="text-[#86868b]">·</span>
        <Link href="/pro" className="text-purple-600 hover:text-purple-700 font-medium">
          Upgrade for unlimited
        </Link>
      </div>
    );
  }

  // Limit reached - clear but not aggressive
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#1d1d1f] font-medium">Monthly limit reached</span>
      <span className="text-[#86868b]">·</span>
      <Link href="/pro" className="text-purple-600 hover:text-purple-700 font-medium">
        Upgrade to Pro →
      </Link>
    </div>
  );
}
