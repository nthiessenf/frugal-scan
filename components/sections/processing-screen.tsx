'use client';

import { useState, useEffect } from 'react';
import { Utensils, ShoppingBag, Car, Tv, Zap, Heart, Plane, CreditCard, PieChart, TrendingUp, Receipt, Sparkles } from 'lucide-react';

interface ProcessingScreenProps {
  status?: 'uploading' | 'parsing' | 'categorizing' | 'analyzing' | 'complete';
  stage?: 'uploading' | 'parsing' | 'analyzing' | 'complete';
}

const CATEGORY_ICONS = [
  { Icon: Utensils, color: '#f97316', label: 'Dining' },
  { Icon: ShoppingBag, color: '#8b5cf6', label: 'Shopping' },
  { Icon: Car, color: '#3b82f6', label: 'Transport' },
  { Icon: Tv, color: '#ec4899', label: 'Subscriptions' },
  { Icon: Zap, color: '#6366f1', label: 'Utilities' },
  { Icon: Heart, color: '#10b981', label: 'Health' },
  { Icon: Plane, color: '#0ea5e9', label: 'Travel' },
  { Icon: CreditCard, color: '#64748b', label: 'Other' },
];

// Generate random line widths
const generatePageLines = () => 
  Array.from({ length: 8 }, () => ({
    width1: 30 + Math.random() * 40,
    width2: 15 + Math.random() * 20,
  }));

// Generate random pie segments
const generatePieSegments = () => {
  const segments = [];
  let total = 0;
  for (let i = 0; i < 6; i++) {
    const value = 10 + Math.random() * 25;
    segments.push({ value, start: total });
    total += value;
  }
  // Normalize to 100
  return segments.map((s, i) => ({ 
    value: (s.value / total) * 100,
    start: (s.start / total) * 100,
    color: CATEGORY_ICONS[i % CATEGORY_ICONS.length].color 
  }));
};

// Generate random bar heights
const generateBars = () => 
  Array.from({ length: 6 }, () => 20 + Math.random() * 80);

