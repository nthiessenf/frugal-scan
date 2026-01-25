import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8b5cf6] mx-auto mb-4" />
        <p className="text-sm text-[#6e6e73]">Loading...</p>
      </div>
    </main>
  );
}

