'use client';

import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';

/* ─── Color map ──────────────────────────────────────────────────── */
const COLOR_MAP = {
  accent: {
    badgeBg:   'rgba(79,110,247,0.15)',
    badgeText: '#7B96FF',
    dot:       '#4F6EF7',
    activeBorder: 'rgba(79,110,247,0.45)',
    activeBg: 'rgba(79,110,247,0.06)',
  },
  amber: {
    badgeBg:   'rgba(245,158,11,0.12)',
    badgeText: '#F6B84B',
    dot:       '#F59E0B',
    activeBorder: 'rgba(245,158,11,0.3)',
    activeBg: 'rgba(245,158,11,0.04)',
  },
  green: {
    badgeBg:   'rgba(34,197,94,0.12)',
    badgeText: '#4ADE80',
    dot:       '#22C55E',
    activeBorder: 'rgba(34,197,94,0.3)',
    activeBg: 'rgba(34,197,94,0.04)',
  },
} as const;

/* ─── Chevron ────────────────────────────────────────────────────── */
function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="#7A8BAD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────────── */
interface DrillCardProps {
  drill: Drill;
  index: number;
}

export default function DrillCard({ drill, index }: DrillCardProps) {
  const colors = COLOR_MAP[drill.meta.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileTap={{ scale: 0.985 }}
      className="flex items-start gap-3 rounded-2xl p-4 cursor-pointer"
      style={{
        background: drill.active ? colors.activeBg : 'rgba(15,32,64,0.7)',
        border: `1px solid ${drill.active ? colors.activeBorder : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Number badge */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: colors.badgeBg }}
      >
        <span
          className="font-display font-bold text-sm leading-none"
          style={{ color: colors.badgeText }}
        >
          {drill.id}
        </span>
      </div>

      {/* Drill info */}
      <div className="flex-1">
        <p
          className="font-body uppercase tracking-widest leading-none mb-1.5"
          style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}
        >
          {drill.type}
        </p>
        <p
          className="font-display leading-snug mb-1"
          style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF' }}
        >
          {drill.name}
        </p>
        <p
          className="font-body leading-snug mb-2"
          style={{ fontSize: 12, color: '#7A8BAD' }}
        >
          {drill.description}
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: colors.dot }}
          />
          <span className="font-body text-xs" style={{ color: '#7A8BAD' }}>
            {drill.meta.mode} · {drill.meta.duration}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <div className="mt-1 shrink-0">
        <Chevron />
      </div>
    </motion.div>
  );
}
