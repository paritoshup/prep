'use client';

import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';
import type { VoiceFeedback } from './DrillScreen';
import ShareCard from './ShareCard';
import { getUser } from '@/lib/storage';

interface KeywordResultProps {
  drill: Drill;
  keywords: string[];
  voiceFeedback: VoiceFeedback | null;
  onDone: () => void;
  ctaLabel?: string;
}

export default function KeywordResult({ drill, keywords, voiceFeedback, onDone, ctaLabel = 'Continue' }: KeywordResultProps) {
  const user = getUser();
  const score = voiceFeedback?.score ?? null;
  const scoreColor = score === null ? '#7B96FF' : score >= 80 ? '#4ADE80' : score >= 60 ? '#F6B84B' : '#FB7185';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 pb-32"
    >
      {/* Drill label */}
      <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
        {drill.type} · complete
      </p>

      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(15,32,64,0.95) 0%, rgba(10,22,40,0.98) 100%)',
          border: `1px solid ${scoreColor}30`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold" style={{ fontSize: 18, color: '#F0F4FF' }}>
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
          <p className="font-display font-semibold" style={{ fontSize: 13, color: '#7B96FF', lineHeight: 1.5, marginBottom: 12 }}>
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
                <p className="font-body" style={{ fontSize: 12, color: '#B8C8E8', lineHeight: 1.6 }}>{fb}</p>
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
          style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="font-body uppercase tracking-widest mb-2.5" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            Keywords in your answer
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((word, i) => (
              <span
                key={i}
                className="font-display font-semibold rounded-full px-3 py-1"
                style={{ fontSize: 12, color: '#F0F4FF', background: 'rgba(79,110,247,0.12)', border: '1px solid rgba(79,110,247,0.2)' }}
              >
                {word}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Share card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
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

      {/* Fixed bottom CTA */}
      <div className="fixed left-0 right-0 px-4 z-50" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-[390px] mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{ height: 52, background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)', borderRadius: 100, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(79,110,247,0.35)' }}
          >
            {ctaLabel}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
