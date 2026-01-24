'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, FolderOpen, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';

interface ProcessingScreenProps {
  status: string;
  progress: number;
}

const statusConfig = {
  uploading: { icon: Upload, message: 'Uploading your statement' },
  parsing: { icon: FileText, message: 'Reading your transactions' },
  categorizing: { icon: FolderOpen, message: 'Organizing spending categories' },
  analyzing: { icon: Sparkles, message: 'AI is generating insights' },
};

export function ProcessingScreen({ status, progress }: ProcessingScreenProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.parsing;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f7]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className="w-[400px] p-10 text-center" hover={false}>
          {/* Animated gradient orb */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] opacity-40 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8]">
              <Icon className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Status message */}
          <h3 className="mb-2 text-xl font-semibold text-[#1d1d1f]">
            {config.message}
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </h3>
          <p className="mb-6 text-sm text-[#6e6e73]">
            This usually takes 15-30 seconds
          </p>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-xs text-[#86868b]">{progress}% complete</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

