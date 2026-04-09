'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentDrills } from '@/lib/drillBank';
import { getUser, getCurrentDay, getCurrentReadinessScore } from '@/lib/storage';
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
      <motion.div
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="p-[1px] rounded-full"
        style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)' }}
      >
        <div className="rounded-full px-3 py-1 flex items-center gap-1.5" style={{ background: '#080F1E' }}>
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: '#4F6EF7' }}
          />
          <span className="font-body font-medium tracking-wide" style={{ fontSize: 11, color: '#7B96FF' }}>
            New read
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
}

/* ─── Today tab ─────────────────────────────────────────────────── */
function TodayView({ onStartRapidFire }: { onStartRapidFire: () => void }) {
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

      {/* Drill journey */}
      <div className="flex flex-col">
        {drills.map((drill, i) => (
          <div key={drill.id}>
            <DrillCard drill={drill} index={i} />
            {i < drills.length - 1 && (
              <div style={{ paddingLeft: 31, paddingTop: 2, paddingBottom: 2 }}>
                <div className="flex flex-col gap-[4px]" style={{ width: 2 }}>
                  <div className="rounded-full" style={{ width: 2, height: 2, background: 'rgba(255,255,255,0.18)' }} />
                  <div className="rounded-full" style={{ width: 2, height: 2, background: 'rgba(255,255,255,0.11)' }} />
                  <div className="rounded-full" style={{ width: 2, height: 2, background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
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
  const drills = getCurrentDrills();

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>

      <AnimatePresence mode="wait">
        {activeTab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <TodayView onStartRapidFire={() => setRapidFireOpen(true)} />
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
      {activeTab === 'today' && <StackCTA drills={drills} />}
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
