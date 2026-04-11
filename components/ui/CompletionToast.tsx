'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompletionToastProps {
  drillNumber: number;
  totalDrills: number;
  onDismiss: () => void;
  onSeeCard?: () => void;
}

const MESSAGES: Record<number, string> = {
  1: '1 of 3 done. Keep the momentum.',
  2: '2 of 3. One left.',
  3: 'Stack complete. See your card →',
};

export default function CompletionToast({ drillNumber, totalDrills, onDismiss, onSeeCard }: CompletionToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isComplete = drillNumber >= totalDrills;
  const message = MESSAGES[drillNumber] ?? `${drillNumber} of ${totalDrills} done.`;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      className="fixed left-0 right-0 z-50 shell-fixed"
      style={{ top: 60, paddingLeft: 20, paddingRight: 20 }}
      onClick={isComplete ? onSeeCard : onDismiss}
    >
      <div
        className="flex items-center gap-3 cursor-pointer"
        style={{
          background: '#1A1A1A',
          borderRadius: 14,
          padding: '12px 16px',
        }}
      >
        {/* Pulsing amber dot */}
        <span className="relative flex shrink-0" style={{ width: 7, height: 7 }}>
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: 'var(--amber)' }}
          />
          <span className="relative inline-flex rounded-full h-full w-full" style={{ background: 'var(--amber)' }} />
        </span>

        <div className="flex flex-col">
          <span className="font-body uppercase" style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 500, letterSpacing: '0.07em' }}>
            Drill complete
          </span>
          <span className="font-body" style={{ fontSize: 12, color: '#fff', fontWeight: 500, marginTop: 1 }}>
            {message}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
