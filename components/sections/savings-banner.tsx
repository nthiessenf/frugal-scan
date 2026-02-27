'use client';

interface SavingsBannerProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  quickWinsCount: number;
  worthTheEffortCount: number;
  bigMovesCount: number;
}

export function SavingsBanner({
  totalMonthlySavings,
  totalAnnualSavings,
  quickWinsCount,
  worthTheEffortCount,
  bigMovesCount,
}: SavingsBannerProps) {
  if (!totalAnnualSavings || totalAnnualSavings <= 0) return null;

  const totalCount = quickWinsCount + worthTheEffortCount + bigMovesCount;
  if (totalCount === 0) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/30 border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.02)] p-6 sm:p-8">
      <div className="text-center">
        <p className="text-base sm:text-lg text-[#6e6e73] mb-1">
          You could save up to
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-emerald-600 tracking-tight">
          ${totalAnnualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year
        </p>
        <p className="text-sm text-[#86868b] mt-2">
          Based on {totalCount} actionable recommendation{totalCount !== 1 ? 's' : ''} across 3 tiers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {quickWinsCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/80 text-emerald-700">
              {quickWinsCount} Quick Win{quickWinsCount !== 1 ? 's' : ''}
            </span>
          )}
          {worthTheEffortCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-700">
              {worthTheEffortCount} Behavior Change{worthTheEffortCount !== 1 ? 's' : ''}
            </span>
          )}
          {bigMovesCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100/80 text-rose-700">
              {bigMovesCount} Big Move{bigMovesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
