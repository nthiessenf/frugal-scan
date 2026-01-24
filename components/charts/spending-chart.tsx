'use client';

import { DonutChart } from '@tremor/react';
import { CategoryBreakdown } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface SpendingChartProps {
  data: CategoryBreakdown[];
  totalSpent: number;
}

export function SpendingChart({ data, totalSpent }: SpendingChartProps) {
  // Transform data for Tremor
  const chartData = data
    .filter(item => item.amount > 0)
    .map(item => {
      const categoryInfo = CATEGORIES.find(c => c.id === item.category);
      return {
        name: categoryInfo?.label || item.category,
        value: item.amount,
        percentage: item.percentage,
      };
    });

  // Custom colors matching our design system
  const colors = data
    .filter(item => item.amount > 0)
    .map(item => {
      const categoryInfo = CATEGORIES.find(c => c.id === item.category);
      // Map hex colors to Tremor color names (approximate matches)
      const colorMap: Record<string, string> = {
        '#f97316': 'orange',
        '#84cc16': 'lime',
        '#8b5cf6': 'violet',
        '#3b82f6': 'blue',
        '#ec4899': 'pink',
        '#6366f1': 'indigo',
        '#f43f5e': 'rose',
        '#10b981': 'emerald',
        '#0ea5e9': 'cyan',
        '#22c55e': 'green',
        '#94a3b8': 'slate',
        '#64748b': 'gray',
      };
      return colorMap[categoryInfo?.color || '#64748b'] || 'gray';
    });

  const valueFormatter = (value: number) => 
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)]">
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Spending by Category</h3>
      
      <div className="flex flex-col items-center">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          valueFormatter={valueFormatter}
          colors={colors}
          className="h-52"
          showAnimation={true}
        />
        
        <div className="text-center mt-2">
          <p className="text-2xl font-bold text-[#1d1d1f]">
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-[#86868b]">Total Spent</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: CATEGORIES.find(c => c.label === item.name)?.color || '#64748b' }}
            />
            <span className="text-xs text-[#6e6e73] truncate">{item.name}</span>
            <span className="text-xs font-medium text-[#1d1d1f] ml-auto">{item.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

