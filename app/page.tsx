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

export default function Home() {
  const router = useRouter();
  const { status, progress, error, analyzeStatement, reset } = useAnalysis();
  const { result } = useAnalysisContext();

  // Navigate to results when analysis is complete
  useEffect(() => {
    if (status === 'complete' && result) {
      router.push('/results');
    }
  }, [status, result, router]);

  const handleFileSelect = async (file: File) => {
    await analyzeStatement(file);
  };

  // Show processing screen during analysis
  if (status !== 'idle' && status !== 'error' && status !== 'complete') {
    return <ProcessingScreen status={status} progress={progress} />;
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
      <UploadSection onFileSelect={handleFileSelect} />
    </main>
  );
}
