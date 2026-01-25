import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5 bg-[#f5f5f7]">
      <GlassCard className="max-w-md p-8 text-center" hover={false}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7]">
          <FileQuestion className="h-8 w-8 text-[#86868b]" />
        </div>
        
        <h1 className="text-xl font-semibold text-[#1d1d1f] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[#6e6e73] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link href="/">
          <Button variant="primary" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </GlassCard>
    </main>
  );
}

