import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] text-white shadow-lg shadow-blue-300/25 hover:scale-105 hover:shadow-xl hover:shadow-purple-300/30",
    secondary:
      "bg-white/50 backdrop-blur-md border border-black/10 text-gray-900 hover:bg-white/80 hover:border-blue-300/30 hover:scale-105",
    ghost:
      "bg-transparent text-gray-700 hover:bg-white/50 hover:scale-105",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

