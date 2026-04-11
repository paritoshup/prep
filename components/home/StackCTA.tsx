'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrillScreen from '@/components/drill/DrillScreen';
import StackComplete from '@/components/drill/StackComplete';
import type { Drill } from '@/lib/mockData';
import type { DrillSession } from '@/lib/storage';
import { saveDrillSession, updateStreak } from '@/lib/storage';

interface StackCTAProps {
  drills: Drill[];
  onDrillComplete?: (drillId: number) => void;
  completedCount?: number;
}

export default function StackCTA({ drills, onDrillComplete, completedCount = 0 }: StackCTAProps) {
  const [drillIndex, setDrillIndex] = useState<number | null>(null);
  const [sessions, setSessions] = useState<DrillSession[]>([]);
  const [stackDone, setStackDone] = useState(false);

  const currentDrill = drillIndex !== null ? drills[drillIndex] : null;
  const allDone = completedCount >= drills.length;

  const ctaLabel = allDone
    ? 'Stack complete. See your card →'
    : completedCount === 0
      ? 'Begin — 5 min →'
      : completedCount === 1
        ? 'Resume — 2 left →'
        : 'Resume — 1 left →';

  const ctaStyle = allDone
    ? { background: 'var(--green)', boxShadow: '0 4px 14px rgba(26,158,92,0.3)' }
    : { background: 'var(--accent)', boxShadow: '0 4px 14px rgba(255,92,53,0.3)' };

  function handleDrillComplete(keywords: string[]) {
    if (drillIndex === null || !currentDrill) return;

    const score = Math.min(100, 55 + keywords.length * 9);
    const session: DrillSession = {
      drillId: currentDrill.id,
      drillType: currentDrill.type,
      keywords,
      score,
      completedAt: new Date().toISOString(),
    };

    saveDrillSession(session);
    onDrillComplete?.(currentDrill.id);
    const updated = [...sessions, session];
    setSessions(updated);

    if (drillIndex < drills.length - 1) {
      setDrillIndex(drillIndex + 1);
    } else {
      updateStreak();
      setDrillIndex(null);
      setStackDone(true);
    }
  }

  return (
    <>
      <div
        className="fixed left-0 right-0 px-5 z-40 shell-fixed"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-[390px] mx-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={() => { if (!allDone) { setSessions([]); setDrillIndex(0); } else { setStackDone(true); } }}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{
              height: 52,
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              ...ctaStyle,
            }}
          >
            {ctaLabel}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {currentDrill && (
          <DrillScreen
            key={currentDrill.id}
            drill={currentDrill}
            drillNumber={drillIndex! + 1}
            totalDrills={drills.length}
            onComplete={handleDrillComplete}
            onClose={() => setDrillIndex(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stackDone && (
          <StackComplete
            sessions={sessions}
            onClose={() => { setSessions([]); setStackDone(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
