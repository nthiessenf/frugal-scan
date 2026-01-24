'use client';

import { Subscription } from '@/types';
import { RefreshCw, Music, Monitor, Dumbbell, Newspaper, Gamepad2, MoreHorizontal } from 'lucide-react';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  total: number;
}

export function SubscriptionsList({ subscriptions, total }: SubscriptionsListProps) {
  const getCategoryIcon = (category: Subscription['category']) => {
    switch (category) {
      case 'streaming':
        return Music;
      case 'software':
        return Monitor;
      case 'fitness':
        return Dumbbell;
      case 'news':
        return Newspaper;
      case 'gaming':
        return Gamepad2;
      default:
        return MoreHorizontal;
    }
  };

  const getCategoryColor = (category: Subscription['category']) => {
    switch (category) {
      case 'streaming':
        return 'bg-pink-50/80 text-pink-500/80';
      case 'software':
        return 'bg-violet-50/80 text-violet-500/80';
      case 'fitness':
        return 'bg-emerald-50/80 text-emerald-500/80';
      case 'news':
        return 'bg-amber-50/80 text-amber-500/80';
      case 'gaming':
        return 'bg-blue-50/80 text-[#93c5fd]';
      default:
        return 'bg-gray-50/80 text-gray-500/80';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#c4b5fd]" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Subscriptions</h3>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#93c5fd]/15 via-[#c4b5fd]/15 to-[#fbcfe8]/15">
          <span className="text-sm font-semibold text-[#6e6e73]">
            ${total.toFixed(2)}/mo
          </span>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-50/80 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#86868b]" />
          </div>
          <p className="text-sm text-[#6e6e73]">No recurring subscriptions detected</p>
          <p className="text-xs text-[#86868b] mt-1">We look for charges that repeat monthly or yearly</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub, index) => {
            const Icon = getCategoryIcon(sub.category);
            const colorClasses = getCategoryColor(sub.category);
            
            return (
              <div
                key={`${sub.name}-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-black/[0.04] transition-all duration-300 hover:bg-white/70"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1d1d1f]">{sub.name}</p>
                    <p className="text-xs text-[#86868b] capitalize">{sub.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1d1d1f]">
                    ${sub.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#86868b]">/{sub.frequency}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

