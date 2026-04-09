'use client';

import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';

const TYPE_COLORS: Record<string, string> = {
  accent: '#7B96FF',
  amber:  '#F6B84B',
  green:  '#4ADE80',
};

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="#7A8BAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface DrillCardProps {
  drill: Drill;
  index: number;
  unified?: boolean;
}

export default function DrillCard({ drill, index, unified = false }: DrillCardProps) {
  const typeColor = TYPE_COLORS[drill.meta.color] ?? '#7B96FF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      whileTap={{ scale: 0.985 }}
      className="flex items-start gap-3 p-4 cursor-pointer"
      style={unified ? {} : {
        background: 'rgba(15,32,64,0.7)',
        border: '1px solid rgba(79,110,247,0.22)',
        borderRadius: 16,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Step badge */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'rgba(79,110,247,0.14)', border: '1px solid rgba(79,110,247,0.25)' }}
      >
        <span className="font-display font-bold text-sm leading-none" style={{ color: '#7B96FF' }}>
          {index + 1}
        </span>
      </div>

      {/* Drill info */}
      <div className="flex-1">
        <p className="font-body uppercase tracking-widest leading-none mb-1.5" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          {drill.type}
        </p>
        <p className="font-display leading-snug mb-1" style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF' }}>
          {drill.name}
        </p>
        <p className="font-body leading-snug mb-2" style={{ fontSize: 12, color: '#7A8BAD' }}>
          {drill.description}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeColor }} />
          <span className="font-body text-xs" style={{ color: '#7A8BAD' }}>
            {drill.meta.mode} · {drill.meta.duration}
          </span>
        </div>
      </div>

      <div className="mt-1 shrink-0">
        <Chevron />
      </div>
    </motion.div>
  );
}
