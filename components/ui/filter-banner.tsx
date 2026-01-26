'use client';

import { X } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface FilterBannerProps {
  categoryName: string;
  onClear: () => void;
}

export function FilterBanner({ categoryName, onClear }: FilterBannerProps) {
  // Find the category to get its color
  const category = CATEGORIES.find(c => c.label === categoryName);
  const categoryColor = category?.color || '#8b5cf6';

  return (
    <div className="flex items-center justify-start">
      <div 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm"
      >
        <div 
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: categoryColor }}
        />
        <span className="text-sm text-[#1d1d1f]">
          Showing: <span className="font-semibold">{categoryName}</span>
        </span>
        <button
          onClick={onClear}
          className="ml-1 p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Clear filter"
        >
          <X className="w-4 h-4 text-[#6e6e73]" />
        </button>
      </div>
    </div>
  );
}

