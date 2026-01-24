'use client';

import { useState, useCallback } from 'react';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { categorizeAll, detectSubscriptions } from '@/lib/categorize';
import { calculateSummary, getCategoryBreakdown, getTopMerchants } from '@/lib/analysis';
import { CategorizedTransaction, AnalysisResult } from '@/types';

type AnalysisStatus = 'idle' | 'uploading' | 'parsing' | 'categorizing' | 'analyzing' | 'complete' | 'error';

export function useAnalysis() {
  const { setResult, setParsedStatement, setValidationResult, clearAll } = useAnalysisContext();
  
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState<CategorizedTransaction[]>([]);

  const analyzeStatement = useCallback(async (file: File) => {
    try {
      // Reset state
      setError(null);
      setNeedsReview([]);
      
      // Step 1: Upload
      setStatus('uploading');
      setProgress(10);

      const formData = new FormData();
      formData.append('file', file);

      // Step 2: Parse PDF with Claude
      setStatus('parsing');
      setProgress(30);

      const parseResponse = await fetch('/api/parse-statement', {
        method: 'POST',
        body: formData,
      });

      const parseData = await parseResponse.json();

      if (!parseData.success) {
        throw new Error(parseData.error || 'Failed to parse statement');
      }

      setParsedStatement(parseData.data);
      setValidationResult(parseData.validation);

      // Step 3: Categorize transactions
      setStatus('categorizing');
      setProgress(50);

      const categorized = categorizeAll(parseData.data.transactions);
      const subscriptions = detectSubscriptions(categorized);

      // Check for low-confidence transactions
      const lowConfidence = categorized.filter(t => t.needsReview);
      setNeedsReview(lowConfidence);

      // Step 4: Generate AI insights
      setStatus('analyzing');
      setProgress(70);

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: categorized, subscriptions }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeData.success) {
        // Even if insights fail, we can show partial results
        console.warn('Insights generation failed:', analyzeData.error);
      }

      // Step 5: Assemble complete result
      setProgress(90);

      const summary = calculateSummary(categorized, subscriptions);
      const categoryBreakdown = getCategoryBreakdown(categorized);
      const topMerchants = getTopMerchants(categorized, 10);

      const fullResult: AnalysisResult = {
        summary,
        categoryBreakdown,
        topMerchants,
        subscriptions,
        insights: analyzeData.data?.insights || [],
        tips: analyzeData.data?.tips || [],
        generatedAt: new Date().toISOString(),
      };

      setResult(fullResult);
      setStatus('complete');
      setProgress(100);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Analysis error:', err);
    }
  }, [setResult, setParsedStatement, setValidationResult]);

  const reset = useCallback(() => {
    clearAll();
    setStatus('idle');
    setProgress(0);
    setError(null);
    setNeedsReview([]);
  }, [clearAll]);

  return {
    status,
    progress,
    error,
    needsReview,
    analyzeStatement,
    reset,
  };
}

