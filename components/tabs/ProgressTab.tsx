'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCurrentDay, getCurrentReadinessScore, loadState } from '@/lib/storage';

const TOTAL_DAYS = 30;

const MILESTONES = [
  { day: 7,  label: 'Warming Up',        description: 'First week done. Your patterns are forming.' },
  { day: 14, label: 'Building Momentum', description: 'Halfway. Your answers are getting sharper.' },
  { day: 30, label: 'Interview Ready',   description: 'Full stack. You speak the language fluently.' },
];

export default function ProgressTab() {
  const [currentDay, setCurrentDay] = useState(1);
  const [readiness, setReadiness] = useState(0);
  const [historyScores, setHistoryScores] = useState<number[]>([]);

  useEffect(() => {
    const day = getCurrentDay();
    const score = getCurrentReadinessScore();
    const state = loadState();
    const recent = state.history
      .slice(-11)
      .map(r => r.readinessScore);
    setCurrentDay(day);
    setReadiness(score);
    setHistoryScores(recent);
  }, []);

  const isDay1 = currentDay <= 1 || historyScores.length === 0;
  const daysLeft = Math.max(0, TOTAL_DAYS - currentDay);
  const progress = Math.min(100, Math.round((currentDay / TOTAL_DAYS) * 100));

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-40">

      {/* Hero */}
      <div>
        <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
          Your journey
        </p>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
          Day {currentDay} of {TOTAL_DAYS}
        </h1>
        <p className="font-body mt-1" style={{ fontSize: 13, color: 'var(--muted)' }}>
          {isDay1
            ? 'Complete your first drill to start tracking your score.'
            : `${daysLeft} days left. Keep showing up.`}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-body" style={{ fontSize: 11, color: 'var(--muted)' }}>Day 1</span>
          <span className="font-body" style={{ fontSize: 11, color: 'var(--muted)' }}>Day {TOTAL_DAYS}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Readiness chart */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-body" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Readiness Score</p>
            {isDay1 ? (
              <p className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>—</p>
            ) : (
              <p className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
                {readiness}
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>/100</span>
              </p>
            )}
          </div>
        </div>

        {isDay1 ? (
          <div
            className="rounded-xl flex flex-col items-center justify-center py-8 gap-2"
            style={{ border: '1.5px dashed var(--border2)', background: 'var(--surface2)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--subtle)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="font-body text-center" style={{ fontSize: 12, color: 'var(--muted)' }}>
              Your score graph starts after<br />your first drill
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-16">
            {historyScores.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: i === historyScores.length - 1 ? 'var(--accent)' : 'var(--accent-bg)', transformOrigin: 'bottom' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div style={{ height: `${Math.max(8, v)}%`, background: 'inherit', borderRadius: 3 }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Milestone journey */}
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
          Milestones
        </p>
        <div className="flex flex-col gap-3 relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-px" style={{ background: 'var(--border2)' }} />
          {MILESTONES.map((m, i) => {
            const reached = currentDay >= m.day;
            return (
              <motion.div
                key={m.day}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 pl-1"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10"
                  style={{ background: reached ? 'var(--accent-bg)' : 'var(--surface2)', border: `1.5px solid ${reached ? 'var(--accent)' : 'var(--border2)'}` }}
                >
                  {reached ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="font-display font-bold" style={{ fontSize: 9, color: 'var(--muted)' }}>{m.day}</span>
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-display font-bold" style={{ fontSize: 13, color: reached ? 'var(--text)' : 'var(--muted)' }}>
                      {m.label}
                    </p>
                    {!reached && (
                      <span className="font-body" style={{ fontSize: 10, color: 'var(--subtle)' }}>Day {m.day}</span>
                    )}
                  </div>
                  <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {m.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA if day 1 */}
      {isDay1 && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'var(--accent-bg)', border: '1px solid rgba(255,92,53,0.2)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <p className="font-body" style={{ fontSize: 13, color: 'var(--accent-text)', flex: 1 }}>
            Complete today's stack to unlock your first score.
          </p>
        </div>
      )}
    </div>
  );
}
