'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard } from '@/components/ui/card';
import { Category } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface SpendingChartProps {
  data: Array<{
    category: Category;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  totalSpent: number;
}

// Direct color mapping
const COLORS: Record<string, string> = {
  food_dining: '#f97316',
  groceries: '#84cc16',
  shopping: '#8b5cf6',
  transportation: '#3b82f6',
  subscriptions: '#ec4899',
  bills_utilities: '#6366f1',
  entertainment: '#f43f5e',
  health_fitness: '#10b981',
  travel: '#0ea5e9',
  income: '#22c55e',
  transfer: '#94a3b8',
  other: '#64748b',
};

export function SpendingChart({ data, totalSpent }: SpendingChartProps) {
  // Filter and transform data
  const chartData = data
    .filter(item => item.amount > 0 && item.category !== 'income' && item.category !== 'transfer')
    .map(item => {
      const categoryInfo = CATEGORIES.find(c => c.id === item.category);
      return {
        name: categoryInfo?.label || item.category,
        value: item.amount,
        percentage: Math.round(item.percentage),
        category: item.category,
      };
    })
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <GlassCard className="p-6" hover={false}>
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Spending by Category</h3>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.category] || '#64748b'}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xl font-bold text-[#1d1d1f]">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2 text-xs sm:text-sm">
        {chartData.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[item.category] || '#64748b' }}
              />
              <span className="text-[#6e6e73] truncate">{item.name}</span>
            </div>
            <span className="text-[#1d1d1f] font-medium ml-2">{item.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center border-t border-black/5 pt-4">
        <p className="text-2xl font-bold text-[#1d1d1f]">{formatCurrency(totalSpent)}</p>
        <p className="text-sm text-[#86868b]">Total Spent</p>
      </div>
    </GlassCard>
  );
}
