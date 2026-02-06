'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { UploadSection } from '@/components/sections/upload-section';
import { ProcessingScreen } from '@/components/sections/processing-screen';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { mockAnalysisResult } from '@/lib/mock-data';

export default function Home() {
  const router = useRouter();
  const { status, progress, error, analyzeStatement, reset, limitReached } = useAnalysis();
  const { result, setResult } = useAnalysisContext();

  // Navigate to results when analysis is complete
  useEffect(() => {
    if (status === 'complete' && result) {
      router.push('/results');
    }
  }, [status, result, router]);

  const handleFileSelect = async (file: File) => {
    await analyzeStatement(file);
  };

  const handleLoadMockData = () => {
    setResult(mockAnalysisResult as any);
    router.push('/results');
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

  // Show processing screen during analysis
  if (status !== 'idle' && status !== 'error' && status !== 'complete') {
    return <ProcessingScreen stage={getStage()} />;
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
      <Hero />
      <HowItWorks />
      <UploadSection 
        onFileSelect={handleFileSelect}
        usageKey={`usage-${status}-${result ? 'complete' : 'idle'}`}
      />
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMockData}
            className="px-4 py-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] underline transition-colors"
          >
            ⚡ Load Mock Data (Dev Only)
          </button>
        </div>
      )}
    </main>
  );
}
