'use client';

import { useEffect, useState } from 'react';
import { getRemainingAnalyses } from '@/lib/usage-tracking';
import { isPro } from '@/lib/pro-status';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function UsageIndicator() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [pro, setPro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const proStatus = isPro();
    setPro(proStatus);
    setRemaining(getRemainingAnalyses(() => proStatus));
  }, []);

  if (!mounted || remaining === null) return null;

  // Pro users - show Pro badge
  if (pro || remaining === -1) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <Sparkles className="w-3 h-3 text-purple-500" />
        <span className="text-purple-600 font-medium">Pro</span>
        <span className="text-[#86868b]">·</span>
        <span className="text-[#86868b]">Unlimited analyses</span>
      </div>
    );
  }

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
        <Link 
          href="/pro" 
          onClick={(e) => e.stopPropagation()}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
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
      <Link 
        href="/pro" 
        onClick={(e) => e.stopPropagation()}
        className="text-purple-600 hover:text-purple-700 font-medium"
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
