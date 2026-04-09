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

const ASSESSMENT_RULES: Record<string, { label: string; color: string }> = {
  user:       { label: 'User-centred',    color: '#4ADE80' },
  users:      { label: 'User-centred',    color: '#4ADE80' },
  problem:    { label: 'Problem-first',   color: '#4ADE80' },
  research:   { label: 'Research-driven', color: '#4ADE80' },
  data:       { label: 'Data-aware',      color: '#7B96FF' },
  metric:     { label: 'Metrics-minded',  color: '#7B96FF' },
  metrics:    { label: 'Metrics-minded',  color: '#7B96FF' },
  tradeoff:   { label: 'Trade-off thinking', color: '#7B96FF' },
  iterate:    { label: 'Iterative mindset',  color: '#7B96FF' },
  constraint: { label: 'Constraint-aware',   color: '#F6B84B' },
  stakeholder:{ label: 'Stakeholder-aware',  color: '#F6B84B' },
  ai:         { label: 'AI-fluent',       color: '#C084FC' },
  design:     { label: 'Design-focused',  color: '#7B96FF' },
  feedback:   { label: 'Feedback-oriented', color: '#4ADE80' },
  impact:     { label: 'Impact-driven',   color: '#4ADE80' },
  clarity:    { label: 'Clear communicator', color: '#4ADE80' },
};

function getSignal(word: string) {
  return ASSESSMENT_RULES[word.toLowerCase().replace(/[^a-z]/g, '')] ?? null;
}

export default function KeywordResult({ drill, keywords, voiceFeedback, onDone, ctaLabel = 'Continue' }: KeywordResultProps) {
  const user = getUser();
  const signals = keywords.map(w => ({ word: w, signal: getSignal(w) })).filter(s => s.signal);
  const hasSignals = signals.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-5 pb-32">

      {/* Header */}
      <div>
        <p className="font-body uppercase tracking-widest mb-1" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Drill complete · {drill.type}
        </p>
        <h2 className="font-display leading-snug" style={{ fontSize: 20, fontWeight: 700, color: '#F0F4FF' }}>
          Here's what you said.
        </h2>
      </div>

      {/* Voice feedback */}
      {voiceFeedback && (
        <div className="flex flex-col gap-2">
          <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            Voice analysis
          </p>
          {voiceFeedback.feedback.map((fb, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl px-3 py-2.5 flex items-start gap-2.5"
              style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
                <circle cx="7" cy="7" r="6.25" stroke="#4F6EF7" strokeWidth="1.2" />
                <line x1="7" y1="4.5" x2="7" y2="7.5" stroke="#4F6EF7" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="9.5" r="0.6" fill="#4F6EF7" />
              </svg>
              <p className="font-body" style={{ fontSize: 12, color: '#B8C8E8', lineHeight: 1.55 }}>{fb}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Keywords */}
      {keywords.length > 0 ? (
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.1) 0%, rgba(15,32,64,0.8) 100%)', border: '1px solid rgba(79,110,247,0.2)' }}>
          <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            Keywords detected
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="font-display font-semibold rounded-full px-3 py-1.5"
                style={{ fontSize: 13, color: '#F0F4FF', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-4" style={{ background: 'rgba(15,32,64,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-body" style={{ fontSize: 13, color: '#7A8BAD' }}>
            No keywords detected. Make sure your mic is on and speak clearly next time.
          </p>
        </div>
      )}

      {/* Signals */}
      {hasSignals && (
        <div>
          <p className="font-body uppercase tracking-widest mb-2" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            Signals we picked up
          </p>
          <div className="flex flex-col gap-2">
            {signals.slice(0, 3).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(15,32,64,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.signal!.color }} />
                <span className="font-body" style={{ fontSize: 12, color: '#B8C8E8' }}>
                  <strong style={{ color: s.signal!.color }}>{s.word}</strong> → {s.signal!.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Share card */}
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Share your score
        </p>
        <ShareCard
          drill={drill}
          keywords={keywords}
          userName={user?.name ?? 'You'}
          rank="Contender"
        />
      </div>

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
