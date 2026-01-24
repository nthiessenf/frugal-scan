'use client';

import { Insight } from '@/types';
import { Info, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface InsightsGridProps {
  insights: Insight[];
}

export function InsightsGrid({ insights }: InsightsGridProps) {
  const getIcon = (severity: Insight['severity']) => {
    switch (severity) {
      case 'positive':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getColors = (severity: Insight['severity']) => {
    switch (severity) {
      case 'positive':
        return {
          border: 'border-l-emerald-400/70',
          iconBg: 'bg-emerald-50/80',
          iconColor: 'text-emerald-500/80',
        };
      case 'warning':
        return {
          border: 'border-l-amber-400/70',
          iconBg: 'bg-amber-50/80',
          iconColor: 'text-amber-500/80',
        };
      default:
        return {
          border: 'border-l-[#93c5fd]',
          iconBg: 'bg-blue-50/80',
          iconColor: 'text-[#93c5fd]',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#c4b5fd]" />
        <h3 className="text-lg font-semibold text-[#1d1d1f]">AI Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.severity);
          const colors = getColors(insight.severity);
          
          return (
            <div
              key={insight.id}
              className={`relative overflow-hidden rounded-2xl p-5 bg-white/60 backdrop-blur-xl border border-black/[0.06] border-l-[3px] ${colors.border} shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.02)] transition-all duration-400 hover:bg-white/80 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(147,197,253,0.12)]`}
            >
              <div className="flex gap-4">
                <div className={`p-2 rounded-xl ${colors.iconBg} h-fit`}>
                  <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#1d1d1f] text-sm tracking-[-0.01em]">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-[#6e6e73] mt-1.5 leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.amount && (
                    <div className="inline-flex items-center mt-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#93c5fd]/10 via-[#c4b5fd]/10 to-[#fbcfe8]/10">
                      <span className="text-xs font-semibold text-[#6e6e73]">
                        ${insight.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

