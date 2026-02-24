'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { DashboardPreview } from '@/components/sections/dashboard-preview';
import { UploadSection } from '@/components/sections/upload-section';
import { PrivacyComparison } from '@/components/sections/privacy-comparison';
import { ProcessingScreen } from '@/components/sections/processing-screen';
import { ErrorMessage } from '@/components/ui/error-message';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { getDemoAnalysisResult } from '@/lib/mock-data';

export default function Home() {
  const router = useRouter();
  const { status, progress, error, analyzeStatement, reset, limitReached } = useAnalysis();
  const { result, setResult } = useAnalysisContext();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const demoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
  }, []);

  // Navigate to results when analysis is complete
  useEffect(() => {
    if (status === 'complete' && result) {
      router.push('/results');
    }
  }, [status, result, router]);

  // Show upgrade modal when limit is reached
  useEffect(() => {
    if (limitReached || (error && (error.toLowerCase().includes('limit') || error.toLowerCase().includes('upgrade')))) {
      setShowUpgradeModal(true);
    }
  }, [error, limitReached]);

  const handleFileSelect = async (file: File) => {
    await analyzeStatement(file);
  };
  
  const handleLoadDemo = () => {
    if (isDemoLoading) return;
    setIsDemoLoading(true);
    demoTimeoutRef.current = setTimeout(() => {
      const demoResult = getDemoAnalysisResult();
      setResult(demoResult);
      router.push('/results?demo=true');
      setIsDemoLoading(false);
      demoTimeoutRef.current = null;
    }, 2500);
  };

  // Map status to stage for ProcessingScreen
  const getStage = (): 'uploading' | 'parsing' | 'analyzing' | 'complete' => {
    switch (status) {
      case 'uploading': return 'uploading';
      case 'parsing': 
      case 'categorizing': return 'parsing';
      case 'analyzing': return 'analyzing';
      case 'complete': return 'complete';
      default: return 'parsing';
    }
  };

  // Show processing screen during real analysis
  if (status !== 'idle' && status !== 'error' && status !== 'complete') {
    return <ProcessingScreen stage={getStage()} />;
  }

  // Show processing screen during demo flow (2–3s anticipation)
  if (isDemoLoading) {
    return <ProcessingScreen isDemo />;
  }

  // Show error screen
  if (status === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <ErrorMessage
          title="Analysis Failed"
          message={error || 'Something went wrong. Please try again.'}
          onRetry={reset}
          onDismiss={reset}
        />
      </main>
    );
  }

  // Default landing page
  return (
    <main>
      <Hero onTryDemo={handleLoadDemo} isDemoLoading={isDemoLoading} />
      <DashboardPreview onTryDemo={handleLoadDemo} isDemoLoading={isDemoLoading} />
      <HowItWorks />
      <PrivacyComparison />
      <UploadSection 
        onFileSelect={handleFileSelect}
        usageKey={`usage-${status}-${result ? 'complete' : 'idle'}`}
      />
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => {
          setShowUpgradeModal(false);
          reset(); // Reset error state when closing modal
        }} 
      />
    </main>
  );
}
