'use client';

import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { Subscription, SubscriptionAudit } from '@/types';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  total: number;
  subscriptionAudit?: SubscriptionAudit[];
}

const categoryColors: Record<string, string> = {
  streaming: '#8b5cf6',
  software: '#3b82f6',
  fitness: '#10b981',
  news: '#f97316',
  gaming: '#ec4899',
  other: '#64748b',
};

function getAnnualCost(sub: Subscription, audit?: SubscriptionAudit[]): number {
  if (audit?.length) {
    const match = audit.find(
      (a) => a.name.toLowerCase().trim() === sub.name.toLowerCase().trim()
    );
    if (match) return match.annualCost;
  }
  if (sub.frequency === 'yearly') return sub.amount;
  if (sub.frequency === 'weekly') return sub.amount * 52;
  return sub.amount * 12;
}

export function SubscriptionsList({ subscriptions, total, subscriptionAudit }: SubscriptionsListProps) {
  const [expanded, setExpanded] = useState(false);

  const annualTotal =
    subscriptionAudit?.reduce((sum, a) => sum + a.annualCost, 0) ??
    total * 12;

  const INITIAL_SHOW = 5;
  const hasMore = subscriptions.length > INITIAL_SHOW;
  const displayedSubscriptions = expanded ? subscriptions : subscriptions.slice(0, INITIAL_SHOW);

  const allAnnualCosts = subscriptions.map((sub) =>
    getAnnualCost(sub, subscriptionAudit)
  );
  const minAnnual = allAnnualCosts.length > 0 ? Math.min(...allAnnualCosts) : 0;
  const maxAnnual = allAnnualCosts.length > 0 ? Math.max(...allAnnualCosts) : 0;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Subscriptions</h3>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-[#8b5cf6]">
            ${total.toFixed(2)}/mo
          </span>
          <p className="text-xs font-medium text-amber-600">
            ${annualTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
          </p>
        </div>
      </div>
      <p className="text-xs text-[#86868b] mb-4">
        {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''} detected
      </p>

      <div className="space-y-3">
        {displayedSubscriptions.map((sub, index) => {
          const annualCost = getAnnualCost(sub, subscriptionAudit);
          const monthlyDisplay =
            sub.frequency === 'yearly'
              ? sub.amount / 12
              : sub.frequency === 'weekly'
              ? sub.amount * 4
              : sub.amount;
          return (
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
              <div className="text-right">
                <p className="text-sm font-semibold text-[#1d1d1f]">
                  ${monthlyDisplay.toFixed(2)}
                  <span className="text-xs font-normal text-[#86868b]">/mo</span>
                </p>
                <p className="text-xs text-[#86868b]">
                  (${annualCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr)
                </p>
              </div>
            </div>
          );
        })}
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

      <div className="mt-4 rounded-xl bg-purple-50/50 px-4 py-3">
        <p className="text-sm font-medium text-[#1d1d1f]">
          Are you actively using all {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}?
        </p>
        <p className="text-xs text-[#6e6e73] mt-0.5">
          {minAnnual === maxAnnual
            ? `Canceling just one unused service could save $${minAnnual.toFixed(0)} per year`
            : `Canceling just one unused service could save $${minAnnual.toFixed(0)}–$${maxAnnual.toFixed(0)} per year`}
        </p>
      </div>
    </GlassCard>
  );
}
