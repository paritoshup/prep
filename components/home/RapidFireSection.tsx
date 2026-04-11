'use client';

import { motion } from 'framer-motion';

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
        <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Rapid Fire
        </h2>
        <span className="font-body rounded-full px-2.5 py-1" style={{ fontSize: 11, background: 'var(--surface2)', color: 'var(--muted)' }}>
          Refreshes in {getHoursUntilRefresh()}h
        </span>
      </div>

      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="rounded-2xl p-4 cursor-pointer"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          {(['Design', 'AI', 'Product', 'Process'] as const).map((cat, i) => {
            const colors = ['var(--accent)', 'var(--green)', 'var(--blue)', 'var(--amber)'];
            const bgs    = ['var(--accent-bg)', 'var(--green-bg)', 'var(--blue-bg)', 'var(--amber-bg)'];
            return (
              <span
                key={cat}
                className="font-body rounded-full px-2 py-0.5"
                style={{ fontSize: 10, color: colors[i], background: bgs[i], fontWeight: 500 }}
              >
                {cat}
              </span>
            );
          })}
        </div>
        <p className="font-display mb-1" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          7 questions. Tap the right answer.
        </p>
        <p className="font-body mb-3" style={{ fontSize: 12, color: 'var(--muted)' }}>
          Tests your design, AI, and product knowledge. New set every 4 hours.
        </p>
        <p className="font-body" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
          Start →
        </p>
      </motion.div>
    </div>
  );
}
