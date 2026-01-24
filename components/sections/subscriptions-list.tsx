'use client';

import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { Subscription } from '@/types';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  total: number;
}

const categoryColors: Record<string, string> = {
  streaming: '#8b5cf6',
  software: '#3b82f6',
  fitness: '#10b981',
  news: '#f97316',
  gaming: '#ec4899',
  other: '#64748b',
};

export function SubscriptionsList({ subscriptions, total }: SubscriptionsListProps) {
  const [expanded, setExpanded] = useState(false);
  
  const INITIAL_SHOW = 5;
  const hasMore = subscriptions.length > INITIAL_SHOW;
  const displayedSubscriptions = expanded ? subscriptions : subscriptions.slice(0, INITIAL_SHOW);

  if (subscriptions.length === 0) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Subscriptions</h3>
        </div>
        <p className="text-[#6e6e73] text-sm">No recurring subscriptions detected.</p>
        <p className="text-[#86868b] text-xs mt-2">
          We look for streaming, software, and other discretionary recurring charges.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Subscriptions</h3>
        </div>
        <span className="text-sm font-medium text-[#8b5cf6]">
          ${total.toFixed(2)}/mo
        </span>
      </div>
      <p className="text-xs text-[#86868b] mb-4">
        {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''} detected
      </p>

      <div className="space-y-3">
        {displayedSubscriptions.map((sub, index) => (
          <div
            key={`${sub.name}-${index}`}
            className="flex items-center justify-between py-2 border-b border-black/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColors[sub.category] || '#64748b' }}
              />
              <div>
                <p className="text-sm font-medium text-[#1d1d1f]">{sub.name}</p>
                <p className="text-xs text-[#86868b] capitalize">{sub.category}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#1d1d1f]">
              ${sub.amount.toFixed(2)}
              <span className="text-xs font-normal text-[#86868b]">/mo</span>
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show all {subscriptions.length} subscriptions <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </GlassCard>
  );
}
