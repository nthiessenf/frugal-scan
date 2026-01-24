'use client';

import { SpendingSummary } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

interface SummaryHeaderProps {
  summary: SpendingSummary;
}

export function SummaryHeader({ summary }: SummaryHeaderProps) {
  const isPositiveCashFlow = summary.netCashFlow >= 0;
  
  const stats = [
    {
      label: 'Total Spent',
      value: summary.totalSpent,
      icon: CreditCard,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Total Income',
      value: summary.totalIncome,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Net Cash Flow',
      value: summary.netCashFlow,
      icon: isPositiveCashFlow ? TrendingUp : TrendingDown,
      color: isPositiveCashFlow ? 'text-green-500' : 'text-red-500',
      bgColor: isPositiveCashFlow ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Subscriptions',
      value: summary.subscriptionTotal,
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      suffix: '/mo',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#86868b]">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.label === 'Net Cash Flow' ? stat.color : 'text-[#1d1d1f]'}`}>
                {stat.value < 0 ? '-' : ''}${Math.abs(stat.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {stat.suffix && <span className="text-sm font-medium text-[#86868b]">{stat.suffix}</span>}
              </p>
            </div>
            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

