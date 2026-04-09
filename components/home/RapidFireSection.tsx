'use client';

import { motion } from 'framer-motion';

const CATEGORY_COLORS: Record<string, string> = {
  Design:  '#F6B84B',
  AI:      '#4ADE80',
  Product: '#7B96FF',
  Process: '#C084FC',
};

function getHoursUntilRefresh(): number {
  const INTERVAL_MS = 4 * 60 * 60 * 1000;
  const now = Date.now();
  const next = (Math.floor(now / INTERVAL_MS) + 1) * INTERVAL_MS;
  return Math.ceil((next - now) / (60 * 60 * 1000));
}

export default function RapidFireSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#F0F4FF' }}>
          Rapid Fire
        </h2>
        <span className="font-body text-xs rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8BAD' }}>
          Refreshes in {getHoursUntilRefresh()}h
        </span>
      </div>

      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="rounded-2xl p-5 cursor-pointer flex flex-col gap-3"
        style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          {(['Design', 'AI', 'Product', 'Process'] as const).map(cat => (
            <span
              key={cat}
              className="font-body rounded-full px-2 py-0.5"
              style={{ fontSize: 10, color: CATEGORY_COLORS[cat], background: `${CATEGORY_COLORS[cat]}18` }}
            >
              {cat}
            </span>
          ))}
        </div>
        <p className="font-display" style={{ fontSize: 15, fontWeight: 600, color: '#F0F4FF' }}>
          7 questions. Tap the right answer.
        </p>
        <p className="font-body" style={{ fontSize: 12, color: '#7A8BAD' }}>
          Tests your design, AI, and product knowledge. New set every 4 hours.
        </p>
        <p style={{ fontSize: 13, color: '#4F6EF7' }} className="font-body">
          Start →
        </p>
      </motion.div>
    </div>
  );
}
