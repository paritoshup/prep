'use client';

import { motion } from 'framer-motion';
import { userProfile } from '@/lib/mockData';

const MILESTONES = [
  { day: 7,  label: 'Warming Up',        description: 'First week done. Your patterns are forming.' },
  { day: 14, label: 'Building Momentum', description: 'Halfway. Your answers are getting sharper.' },
  { day: 30, label: 'Interview Ready',   description: 'Full stack. You speak the language fluently.' },
];

export default function ProgressTab() {
  const isDay1 = userProfile.day <= 1;

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-40">

      {/* Hero */}
      <div>
        <p className="font-body" style={{ fontSize: 12, color: '#7A8BAD', marginBottom: 4 }}>
          Your journey
        </p>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#F0F4FF', lineHeight: 1.2 }}>
          Day {userProfile.day} of {userProfile.totalDays}
        </h1>
        <p className="font-body mt-1" style={{ fontSize: 13, color: '#7A8BAD' }}>
          {isDay1
            ? 'Complete your first drill to start tracking your score.'
            : `${userProfile.totalDays - userProfile.day} days left. Keep showing up.`}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-body" style={{ fontSize: 11, color: '#7A8BAD' }}>Day 1</span>
          <span className="font-body" style={{ fontSize: 11, color: '#7A8BAD' }}>Day {userProfile.totalDays}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4F6EF7, #6B84FF)' }}
            initial={{ width: 0 }}
            animate={{ width: `${userProfile.dayProgress}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Readiness chart area */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(15,32,64,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-body" style={{ fontSize: 11, color: '#7A8BAD', marginBottom: 4 }}>Readiness Score</p>
            {isDay1 ? (
              <p className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
                —
              </p>
            ) : (
              <p className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
                {userProfile.readinessScore}
                <span style={{ fontSize: 14, color: '#7A8BAD', fontWeight: 400 }}>/100</span>
              </p>
            )}
          </div>
          {!isDay1 && (
            <span
              className="font-body rounded-full px-2.5 py-1"
              style={{ fontSize: 10, color: '#4ADE80', background: 'rgba(34,197,94,0.1)' }}
            >
              +12 this week
            </span>
          )}
        </div>

        {/* Chart placeholder / empty state */}
        {isDay1 ? (
          <div
            className="rounded-xl flex flex-col items-center justify-center py-8 gap-2"
            style={{
              border: '1.5px dashed rgba(79,110,247,0.25)',
              background: 'rgba(79,110,247,0.04)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="font-body text-center" style={{ fontSize: 12, color: '#4F6EF7', opacity: 0.7 }}>
              Your score graph starts after<br />your first drill
            </p>
          </div>
        ) : (
          /* Mini bar chart with mock history */
          <div className="flex items-end gap-1.5 h-16">
            {[28, 35, 42, 50, 55, 60, 68, 74, 72, 74, 74].map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: i === 10 ? '#4F6EF7' : 'rgba(79,110,247,0.3)', transformOrigin: 'bottom' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                custom={v / 100}
              >
                <div style={{ height: `${v}%`, background: 'inherit', borderRadius: 3 }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Milestone journey */}
      <div>
        <p
          className="font-body uppercase tracking-widest mb-3"
          style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}
        >
          Milestones
        </p>
        <div className="flex flex-col gap-3 relative">
          {/* Vertical line */}
          <div
            className="absolute left-[15px] top-4 bottom-4 w-px"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />

          {MILESTONES.map((m, i) => {
            const reached = userProfile.day >= m.day;
            return (
              <motion.div
                key={m.day}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 pl-1"
              >
                {/* Dot */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    background: reached ? 'rgba(79,110,247,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${reached ? '#4F6EF7' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {reached ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="#4F6EF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="font-display font-bold" style={{ fontSize: 9, color: '#7A8BAD' }}>{m.day}</span>
                  )}
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-display font-bold" style={{ fontSize: 13, color: reached ? '#F0F4FF' : '#7A8BAD' }}>
                      {m.label}
                    </p>
                    {!reached && (
                      <span className="font-body" style={{ fontSize: 10, color: '#4A5A7A' }}>
                        Day {m.day}
                      </span>
                    )}
                  </div>
                  <p className="font-body" style={{ fontSize: 12, color: '#7A8BAD', lineHeight: 1.5 }}>
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
          style={{
            background: 'linear-gradient(135deg, rgba(79,110,247,0.12) 0%, rgba(15,32,64,0.8) 100%)',
            border: '1px solid rgba(79,110,247,0.2)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B96FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <p className="font-body" style={{ fontSize: 13, color: '#B8C8E8', flex: 1 }}>
            Complete today's stack to unlock your first score.
          </p>
        </div>
      )}
    </div>
  );
}