export function ProcessingScreen({ status, stage }: ProcessingScreenProps) {
  // Map status to stage (backward compatibility)
  const currentStage = stage || (status === 'categorizing' ? 'parsing' : status) || 'parsing';
  const [animationMode, setAnimationMode] = useState(0); // 0: scan, 1: categorize, 2: chart, 3: insights
  
  // Mode-specific state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(Math.floor(Math.random() * 8) + 8);
  const [scanPosition, setScanPosition] = useState(0);
  const [pageLines, setPageLines] = useState(generatePageLines());
  const [activeCategory, setActiveCategory] = useState(0);
  const [pieSegments, setPieSegments] = useState<Array<{value: number, start: number, color: string}>>([]);
  const [bars, setBars] = useState<number[]>([]);
  const [filledBars, setFilledBars] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  // Rotate animation mode every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationMode((prev) => (prev + 1) % 4);
      // Reset mode-specific state
      setPieSegments(generatePieSegments());
      setBars(generateBars());
      setFilledBars(0);
      setInsightIndex(0);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mode 0: Document scanning
  useEffect(() => {
    if (animationMode !== 0) return;
    const interval = setInterval(() => {
      setScanPosition((prev) => {
        if (prev >= 7) {
          setCurrentPage((p) => (p >= totalPages ? 1 : p + 1));
          setPageLines(generatePageLines());
          setProcessedCount((c) => c + Math.floor(Math.random() * 5) + 3);
          return 0;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [animationMode, totalPages]);

  // Mode 1: Category sorting
  useEffect(() => {
    if (animationMode !== 1) return;
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % CATEGORY_ICONS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [animationMode]);

  // Mode 2: Chart building
  useEffect(() => {
    if (animationMode !== 2) return;
    setFilledBars(0);
    setBars(generateBars());
    const interval = setInterval(() => {
      setFilledBars((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 800);
    return () => clearInterval(interval);
  }, [animationMode]);

  // Mode 3: Insights
  useEffect(() => {
    if (animationMode !== 3) return;
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [animationMode]);

  const getModeTitle = () => {
    switch (animationMode) {
      case 0: return 'Reading your statement';
      case 1: return 'Categorizing transactions';
      case 2: return 'Building your dashboard';
      case 3: return 'Generating insights';
      default: return 'Processing';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 transition-all duration-500">
        {getModeTitle()}
      </h2>

      {/* Animation container */}
      <div className="w-full max-w-sm h-64 flex items-center justify-center">
        
        {/* Mode 0: Document Scanning */}
        {animationMode === 0 && (
          <div className="w-full bg-white rounded-xl shadow-lg border border-black/5 p-5 animate-fade-in">
            <div className="flex gap-3 mb-4 pb-3 border-b border-black/5">
              <div className="h-2 w-24 bg-black/10 rounded-full" />
              <div className="h-2 w-16 bg-black/5 rounded-full" />
            </div>
            <div className="space-y-3 relative">
              {pageLines.map((line, index) => (
                <div key={index} className={`flex justify-between items-center transition-all duration-300 ${index < scanPosition ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${index < scanPosition ? 'bg-gradient-to-r from-purple-200 to-purple-100' : 'bg-black/10'}`} style={{ width: `${line.width1}%` }} />
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${index < scanPosition ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-black/5'}`} style={{ width: `${line.width2}%` }} />
                </div>
              ))}
              <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-purple-300/30 via-purple-200/20 to-transparent pointer-events-none transition-all duration-300 -mx-5" style={{ top: `${scanPosition * 24 - 4}px` }} />
            </div>
          </div>
        )}

        {/* Mode 1: Category Sorting */}
        {animationMode === 1 && (
          <div className="grid grid-cols-4 gap-3 animate-fade-in">
            {CATEGORY_ICONS.map(({ Icon, color, label }, index) => (
              <div
                key={label}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-500 ${
                  index === activeCategory 
                    ? 'bg-white shadow-lg scale-110 border border-black/5' 
                    : 'bg-white/50 scale-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all duration-500`}
                  style={{ 
                    backgroundColor: index === activeCategory ? `${color}20` : '#f5f5f7',
                  }}
                >
                  <Icon 
                    className="w-5 h-5 transition-all duration-500" 
                    style={{ color: index === activeCategory ? color : '#86868b' }} 
                  />
                </div>
                <span className={`text-xs transition-all duration-500 ${index === activeCategory ? 'text-[#1d1d1f] font-medium' : 'text-[#86868b]'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Mode 2: Chart Building */}
        {animationMode === 2 && (
          <div className="w-full bg-white rounded-xl shadow-lg border border-black/5 p-5 animate-fade-in">
            <div className="flex items-end justify-between h-40 gap-2">
              {bars.map((height, index) => (
                <div key={index} className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 ease-out"
                    style={{
                      height: index < filledBars ? `${height}%` : '0%',
                      backgroundColor: CATEGORY_ICONS[index].color,
                      opacity: index < filledBars ? 1 : 0,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-black/5">
              {bars.slice(0, 6).map((_, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  <div className={`w-8 h-1.5 rounded-full transition-all duration-500 ${index < filledBars ? 'bg-black/20' : 'bg-black/5'}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode 3: Insights */}
        {animationMode === 3 && (
          <div className="w-full space-y-3 animate-fade-in">
            {[
              { icon: TrendingUp, text: 'Analyzing spending trends...' },
              { icon: Receipt, text: 'Finding recurring charges...' },
              { icon: PieChart, text: 'Comparing categories...' },
              { icon: Sparkles, text: 'Generating recommendations...' },
            ].map(({ icon: Icon, text }, index) => (
              <div
                key={text}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${
                  index === insightIndex
                    ? 'bg-white shadow-lg border border-black/5'
                    : 'bg-white/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  index === insightIndex ? 'bg-purple-100' : 'bg-black/5'
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-500 ${
                    index === insightIndex ? 'text-purple-500' : 'text-[#86868b]'
                  }`} />
                </div>
                <span className={`text-sm transition-all duration-500 ${
                  index === insightIndex ? 'text-[#1d1d1f]' : 'text-[#86868b]'
                }`}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-[#86868b]">
        Usually takes 60-90 seconds
      </p>
    </div>
  );
}
