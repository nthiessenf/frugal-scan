"use client";

import React from "react";
import { UploadZone } from "@/components/ui/upload-zone";

export function UploadSection() {
  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name, file.size, "bytes");
  };

  return (
    <section id="upload" className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-[#1d1d1f] mb-8">
          Ready to see your spending?
        </h2>

        {/* Upload Zone */}
        <UploadZone onFileSelect={handleFileSelect} />

        {/* Privacy Note */}
        <p className="mt-6 text-sm text-[#86868b]">
          🔒 Your statement is processed securely and never stored
        </p>
      </div>
    </section>
  );
}

