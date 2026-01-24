'use client';

import { useState } from 'react';
import { SavingsTip } from '@/types';
import { Lightbulb, ChevronDown, ChevronUp, Zap, Clock, TrendingDown } from 'lucide-react';

interface TipsSectionProps {
  tips: SavingsTip[];
}

export function TipsSection({ tips }: TipsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getDifficultyStyles = (difficulty: SavingsTip['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-50/80 text-emerald-600/80';
      case 'medium':
        return 'bg-amber-50/80 text-amber-600/80';
      case 'hard':
        return 'bg-rose-50/80 text-rose-500/80';
    }
  };

  const getTimeframeIcon = (timeframe: SavingsTip['timeframe']) => {
    switch (timeframe) {
      case 'immediate':
        return Zap;
      case 'monthly':
        return Clock;
      case 'yearly':
        return TrendingDown;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-5 h-5 text-[#fbcfe8]" />
        <h3 className="text-lg font-semibold text-[#1d1d1f]">Ways to Save</h3>
      </div>

      {tips.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-50/80 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-[#86868b]" />
          </div>
          <p className="text-sm text-[#6e6e73]">No specific tips right now</p>
          <p className="text-xs text-[#86868b] mt-1">Your spending looks well managed!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip) => {
            const isExpanded = expandedId === tip.id;
            const TimeframeIcon = getTimeframeIcon(tip.timeframe);
            
            return (
              <div
                key={tip.id}
                className="rounded-xl bg-white/50 border border-black/[0.04] overflow-hidden transition-all duration-300 hover:bg-white/70"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-[#1d1d1f]">
                        {tip.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyStyles(tip.difficulty)}`}>
                        {tip.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-[#93c5fd]/15 via-[#c4b5fd]/15 to-[#fbcfe8]/15">
                        <span className="text-xs font-semibold text-[#6e6e73]">
                          Save ~${tip.potentialSavings}/mo
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#86868b]">
                        <TimeframeIcon className="w-3 h-3" />
                        {tip.timeframe}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50/80">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#86868b]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#86868b]" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="pt-3 border-t border-black/[0.04]">
                      <p className="text-sm text-[#6e6e73] leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

