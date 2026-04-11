'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Drill } from '@/lib/mockData';
import type { VoiceFeedback } from './DrillScreen';
import ShareCard from './ShareCard';
import { getUser } from '@/lib/storage';

interface KeywordResultProps {
  drill: Drill;
  keywords: string[];
  voiceFeedback: VoiceFeedback | null;
  onDone: () => void;
  onRepeat: () => void;
  ctaLabel?: string;
}

interface IdealAnswer {
  opening: string;
  keyPoints: string[];
  avoid: string;
}

export default function KeywordResult({ drill, keywords, voiceFeedback, onDone, onRepeat, ctaLabel = 'Continue' }: KeywordResultProps) {
  const user = getUser();
  const score = voiceFeedback?.score ?? null;

  let scoreColor = 'var(--blue)';
  if (score !== null) {
    scoreColor = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)';
  }

  const [idealAnswer, setIdealAnswer] = useState<IdealAnswer | null>(null);
  const [loadingIdeal, setLoadingIdeal] = useState(false);

  async function fetchIdealAnswer() {
    if (idealAnswer || loadingIdeal) return;
    setLoadingIdeal(true);
    try {
      const res = await fetch('/api/ideal-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillName: drill.name, drillType: drill.type }),
      });
      const data = await res.json();
      setIdealAnswer(data);
    } catch {
      setIdealAnswer({
        opening: 'Start by naming the core tension, then walk your reasoning.',
        keyPoints: ['Ground in a real user need.', 'Show your decision-making process.', 'Close with a signal of impact.'],
        avoid: 'Generic framework answers without connecting to this specific scenario.',
      });
    } finally {
      setLoadingIdeal(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 pb-32"
    >
      {/* Drill label */}
      <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
        {drill.type} · complete
      </p>

      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-3xl p-5"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold" style={{ fontSize: 18, color: 'var(--text)' }}>
            Here's how you did.
          </h2>
          {score !== null && (
            <span className="font-display font-bold" style={{ fontSize: 32, color: scoreColor, lineHeight: 1 }}>
              {score}
            </span>
          )}
        </div>

        {/* Coaching line */}
        {voiceFeedback?.coachingLine && (
          <p className="font-display font-semibold" style={{ fontSize: 13, color: 'var(--blue-text)', lineHeight: 1.5, marginBottom: 12 }}>
            "{voiceFeedback.coachingLine}"
          </p>
        )}

        {/* Feedback bullets */}
        {voiceFeedback && voiceFeedback.feedback.length > 0 && (
          <div className="flex flex-col gap-2">
            {voiceFeedback.feedback.map((fb, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-2.5"
              >
                <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: scoreColor }} />
                <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{fb}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="font-body uppercase tracking-widest mb-2.5" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
            Keywords in your answer
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((word, i) => (
              <span
                key={i}
                className="font-display font-semibold rounded-full px-3 py-1"
                style={{ fontSize: 12, color: 'var(--blue-text)', background: 'var(--blue-bg)', border: '1px solid rgba(59,110,248,0.2)' }}
              >
                {word}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Ideal answer reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <AnimatePresence mode="wait">
          {!idealAnswer && (
            <motion.button
              key="trigger"
              whileTap={{ scale: 0.97 }}
              onClick={fetchIdealAnswer}
              disabled={loadingIdeal}
              className="w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{
                background: '#1A1A1A',
                opacity: loadingIdeal ? 0.7 : 1,
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="var(--amber)" strokeWidth="1.3" />
                  <path d="M7 4v3.5l2 1.5" stroke="var(--amber)" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="font-display font-semibold" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                  {loadingIdeal ? 'Generating ideal answer…' : 'What does a great answer look like?'}
                </span>
              </div>
              {!loadingIdeal && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.button>
          )}

          {idealAnswer && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#1A1A1A' }}
            >
              <div className="px-4 pt-4 pb-1">
                <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.1em' }}>
                  Ideal answer
                </p>
                <p className="font-display font-semibold mb-3" style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.55 }}>
                  "{idealAnswer.opening}"
                </p>
                <div className="flex flex-col gap-2.5 mb-3">
                  {idealAnswer.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span
                        className="font-display font-bold shrink-0 flex items-center justify-center rounded-md"
                        style={{ width: 18, height: 18, fontSize: 9, background: 'rgba(255,92,53,0.2)', color: 'var(--accent)', marginTop: 1 }}
                      >
                        {i + 1}
                      </span>
                      <p className="font-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{pt}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-4 mb-4 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)' }}>
                <p className="font-body uppercase tracking-widest mb-1" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: '0.08em' }}>Common mistake</p>
                <p className="font-body" style={{ fontSize: 12, color: 'rgba(255,150,150,0.8)', lineHeight: 1.55 }}>{idealAnswer.avoid}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Share card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
          Share your score
        </p>
        <ShareCard
          drill={drill}
          keywords={keywords}
          score={score ?? 60}
          userName={user?.name ?? 'You'}
          rank="Contender"
        />
      </motion.div>

      {/* Fixed bottom CTAs */}
      <div className="fixed left-0 right-0 px-4 z-50 shell-fixed" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-[390px] mx-auto flex flex-col gap-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{ height: 52, background: 'var(--accent)', borderRadius: 14, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(255,92,53,0.3)' }}
          >
            {ctaLabel}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRepeat}
            className="w-full font-display cursor-pointer"
            style={{ height: 44, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}
          >
            Re-practice this drill
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
