'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentMCQQuestions, type MCQQuestion } from '@/lib/rapidFireMCQ';

const CATEGORY_COLORS: Record<string, string> = {
  Design:  '#F6B84B',
  AI:      '#4ADE80',
  Product: '#7B96FF',
  Process: '#C084FC',
};

/* ─── Results ────────────────────────────────────────────────────── */
function ResultsScreen({
  questions,
  answers,
  onRetry,
  onClose,
}: {
  questions: MCQQuestion[];
  answers: Record<number, string>;
  onRetry: () => void;
  onClose: () => void;
}) {
  const correct = questions.filter(q => answers[q.id] === q.correct).length;
  const pct = Math.round((correct / questions.length) * 100);
  const emoji = pct >= 80 ? '🔥' : pct >= 60 ? '👌' : '📚';
  const label = pct >= 80 ? 'Sharp' : pct >= 60 ? 'Solid' : 'Keep going';
  const scoreColor = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#F6B84B' : '#FB7185';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 pb-32">
      {/* Score card */}
      <div
        className="rounded-3xl p-6 flex flex-col items-center text-center"
        style={{ background: 'rgba(15,32,64,0.8)', border: `1px solid ${scoreColor}30` }}
      >
        <span className="text-4xl mb-3">{emoji}</span>
        <p className="font-display font-bold" style={{ fontSize: 48, color: scoreColor, lineHeight: 1 }}>
          {correct}<span style={{ color: '#7A8BAD', fontSize: 24 }}>/{questions.length}</span>
        </p>
        <p className="font-body mt-2" style={{ fontSize: 14, color: '#7A8BAD' }}>
          {pct}% correct · {label}
        </p>
      </div>

      {/* Review */}
      <div className="flex flex-col gap-2">
        {questions.map(q => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;
          return (
            <div key={q.id} className="rounded-xl p-3"
              style={{ background: isCorrect ? 'rgba(34,197,94,0.07)' : 'rgba(251,113,133,0.07)', border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(251,113,133,0.2)'}` }}
            >
              <p className="font-body" style={{ fontSize: 12, color: '#F0F4FF', fontWeight: 500, marginBottom: 4 }}>{q.question}</p>
              <p className="font-body" style={{ fontSize: 11, color: isCorrect ? '#4ADE80' : '#FB7185' }}>
                {isCorrect ? '✓ Correct' : `✗ You said ${userAnswer} · Answer: ${q.correct}`}
              </p>
              {!isCorrect && (
                <p className="font-body mt-1" style={{ fontSize: 11, color: '#7A8BAD' }}>{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Retry */}
      <button onClick={onRetry} className="font-body text-sm cursor-pointer py-2 text-center" style={{ color: '#7B96FF' }}>
        Retry this set →
      </button>

      {/* Fixed CTA */}
      <div className="fixed left-0 right-0 px-4 z-50" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-[390px] mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{ height: 52, background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)', borderRadius: 100, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(79,110,247,0.35)' }}
          >
            Back to Today
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main screen ────────────────────────────────────────────────── */
export default function RapidFireScreen({ onClose }: { onClose: () => void }) {
  const questions = getCurrentMCQQuestions();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[current];

  function handleSelect(optionId: string) {
    if (selected) return;
    setSelected(optionId);
    setShowResult(true);
    setAnswers(prev => ({ ...prev, [q.id]: optionId }));
    if (navigator.vibrate) navigator.vibrate(optionId === q.correct ? 60 : [40, 30, 40]);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setDone(true);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setAnswers({});
    setDone(false);
  }

  const isCorrect = selected === q.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(160deg, #080F1E 0%, #0A1628 50%, #0D1E3A 100%)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 max-w-[390px] mx-auto w-full shrink-0">
        <div>
          <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>Rapid Fire</p>
          {!done && (
            <p className="font-body" style={{ fontSize: 11, color: '#4F6EF7' }}>
              {current + 1} of {questions.length}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="#7A8BAD" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="px-4 max-w-[390px] mx-auto w-full shrink-0 mb-3">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#4F6EF7' }}
              animate={{ width: `${((current + (selected ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 max-w-[390px] mx-auto w-full pb-40">
        <AnimatePresence mode="wait">
          {done ? (
            <ResultsScreen key="results" questions={questions} answers={answers} onRetry={handleRetry} onClose={onClose} />
          ) : (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {/* Question card */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span
                  className="font-body rounded-full px-2 py-0.5 inline-block mb-2"
                  style={{ fontSize: 10, color: CATEGORY_COLORS[q.category], background: `${CATEGORY_COLORS[q.category]}18` }}
                >
                  {q.category}
                </span>
                <p className="font-display leading-snug" style={{ fontSize: 16, fontWeight: 600, color: '#F0F4FF' }}>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.options.map(opt => {
                  const isSelected = selected === opt.id;
                  const isRight = opt.id === q.correct;
                  const showFeedback = !!selected;
                  let bg = 'rgba(15,32,64,0.5)';
                  let border = 'rgba(255,255,255,0.06)';
                  let textColor = '#B8C8E8';
                  if (showFeedback && isRight) { bg = 'rgba(34,197,94,0.1)'; border = 'rgba(34,197,94,0.4)'; textColor = '#4ADE80'; }
                  else if (showFeedback && isSelected && !isRight) { bg = 'rgba(251,113,133,0.1)'; border = 'rgba(251,113,133,0.4)'; textColor = '#FB7185'; }

                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={!selected ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(opt.id)}
                      className="w-full rounded-2xl px-4 py-3 text-left cursor-pointer flex items-center gap-3"
                      style={{ background: bg, border: `1px solid ${border}`, transition: 'all 0.2s' }}
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-display font-bold"
                        style={{ fontSize: 11, background: showFeedback && isRight ? 'rgba(34,197,94,0.2)' : showFeedback && isSelected ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.06)', color: textColor }}
                      >
                        {opt.id}
                      </span>
                      <span className="font-body" style={{ fontSize: 13, color: textColor }}>{opt.text}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation + Next */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden flex flex-col gap-2"
                  >
                    <div
                      className="rounded-xl p-3"
                      style={{ background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(251,113,133,0.08)', border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(251,113,133,0.2)'}` }}
                    >
                      <p className="font-body" style={{ fontSize: 12, color: isCorrect ? '#4ADE80' : '#FB7185', fontWeight: 600, marginBottom: 4 }}>
                        {isCorrect ? 'Correct.' : 'Not quite.'}
                      </p>
                      <p className="font-body" style={{ fontSize: 12, color: '#B8C8E8', lineHeight: 1.6 }}>{q.explanation}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="w-full font-display font-bold text-white cursor-pointer rounded-2xl"
                      style={{ height: 46, background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)', fontSize: 14, fontWeight: 700 }}
                    >
                      {current < questions.length - 1 ? 'Next question →' : 'See results →'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
