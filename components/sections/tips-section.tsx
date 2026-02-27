'use client';

import { useState } from 'react';
import { SavingsTip, TieredTip } from '@/types';
import { Target, ChevronDown, ChevronUp, Lightbulb, Zap, Clock, TrendingDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';

interface TipsSectionProps {
  tips: SavingsTip[];
  enhancedTips?: {
    quickWins: TieredTip[];
    worthTheEffort: TieredTip[];
    bigMoves: TieredTip[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;
  };
}

function TierRow({
  tip,
  badgeColor,
}: {
  tip: TieredTip;
  badgeColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = tip.description.length > 120;

  return (
    <div className="py-3 border-b border-black/5 last:border-0">
      <button
        onClick={() => isLong && setExpanded(!expanded)}
        className={`w-full text-left ${isLong ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#1d1d1f]">{tip.title}</h4>
            <p
              className={`text-xs text-[#6e6e73] mt-0.5 leading-relaxed ${
                !expanded && isLong ? 'line-clamp-2' : ''
              }`}
            >
              {tip.description}
            </p>
            <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-md text-xs font-medium ${badgeColor}`}>
              Save ~${tip.potentialMonthlySavings}/mo (${tip.potentialAnnualSavings}/yr)
            </span>
          </div>
          {isLong && (
            <div className="flex-shrink-0 p-1 rounded-lg bg-gray-50/80">
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#86868b]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#86868b]" />
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

function TierSection({
  title,
  subtitle,
  tips,
  theme,
  defaultExpanded = true,
}: {
  title: string;
  subtitle: string;
  tips: TieredTip[];
  theme: 'emerald' | 'amber' | 'rose';
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tierTotal = tips.reduce((s, t) => s + t.potentialMonthlySavings, 0);

  const styles = {
    emerald: {
      header: 'bg-emerald-100/80',
      text: 'text-emerald-700',
      badge: 'bg-emerald-50/80 text-emerald-700',
    },
    amber: {
      header: 'bg-amber-100/80',
      text: 'text-amber-700',
      badge: 'bg-amber-50/80 text-amber-700',
    },
    rose: {
      header: 'bg-rose-100/80',
      text: 'text-rose-700',
      badge: 'bg-rose-50/80 text-rose-700',
    },
  }[theme];

  return (
    <div className="rounded-xl border border-black/[0.04] overflow-hidden mb-4 last:mb-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 ${styles.header} transition-colors hover:opacity-90`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${styles.text}`}>{title}</span>
          <span className="text-xs text-[#6e6e73] hidden sm:inline">— {subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${styles.text}`}>
            ~${tierTotal}/mo
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#86868b]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#86868b]" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-4 py-2 bg-white/30">
          {tips.map((tip) => (
            <TierRow key={tip.id} tip={tip} badgeColor={styles.badge} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TipsSection({ tips, enhancedTips }: TipsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hasEnhancedTips =
    enhancedTips &&
    (enhancedTips.quickWins?.length > 0 ||
      enhancedTips.worthTheEffort?.length > 0 ||
      enhancedTips.bigMoves?.length > 0);

  if (hasEnhancedTips && enhancedTips) {
    return (
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#c4b5fd]" />
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Savings Roadmap</h3>
        </div>

        {enhancedTips.quickWins?.length > 0 && (
          <TierSection
            title="Quick Wins"
            subtitle="Painless changes you won't miss"
            tips={enhancedTips.quickWins}
            theme="emerald"
          />
        )}
        {enhancedTips.worthTheEffort?.length > 0 && (
          <TierSection
            title="Worth the Effort"
            subtitle="Small behavior changes with real impact"
            tips={enhancedTips.worthTheEffort}
            theme="amber"
          />
        )}
        {enhancedTips.bigMoves?.length > 0 && (
          <TierSection
            title="Big Moves"
            subtitle="Major changes for maximum savings"
            tips={enhancedTips.bigMoves}
            theme="rose"
          />
        )}

        {(enhancedTips.totalMonthlySavings > 0 || enhancedTips.totalAnnualSavings > 0) && (
          <p className="mt-4 pt-4 border-t border-black/5 text-sm font-medium text-[#1d1d1f]">
            Total potential savings: ${enhancedTips.totalMonthlySavings.toFixed(0)}/month (
            ${enhancedTips.totalAnnualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year)
          </p>
        )}
      </GlassCard>
    );
  }

  // Fallback: original flat tips layout
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
    <GlassCard className="p-6" hover={false}>
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
    </GlassCard>
  );
}
