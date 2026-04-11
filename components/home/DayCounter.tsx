'use client';

import { motion } from 'framer-motion';

interface DayCounterProps {
  day: number;
  totalDays: number;
  progress: number;
}

export default function DayCounter({ day, totalDays, progress }: DayCounterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full relative overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="font-body whitespace-nowrap shrink-0" style={{ fontSize: 11, color: 'var(--muted)' }}>
        Day {day} of {totalDays}
      </span>
    </div>
  );
}
