import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  hover = true,
  padding = "lg",
}: GlassCardProps) {
  const baseStyles =
    "relative overflow-hidden bg-white/70 backdrop-blur-xl backdrop-saturate-[180%] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)] border border-black/[0.08]";

  const hoverStyles = hover
    ? "transition-all duration-400 cursor-pointer hover:bg-white/85 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(147,197,253,0.12)]"
    : "";

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-10",
  };

  return (
    <div className={cn(baseStyles, hoverStyles, paddingStyles[padding], className)}>
      {children}
    </div>
  );
}

