'use client';

import { motion } from 'framer-motion';

interface DayCounterProps {
  day: number;
  totalDays: number;
  progress: number; // 0–100
}

export default function DayCounter({ day, totalDays, progress }: DayCounterProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Progress bar track */}
      <div
        className="flex-1 h-1.5 rounded-full relative overflow-hidden"
        style={{ background: '#252530' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: '#4F6EF7' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Label */}
      <span className="font-body text-xs whitespace-nowrap shrink-0" style={{ color: '#7A8BAD' }}>
        Day {day} of {totalDays}
      </span>
    </div>
  );
}
