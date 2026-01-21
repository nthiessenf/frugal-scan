"use client";

import React, { useState, useRef, DragEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function UploadZone({
  onFileSelect,
  isLoading = false,
  error,
  className,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file only.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB.";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      // You might want to pass this error back through a callback
      console.error(validationError);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border-2 border-dashed transition-all duration-300",
        "flex flex-col items-center justify-center gap-4 p-12",
        "cursor-pointer",
        isDragOver
          ? "border-[#93c5fd] border-solid bg-blue-50/50 scale-[1.02]"
          : "border-black/20",
        error && "border-red-400",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      <Upload
        className={cn(
          "w-12 h-12",
          isDragOver ? "text-[#93c5fd]" : "text-[#6e6e73]",
          error && "text-red-400"
        )}
      />

      <div className="text-center">
        <p className="text-lg font-semibold text-[#1d1d1f] mb-1">
          Drop your bank statement here
        </p>
        <p className="text-sm text-[#6e6e73]">
          or click to browse (PDF only, max 10MB)
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-400 font-medium mt-2">{error}</p>
      )}
    </div>
  );
}

