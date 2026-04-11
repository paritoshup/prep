'use client';

import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';

const BADGE_STYLES = [
  { bg: 'var(--accent-bg)', color: 'var(--accent-text)' },
  { bg: 'var(--blue-bg)',   color: 'var(--blue-text)' },
  { bg: 'var(--green-bg)',  color: 'var(--green-text)' },
];

interface DrillCardProps {
  drill: Drill;
  index: number;
  unified?: boolean;
  completed?: boolean;
}

export default function DrillCard({ drill, index, completed = false }: DrillCardProps) {
  const badge = BADGE_STYLES[index % 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      whileTap={{ scale: 0.985 }}
      className="flex items-start gap-3 p-4 cursor-pointer"
      style={{ opacity: completed ? 0.5 : 1 }}
    >
      {/* Number badge */}
      <div
        className="flex items-center justify-center shrink-0 mt-0.5"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: completed ? 'var(--green-bg)' : badge.bg,
        }}
      >
        {completed ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="var(--green-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: badge.color }}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-body uppercase tracking-widest mb-1" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.07em', fontWeight: 500 }}>
          {drill.type}
        </p>
        <p className="font-display leading-snug mb-1.5" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          {drill.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: completed ? 'var(--green)' : badge.color }} />
          <span className="font-body" style={{ fontSize: 11, color: 'var(--muted)' }}>
            {drill.meta.mode} · {drill.meta.duration}
          </span>
        </div>
      </div>

    </motion.div>
  );
}
