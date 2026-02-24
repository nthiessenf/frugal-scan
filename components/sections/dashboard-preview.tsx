'use client';

import { DEMO_ANALYSIS_RESULT } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, AlertTriangle } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';

interface DashboardPreviewProps {
  onTryDemo?: () => void;
  isDemoLoading?: boolean;
}

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
  other: '#64748b',
};

export function DashboardPreview({ onTryDemo, isDemoLoading }: DashboardPreviewProps) {
  const { ref, isVisible } = useInView(0.15);
  const demo = DEMO_ANALYSIS_RESULT;
  const { summary, categoryBreakdown, insights, tips, topMerchants } = demo;

  const potentialSavings = Math.round(tips.reduce((s, t) => s + t.potentialSavings, 0));
  const chartData = categoryBreakdown
    .filter((item) => item.amount > 0 && item.category !== 'income' && item.category !== 'transfer')
    .map((item) => {
      const label = CATEGORIES.find((c) => c.id === item.category)?.label || item.category;
      return {
        name: label,
        value: item.amount,
        category: item.category,
        color: COLORS[item.category] || '#64748b',
      };
    })
    .sort((a, b) => b.value - a.value);

  const previewInsights = insights.slice(0, 3);
  const previewMerchants = topMerchants.slice(0, 4);

  const chartTotal = chartData.reduce((s, d) => s + d.value, 0);
  const maxMerchantAmount = previewMerchants[0]?.amount ?? 1;
  const INSIGHT_BORDER_COLORS = ['#93c5fd', '#c4b5fd', '#fbcfe8'];

  const handleCardClick = () => {
    if (!onTryDemo || isDemoLoading) return;
    onTryDemo();
  };

  return (
    <section className="w-full pt-4 md:pt-8 pb-16 md:pb-24 px-5">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto scroll-reveal scroll-reveal-duration-800 ${isVisible ? 'scroll-reveal-visible' : ''}`}
      >
        {/* Subtle caption above preview */}
        <p className="text-sm md:text-base text-[#6e6e73] text-center mb-8 md:mb-10">
          Find patterns, subscriptions, and habits you&apos;d never spot on your own
        </p>

        {/* Card wrapper with gradient glow behind */}
        <div className="relative">
          {/* Soft gradient halo behind card */}
          <div
            className="pointer-events-none absolute -inset-2 md:-inset-8 -z-10 rounded-[40px] bg-gradient-to-r from-[#93c5fd]/15 via-[#c4b5fd]/15 to-[#fbcfe8]/15 blur-3xl opacity-60"
            aria-hidden
          />

          {/* Premium card */}
          <div
            className="relative rounded-3xl border border-black/[0.04] bg-white max-h-[480px] sm:max-h-[520px] overflow-hidden cursor-pointer shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.06),0_32px_64px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.08),0_40px_80px_rgba(0,0,0,0.08)]"
            onClick={handleCardClick}
            role={onTryDemo ? 'button' : undefined}
            aria-label={onTryDemo ? 'Preview sample analysis' : undefined}
          >
            {/* Dashboard content */}
            <div className="p-4 sm:p-6 bg-[#fafafa] min-h-[320px]">
              {/* Summary stats row — stagger entrance */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                {[
                  {
                    label: 'Total Spending',
                    value: `$${Math.round(summary.totalSpent).toLocaleString()}`,
                    highlight: false,
                  },
                  { label: 'Transactions', value: summary.transactionCount.toString(), highlight: false },
                  { label: 'Subscriptions', value: demo.subscriptions.length.toString(), highlight: false },
                  { label: 'Est. savings', value: `$${potentialSavings}/mo`, highlight: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="stagger-item rounded-xl bg-white border border-black/[0.06] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#86868b] truncate">
                      {stat.label}
                    </p>
                    <p
                      className={`text-lg sm:text-xl font-bold mt-0.5 truncate ${
                        stat.highlight ? 'text-emerald-600' : 'text-[#1d1d1f]'
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pie chart + Top merchants side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pie chart — larger, with center total */}
                <div
                  className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  role="img"
                  aria-label="Spending by category pie chart preview"
                >
                  <h3 className="text-xs font-semibold text-[#1d1d1f] mb-2">Spending by Category</h3>
                  <div className="relative h-44 sm:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={1}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label with total */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      aria-hidden
                    >
                      <span className="text-lg sm:text-xl font-bold text-[#1d1d1f]">
                        ${Math.round(chartTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2">
                    {chartData.slice(0, 5).map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10px] sm:text-xs text-[#6e6e73]">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top merchants — progress bars (now beside pie) */}
                <div className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xs font-semibold text-[#1d1d1f] mb-3">Top Merchants</h3>
                  <div className="space-y-2.5">
                    {previewMerchants.map((m) => {
                      const pct = Math.min(100, (m.amount / maxMerchantAmount) * 100);
                      return (
                        <div key={m.name} className="flex items-center gap-3">
                          <span className="text-xs text-[#1d1d1f] font-medium w-24 sm:w-28 truncate">
                            {m.name}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-black/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6e6e73] tabular-nums w-12 text-right">
                            ${Math.round(m.amount).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Insights row — full-width grid, partially clipped by fade */} 
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {previewInsights.map((insight, idx) => {
                  const Icon = insight.severity === 'warning' ? AlertTriangle : Info;
                  const borderColor = INSIGHT_BORDER_COLORS[idx % INSIGHT_BORDER_COLORS.length];
                  const descSnippet = insight.description.split(/[.—]/).slice(0, 2).join('. ').trim();
                  return (
                    <div
                      key={insight.id}
                      className="rounded-2xl bg-white border border-black/[0.04] p-3 flex gap-2 border-l-[3px]"
                      style={{ borderLeftColor: borderColor }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: borderColor }} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1d1d1f] line-clamp-1">
                          {insight.title}
                        </p>
                        <p className="text-[11px] text-[#6e6e73] line-clamp-2 mt-0.5">
                          {descSnippet}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
            {/* Bottom fade-out overlay to imply more content */} 
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>
        </div>

      {/* Below frame */}
      <p className="mt-6 text-center text-sm text-[#6e6e73]">
        Real insights from real spending data
      </p>
      {onTryDemo && (
        <p className="mt-2 text-center">
          <button
            type="button"
            onClick={onTryDemo}
            disabled={isDemoLoading}
            className="text-sm font-medium text-[#1d1d1f] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:via-[#c4b5fd] hover:to-[#fbcfe8] hover:bg-clip-text hover:text-transparent transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            See the full analysis →
          </button>
        </p>
      )}
      </div>
    </section>
  );
}
