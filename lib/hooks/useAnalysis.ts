'use client';

import { useState, useCallback } from 'react';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { categorizeAll, detectSubscriptions } from '@/lib/categorize';
import { calculateSummary, getCategoryBreakdown, getTopMerchants } from '@/lib/analysis';
import { CategorizedTransaction, AnalysisResult, ParsedStatement, ValidationResult } from '@/types';
import { canAnalyze, incrementUsage } from '@/lib/usage-tracking';
import { isPro } from '@/lib/pro-status';

type AnalysisStatus = 'idle' | 'uploading' | 'parsing' | 'categorizing' | 'analyzing' | 'complete' | 'error';

export function useAnalysis() {
  const { setResult, setParsedStatement, setValidationResult, clearAll } = useAnalysisContext();
  
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState<CategorizedTransaction[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  const analyzeStatement = useCallback(async (file: File) => {
    // At the start of the analysis function
    console.log('=== CLIENT TIMING START ===');
    const clientStart = Date.now();
    
    try {
      // Reset state
      setError(null);
      setNeedsReview([]);
      setLimitReached(false);
      
      // Check usage limit BEFORE starting analysis (Pro users bypass)
      if (!canAnalyze(isPro)) {
        setLimitReached(true);
        setError('You\'ve used all 3 free analyses this month. Upgrade to Pro for unlimited analyses.');
        setStatus('error');
        return;
      }
      
      // Step 1: Upload
      setStatus('uploading');
      setProgress(10);

      const formData = new FormData();
      formData.append('file', file);

      // Step 2: Parse PDF with Claude
      setStatus('parsing');
      setProgress(30);

      // Before calling parse-statement API
      console.log('Starting PDF parse...');
      const parseStart = Date.now();

      const parseResponse = await fetch('/api/parse-statement', {
        method: 'POST',
        body: formData,
      });

      // Defensive: response.json() can throw in Safari when body is not valid JSON
      let parseData: { success: boolean; data?: ParsedStatement; error?: string; validation?: ValidationResult };
      try {
        const responseText = await parseResponse.text();
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from parse API');
        }
        if (responseText.trim().substring(0, 50) !== '{') {
          console.error('[useAnalysis] Parse response does not look like JSON. First 200 chars:', responseText.substring(0, 200));
        }
        parseData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[useAnalysis] Failed to parse parse-statement API response:', parseErr);
        console.error('[useAnalysis] Response status:', parseResponse.status);
        throw new Error(
          parseResponse.ok
            ? 'Invalid response format from server'
            : `Failed to parse statement: ${parseResponse.status} ${parseResponse.statusText}`
        );
      }

      // After parse-statement returns
      console.log(`PDF parse complete: ${Date.now() - parseStart}ms`);

      if (!parseData.success || !parseData.data) {
        throw new Error(parseData.error || 'Failed to parse statement');
      }

      setParsedStatement(parseData.data);
      setValidationResult(parseData.validation ?? null);

      // Step 3: Categorize transactions
      setStatus('categorizing');
      setProgress(50);

      const categorizeStart = Date.now();
      const categorized = categorizeAll(parseData.data.transactions);
      const subscriptions = detectSubscriptions(categorized);
      console.log(`Categorization complete: ${Date.now() - categorizeStart}ms`);

      // Check for low-confidence transactions
      const lowConfidence = categorized.filter(t => t.needsReview);
      setNeedsReview(lowConfidence);

      // Step 4: Generate AI insights
      setStatus('analyzing');
      setProgress(70);

      // Before calling analyze API
      console.log('Starting analysis...');
      const analyzeStart = Date.now();

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: categorized, subscriptions }),
      });

      // Defensive: response.json() can throw "The string did not match the expected pattern"
      // in Safari when the response body is not valid JSON (e.g. HTML error page)
      let analyzeData: { success: boolean; data?: AnalysisResult; error?: string };
      try {
        const responseText = await analyzeResponse.text();
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from analyze API');
        }
        // Log first/last chars to help debug JSON parse failures
        if (responseText.trim().substring(0, 50) !== '{') {
          console.error('[useAnalysis] Analyze response does not look like JSON. First 200 chars:', responseText.substring(0, 200));
        }
        analyzeData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[useAnalysis] Failed to parse analyze API response:', parseErr);
        console.error('[useAnalysis] Response status:', analyzeResponse.status);
        throw new Error(
          analyzeResponse.ok
            ? 'Invalid response format from server'
            : `Analysis failed: ${analyzeResponse.status} ${analyzeResponse.statusText}`
        );
      }

      // After analyze returns
      console.log(`Analysis complete: ${Date.now() - analyzeStart}ms`);

      if (!analyzeData.success) {
        // Even if insights fail, we can show partial results
        console.warn('Insights generation failed:', analyzeData.error);
      }

      // Step 5: Assemble complete result
      setProgress(90);

      const summary = calculateSummary(categorized, subscriptions);
      const categoryBreakdown = getCategoryBreakdown(categorized);
      const topMerchants = getTopMerchants(categorized, 10);

      // Prefer full API response to avoid manual field mapping errors; fallback to local compute
      const fullResult: AnalysisResult = analyzeData.data
        ? { ...analyzeData.data, transactions: categorized }
        : {
            summary,
            categoryBreakdown,
            topMerchants,
            subscriptions,
            insights: [],
            tips: [],
            generatedAt: new Date().toISOString(),
            transactions: categorized,
          };

      setResult(fullResult);
      setStatus('complete');
      setProgress(100);

      // Increment usage count after successful analysis
      incrementUsage();

      // At the end
      console.log(`=== CLIENT TOTAL: ${Date.now() - clientStart}ms ===`);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Analysis error:', err);
      console.log(`=== CLIENT TOTAL (ERROR): ${Date.now() - clientStart}ms ===`);
    }
  }, [setResult, setParsedStatement, setValidationResult]);

  const reset = useCallback(() => {
    clearAll();
    setStatus('idle');
    setProgress(0);
    setError(null);
    setNeedsReview([]);
    setLimitReached(false);
  }, [clearAll]);

  return {
    status,
    progress,
    error,
    needsReview,
    limitReached,
    analyzeStatement,
    reset,
  };
}

