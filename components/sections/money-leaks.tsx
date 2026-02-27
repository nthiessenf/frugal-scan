'use client';

import { MoneyLeak } from '@/types';
import { AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';

interface MoneyLeaksProps {
  leaks: MoneyLeak[];
  projectedAnnual: number;
}

function getTypeDotColor(type: string): string {
  switch (type) {
    case 'bank_fee':
      return 'bg-rose-500';
    case 'atm_fee':
      return 'bg-amber-500';
    case 'late_fee':
    case 'interest':
      return 'bg-orange-500';
    case 'convenience_fee':
    case 'foreign_fee':
    default:
      return 'bg-gray-400';
  }
}

export function MoneyLeaksSection({ leaks, projectedAnnual }: MoneyLeaksProps) {
  if (!leaks || leaks.length === 0) return null;

  const totalAnnualSavings = leaks.reduce((sum, l) => sum + l.annualProjection, 0);
  const displayProjected = projectedAnnual > 0 ? projectedAnnual : totalAnnualSavings;

  return (
    <GlassCard className="p-6 border-l-[3px] border-l-rose-400/70" hover={false}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Money Leaks</h3>
        </div>
        <span className="text-sm font-semibold text-rose-600">
          ${leaks.reduce((s, l) => s + l.amount, 0).toFixed(2)} this period
        </span>
      </div>
      <p className="text-xs text-[#86868b] mb-4">
        Avoidable fees detected — projected ${displayProjected.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year if unchanged
      </p>

      <div className="space-y-3">
        {leaks.map((leak) => (
          <div
            key={leak.id}
            className="flex items-start justify-between py-2 border-b border-black/5 last:border-0"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${getTypeDotColor(leak.type)}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1d1d1f]">{leak.label}</p>
                <p className="text-xs text-[#86868b]">
                  {leak.merchant} · {new Date(leak.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#1d1d1f] flex-shrink-0 ml-2">
              ${leak.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#6e6e73] mt-4 pt-4 border-t border-black/5">
        Eliminating these fees could save you ${displayProjected.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year — most can be avoided with simple changes.
      </p>
    </GlassCard>
  );
}
