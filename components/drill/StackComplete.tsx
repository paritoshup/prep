'use client';

import { motion } from 'framer-motion';
import type { DrillSession } from '@/lib/storage';
import ShareCard from './ShareCard';
import { getUser } from '@/lib/storage';

interface StackCompleteProps {
  sessions: DrillSession[];
  onClose: () => void;
}

export default function StackComplete({ sessions, onClose }: StackCompleteProps) {
  const user = getUser();
  const userName = user?.name ?? 'You';
  const rank = 'Contender';

  const totalKeywords = sessions.flatMap(s => s.keywords);
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
    : 0;

  const allKeywords = [...new Set(totalKeywords)].slice(0, 6);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto shell-fixed"
      style={{ background: 'var(--bg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-[390px] mx-auto w-full px-5 pt-16 pb-40 flex flex-col gap-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-body uppercase tracking-widest mb-2" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
            Stack complete
          </p>
          <h1 className="font-display leading-tight" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)' }}>
            That's today's work done.
          </h1>
          <p className="font-body mt-2" style={{ fontSize: 14, color: 'var(--muted)' }}>
            {sessions.length} of 3 drills completed · {allKeywords.length} keywords detected
          </p>
        </motion.div>

        {/* Drill summaries */}
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <motion.div
              key={s.drillId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--green-bg)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3 3 6-6" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                  {s.drillType}
                </p>
                {s.keywords.length > 0 && (
                  <p className="font-body mt-0.5" style={{ fontSize: 12, color: 'var(--text)' }}>
                    {s.keywords.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>
              <span className="font-display font-bold" style={{ fontSize: 15, color: 'var(--green-text)' }}>
                {s.score}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Overall score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div>
            <p className="font-body" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Stack Score</p>
            <p className="font-display font-bold" style={{ fontSize: 36, color: 'var(--text)', lineHeight: 1 }}>
              {avgScore}<span style={{ fontSize: 16, color: 'var(--muted)' }}>/100</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-body" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Streak</p>
            <p className="font-display font-bold" style={{ fontSize: 24, color: 'var(--amber-text)' }}>
              {sessions.length > 0 ? 'Day +1' : '—'}
            </p>
          </div>
        </motion.div>

        {/* Share card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
            Share your score
          </p>
          <ShareCard
            drill={sessions[0] ? { id: sessions[0].drillId, type: sessions[0].drillType, name: '', description: '', meta: { mode: '', duration: '', color: 'accent' } } : { id: 1, type: "TODAY'S STACK", name: '', description: '', meta: { mode: '', duration: '', color: 'accent' } }}
            keywords={allKeywords}
            score={avgScore}
            userName={userName}
            rank={rank}
          />
        </motion.div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed left-0 right-0 px-5 z-50 shell-fixed"
        style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-[390px] mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{
              height: 52,
              background: 'var(--accent)',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              boxShadow: '0 4px 24px rgba(255,92,53,0.3)',
            }}
          >
            Back to Today
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
