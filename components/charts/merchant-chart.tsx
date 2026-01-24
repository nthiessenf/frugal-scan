'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard } from '@/components/ui/card';
import { Category } from '@/types';

interface MerchantChartProps {
  data: Array<{
    name: string;
    amount: number;
    count: number;
    category: Category;
  }>;
}

export function MerchantChart({ data }: MerchantChartProps) {
  // Take top 10 merchants
  const chartData = data.slice(0, 10).map(item => ({
    name: item.name,
    fullName: item.name,
    amount: item.amount,
    transactions: item.count,
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Gradient colors for bars (top to bottom by amount)
  const getBarColor = (index: number) => {
    const colors = [
      '#7c3aed', // violet-600 (darkest)
      '#8b5cf6', // violet-500
      '#a78bfa', // violet-400
      '#b794f6', // custom violet
      '#c4b5fd', // violet-300
      '#d4c4fd', // custom lighter
      '#ddd6fe', // violet-200
      '#e4dcfe', // custom
      '#ebe5fe', // custom
      '#f3f0ff', // lightest but still visible
    ];
    return colors[index] || '#c4b5fd';
  };

  return (
    <GlassCard className="p-6" hover={false}>
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Top 10 Merchants</h3>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              tickFormatter={(value) => `$${value}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6e6e73', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#1d1d1f', fontSize: 12 }}
              width={160}
            />
            <Tooltip
              formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
