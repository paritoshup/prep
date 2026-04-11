'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentDrills } from '@/lib/drillBank';
import { getUser, getCurrentDay, getCurrentReadinessScore, getTodayRecord, loadState } from '@/lib/storage';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration';
import BottomNav, { type AppTab } from '@/components/ui/BottomNav';
import CompletionToast from '@/components/ui/CompletionToast';
import DayCounter from './DayCounter';
import ReadinessCard from './ReadinessCard';
import DrillCard from './DrillCard';
import StackCTA from './StackCTA';
import DailySignalCard from './DailySignalCard';
import RapidFireSection from './RapidFireSection';
import RapidFireScreen from './RapidFireScreen';
import InterviewCountdown from './InterviewCountdown';
import ProgressTab from '@/components/tabs/ProgressTab';
import ProfileTab from '@/components/tabs/ProfileTab';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

interface TodayViewProps {
  completedDrillIds: number[];
  onStartRapidFire: () => void;
  onDrillComplete: (id: number) => void;
}

function TodayView({ completedDrillIds, onStartRapidFire, onDrillComplete }: TodayViewProps) {
  const greeting = getGreeting();
  const drills = getCurrentDrills(getCurrentDay());
  const user = getUser();
  const currentDay = getCurrentDay();
  const totalDays = 30;
  const progress = Math.min(100, Math.round((currentDay / totalDays) * 100));

  const isAtRisk = useMemo(() => {
    const hour = new Date().getHours();
    const streak = loadState().streak;
    return hour >= 19 && completedDrillIds.length < drills.length && streak > 0;
  }, [completedDrillIds, drills]);
  return (
    <main className="max-w-[390px] mx-auto w-full px-5 pt-14 pb-44 flex flex-col gap-3">

      {/* 1. Header */}
      <header className="flex items-start justify-between mb-1">
        <div>
          <p className="font-body mb-0.5" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {greeting}
          </p>
          <h1 className="font-display leading-tight" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {user?.name ?? 'You'}
          </h1>
        </div>
      </header>

      {/* Interview countdown */}
      <InterviewCountdown />

      {/* Streak at-risk warning */}
      {isAtRisk && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'var(--red-bg)', border: '1px solid rgba(229,62,62,0.2)' }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }}
          />
          <p className="font-body" style={{ fontSize: 12, color: 'var(--red)', flex: 1, lineHeight: 1.5 }}>
            Streak at risk — finish today's drills before midnight.
          </p>
        </motion.div>
      )}

      {/* 2. Daily Read */}
      <DailySignalCard open={false} onClose={() => {}} />

      {/* 3. Score + streak row */}
      <ReadinessCard score={getCurrentReadinessScore()} />

      {/* 4. Day strip */}
      <DayCounter day={currentDay} totalDays={totalDays} progress={progress} />

      {/* 5. Today's Drills header */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Today's Drills
        </h2>
        <span
          className="font-body rounded-full px-2.5 py-1"
          style={{ fontSize: 11, background: 'var(--surface2)', color: 'var(--muted)' }}
        >
          ~5 min
        </span>
      </div>

      {/* 6. Drill cards */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {drills.map((drill, i) => (
          <div key={drill.id}>
            <DrillCard drill={drill} index={i} completed={completedDrillIds.includes(drill.id)} />
            {i < drills.length - 1 && (
              <div style={{ marginLeft: 16, marginRight: 16, height: 1, background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Rapid Fire */}
      <RapidFireSection onStart={onStartRapidFire} />
    </main>
  );
}

/* ─── Milestone confetti ─────────────────────────────────────────── */
const MILESTONES = [1, 3, 7, 15, 21, 30];
const MILESTONE_MESSAGES: Record<number, string> = {
  1:  'First day done. The habit starts now.',
  3:  "3-day streak. You're building something real.",
  7:  'One week. Interviews fear consistency.',
  15: 'Halfway there. Your answers are getting sharper.',
  21: '21 days. This is a habit now.',
  30: '30 days. You showed up every single day.',
};

/* ─── Root ───────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [rapidFireOpen, setRapidFireOpen] = useState(false);
  const [completedDrillIds, setCompletedDrillIds] = useState<number[]>(() =>
    getTodayRecord().sessions.map(s => s.drillId)
  );
  const [toast, setToast] = useState<{ drillNumber: number } | null>(null);
  const [confetti, setConfetti] = useState<{ message: string } | null>(null);
  const drills = getCurrentDrills(getCurrentDay());

  function handleDrillComplete(id: number) {
    setCompletedDrillIds(prev => {
      const updated = [...prev, id];
      setToast({ drillNumber: updated.length });

      if (updated.length === drills.length) {
        try {
          const streak = loadState().streak;
          if (MILESTONES.includes(streak)) {
            const celebrated: number[] = JSON.parse(
              localStorage.getItem('prep_celebrated') ?? '[]'
            );
            if (!celebrated.includes(streak)) {
              celebrated.push(streak);
              localStorage.setItem('prep_celebrated', JSON.stringify(celebrated));
              const msg = MILESTONE_MESSAGES[streak];
              setConfetti({ message: msg });
              setTimeout(() => setConfetti(null), 4200);
            }
          }
        } catch { /* localStorage unavailable */ }
      }

      return updated;
    });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      <AnimatePresence mode="wait">
        {activeTab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <TodayView
              completedDrillIds={completedDrillIds}
              onStartRapidFire={() => setRapidFireOpen(true)}
              onDrillComplete={handleDrillComplete}
            />
          </motion.div>
        )}
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ProgressTab />
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ProfileTab />
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'today' && (
        <StackCTA
          drills={drills}
          completedCount={completedDrillIds.length}
          onDrillComplete={handleDrillComplete}
        />
      )}
      <BottomNav active={activeTab} onChange={setActiveTab} />

      <AnimatePresence>
        {rapidFireOpen && <RapidFireScreen onClose={() => setRapidFireOpen(false)} />}
      </AnimatePresence>

      {/* Completion toast */}
      <AnimatePresence>
        {toast && (
          <CompletionToast
            drillNumber={toast.drillNumber}
            totalDrills={drills.length}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <ConfettiCelebration active={!!confetti} message={confetti?.message} />
    </div>
  );
}
