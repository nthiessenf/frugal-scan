'use client';

import { BarChart } from '@tremor/react';
import { TopMerchant } from '@/types';

interface MerchantChartProps {
  data: TopMerchant[];
}

export function MerchantChart({ data }: MerchantChartProps) {
  // Transform data for Tremor - take top 8
  const chartData = data.slice(0, 8).map(item => ({
    name: item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name,
    'Amount': item.amount,
    transactions: item.count,
  }));

  const valueFormatter = (value: number) => 
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)]">
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Top Merchants</h3>
      
      <BarChart
        data={chartData}
        index="name"
        categories={['Amount']}
        colors={['violet']}
        valueFormatter={valueFormatter}
        className="h-64"
        showAnimation={true}
        layout="vertical"
        yAxisWidth={100}
      />

      {/* Transaction counts */}
      <div className="mt-4 pt-4 border-t border-black/[0.05]">
        <div className="flex flex-wrap gap-3">
          {data.slice(0, 5).map(merchant => (
            <div key={merchant.name} className="text-xs text-[#86868b]">
              <span className="font-medium text-[#6e6e73]">{merchant.name.split(' ')[0]}</span>
              {' · '}{merchant.count} txn{merchant.count > 1 ? 's' : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

