'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userProfile } from '@/lib/mockData';
import { getCurrentDrills } from '@/lib/drillBank';
import RankBadge from '@/components/ui/RankBadge';
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

/* ─── Today tab ─────────────────────────────────────────────────── */
function TodayView({ onStartRapidFire }: { onStartRapidFire: () => void }) {
  const greeting = getGreeting();
  const drills = getCurrentDrills();

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
            {userProfile.name}
          </h1>
        </div>
        <RankBadge rank={userProfile.rank} />
      </header>

      {/* Interview countdown */}
      <InterviewCountdown />

      {/* Day counter */}
      <DayCounter
        day={userProfile.day}
        totalDays={userProfile.totalDays}
        progress={userProfile.dayProgress}
      />

      {/* Daily Signal */}
      <DailySignalCard />

      {/* Readiness card */}
      <ReadinessCard score={userProfile.readinessScore} />

      {/* Today's Stack */}
      <div className="flex items-center justify-between">
        <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#F0F4FF' }}>
          Today's Stack
        </h2>
        <span
          className="font-body text-xs rounded-full px-2.5 py-1"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8BAD' }}
        >
          ~5 min
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {drills.map((drill, i) => (
          <DrillCard key={drill.id} drill={drill} index={i} />
        ))}
      </div>

      {/* Rapid Fire */}
      <RapidFireSection onStart={onStartRapidFire} />

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
          <motion.div
            key="today"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TodayView onStartRapidFire={() => setRapidFireOpen(true)} />
          </motion.div>
        )}
        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressTab />
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
