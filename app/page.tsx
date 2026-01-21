"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { UploadZone } from "@/components/ui/upload-zone";

export default function Home() {
  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name, file.size, "bytes");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-12">
      <div className="w-full max-w-4xl space-y-12">
        {/* Buttons Section */}
        <GlassCard padding="lg">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">
              Button Variants
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" size="md">
                Primary Button
              </Button>
              <Button variant="secondary" size="md">
                Secondary Button
              </Button>
              <Button variant="ghost" size="md">
                Ghost Button
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Glass Card Showcase */}
        <GlassCard padding="lg">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1d1d1f]">
              Glass Card Component
            </h2>
            <p className="text-[#6e6e73]">
              This is a sample GlassCard with hover effects. Hover over it to see
              the smooth animation and shadow changes.
            </p>
            <p className="text-sm text-[#86868b]">
              The card uses glassmorphism with backdrop blur and subtle shadows
              following the design system.
            </p>
          </div>
        </GlassCard>

        {/* Upload Zone */}
        <GlassCard padding="lg">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Upload Zone
            </h2>
            <UploadZone
              onFileSelect={handleFileSelect}
              className="min-h-[200px]"
            />
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
