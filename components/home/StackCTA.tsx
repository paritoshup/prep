'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import DrillScreen from '@/components/drill/DrillScreen';
import StackComplete from '@/components/drill/StackComplete';
import type { Drill } from '@/lib/mockData';
import type { DrillSession } from '@/lib/storage';
import { saveDrillSession, updateStreak } from '@/lib/storage';

interface StackCTAProps {
  drills: Drill[];
}

export default function StackCTA({ drills }: StackCTAProps) {
  const [drillIndex, setDrillIndex] = useState<number | null>(null);
  const [sessions, setSessions] = useState<DrillSession[]>([]);
  const [stackDone, setStackDone] = useState(false);

  const currentDrill = drillIndex !== null ? drills[drillIndex] : null;

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
    const updated = [...sessions, session];
    setSessions(updated);

    if (drillIndex < drills.length - 1) {
      // Next drill
      setDrillIndex(drillIndex + 1);
    } else {
      // Stack complete
      updateStreak();
      setDrillIndex(null);
      setStackDone(true);
    }
  }

  function handleClose() {
    setDrillIndex(null);
  }

  function handleStackClose() {
    setSessions([]);
    setStackDone(false);
  }

  return (
    <>
      {/* Fixed CTA bar */}
      <div
        className="fixed left-0 right-0 px-4 z-40 shell-fixed"
        style={{ bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-[390px] mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => { setSessions([]); setDrillIndex(0); }}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{
              height: 42,
              background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 20px rgba(79,110,247,0.3)',
            }}
          >
            Start today's drill →
          </motion.button>
        </div>
      </div>

      {/* Active drill */}
      <AnimatePresence>
        {currentDrill && (
          <DrillScreen
            key={currentDrill.id}
            drill={currentDrill}
            drillNumber={drillIndex! + 1}
            totalDrills={drills.length}
            onComplete={handleDrillComplete}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Stack complete */}
      <AnimatePresence>
        {stackDone && (
          <StackComplete
            sessions={sessions}
            onClose={handleStackClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
