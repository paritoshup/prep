'use client';

import { motion } from 'framer-motion';
import { readinessBars } from '@/lib/mockData';

interface ReadinessCardProps {
  score: number;
}

export default function ReadinessCard({ score }: ReadinessCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between gap-4"
      style={{
        background: 'rgba(15,32,64,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Score */}
      <div>
        <p className="font-body text-xs mb-2" style={{ color: '#7A8BAD' }}>Readiness Score</p>
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <span
            className="font-display leading-none"
            style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF' }}
          >
            {score}
          </span>
          <span className="font-body text-muted text-sm">/ 100</span>
        </div>
        <p className="font-body" style={{ fontSize: 10, color: '#4A5A7A', lineHeight: 1.5 }}>
          Reflects your drill scores, streaks, and daily consistency.
        </p>
      </div>

      {/* Animated bar chart */}
      <div className="flex items-end gap-[5px] h-12 shrink-0">
        {readinessBars.map((heightPct, i) => (
          <motion.div
            key={i}
            className="w-5 rounded-sm"
            style={{
              height: `${heightPct}%`,
              background: '#4F6EF7',
              transformOrigin: 'bottom',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              delay: 0.3 + i * 0.05,
              type: 'spring',
              stiffness: 280,
              damping: 22,
            }}
          />
        ))}
      </div>
    </div>
  );
}
