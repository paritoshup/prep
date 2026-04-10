'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentDrills } from '@/lib/drillBank';
import { getUser, getCurrentDay, getCurrentReadinessScore, getTodayRecord } from '@/lib/storage';
import BottomNav, { type AppTab } from '@/components/ui/BottomNav';
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

/* ─── New Read badge ────────────────────────────────────────────── */
function NewReadBadge({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="cursor-pointer shrink-0"
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="p-[1px] rounded-full"
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}
      >
        <div
          className="rounded-full px-3 py-1 flex items-center gap-1.5 relative overflow-hidden"
          style={{ background: 'rgba(249,115,22,0.18)' }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)' }}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />
          <motion.svg
            width="11" height="11" viewBox="0 0 24 24" fill="#fff"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </motion.svg>
          <span className="font-body font-medium tracking-wide" style={{ fontSize: 11, color: '#fff' }}>
            New read
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Today tab ─────────────────────────────────────────────────── */
function TodayView({ onStartRapidFire, completedDrillIds }: { onStartRapidFire: () => void; completedDrillIds: number[] }) {
  const greeting = getGreeting();
  const drills = getCurrentDrills();
  const user = getUser();
  const currentDay = getCurrentDay();
  const totalDays = 30;
  const progress = Math.min(100, Math.round((currentDay / totalDays) * 100));
  const [signalOpen, setSignalOpen] = useState(false);

  return (
    <main className="max-w-[390px] mx-auto w-full px-4 pt-14 pb-40 flex flex-col gap-5">

      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="font-body text-sm leading-none mb-1" style={{ color: '#7A8BAD' }}>
            {greeting}
          </p>
          <h1
            className="font-display leading-tight"
            style={{ fontSize: 20, fontWeight: 700, color: '#F0F4FF' }}
          >
            {user?.name ?? 'You'}
          </h1>
        </div>
        <NewReadBadge onClick={() => setSignalOpen(true)} />
      </header>

      {/* Interview countdown */}
      <InterviewCountdown />

      {/* Day counter */}
      <DayCounter
        day={currentDay}
        totalDays={totalDays}
        progress={progress}
      />

      {/* Readiness card */}
      <ReadinessCard score={getCurrentReadinessScore()} />

      {/* Today's Stack */}
      <div className="flex items-center justify-between">
        <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#F0F4FF' }}>
          Today's Drills
        </h2>
        <span
          className="font-body text-xs rounded-full px-2.5 py-1"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8BAD' }}
        >
          ~5 min
        </span>
      </div>

      {/* Drill steps */}
      <div
        className="flex flex-col rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(79,110,247,0.22)', background: 'rgba(15,32,64,0.5)' }}
      >
        {drills.map((drill, i) => (
          <div key={drill.id}>
            <DrillCard drill={drill} index={i} unified completed={completedDrillIds.includes(drill.id)} />
            {i < drills.length - 1 && (
              <div style={{ marginLeft: 16, marginRight: 16, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Rapid Fire */}
      <RapidFireSection onStart={onStartRapidFire} />

      {/* Daily Signal sheet (no inline card) */}
      <DailySignalCard open={signalOpen} onClose={() => setSignalOpen(false)} />

    </main>
  );
}

/* ─── Root component ─────────────────────────────────────────────── */
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [rapidFireOpen, setRapidFireOpen] = useState(false);
  const [completedDrillIds, setCompletedDrillIds] = useState<number[]>(() =>
    getTodayRecord().sessions.map(s => s.drillId)
  );
  const drills = getCurrentDrills();

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>

      <AnimatePresence mode="wait">
        {activeTab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <TodayView onStartRapidFire={() => setRapidFireOpen(true)} completedDrillIds={completedDrillIds} />
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

      {/* Fixed bottom: CTA (today only) + Nav */}
      {activeTab === 'today' && <StackCTA drills={drills} onDrillComplete={id => setCompletedDrillIds(prev => [...prev, id])} />}
      <BottomNav active={activeTab} onChange={setActiveTab} />

      {/* Rapid Fire full-screen overlay */}
      <AnimatePresence>
        {rapidFireOpen && (
          <RapidFireScreen onClose={() => setRapidFireOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
