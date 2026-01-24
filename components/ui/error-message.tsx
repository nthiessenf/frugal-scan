'use client';

import { AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ title, message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <GlassCard className="max-w-md p-8 text-center" hover={false}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="mb-2 text-xl font-semibold text-[#1d1d1f]">{title}</h3>
      <p className="mb-6 text-sm text-[#6e6e73]">{message}</p>
      
      <div className="flex flex-col gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="w-full">
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button variant="secondary" onClick={onDismiss} className="w-full">
            Upload Different File
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

