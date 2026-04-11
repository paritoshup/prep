'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    headline: 'Most people cram.\nYou\'ll train.',
    sub: 'Daily reps beat last-minute cramming. Every time.',
    glow: 'radial-gradient(ellipse 70% 50% at 20% 80%, rgba(79,110,247,0.18) 0%, transparent 70%)',
  },
  {
    headline: '3 drills a day,\nscored by AI.',
    sub: 'Speak your answer. Get scored on the spot.',
    glow: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(99,102,241,0.16) 0%, transparent 70%)',
  },
  {
    headline: 'Your interview is\na performance.\nThis is the practice.',
    sub: 'Build the habit. Show up ready.',
    glow: 'radial-gradient(ellipse 70% 55% at 50% 90%, rgba(124,58,237,0.14) 0%, transparent 70%)',
    cta: true,
  },
];

interface IntroSlidesProps {
  onComplete: () => void;
}

export default function IntroSlides({ onComplete }: IntroSlidesProps) {
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const slide = SLIDES[index];

  useEffect(() => {
    setShowHint(false);
    const t = setTimeout(() => setShowHint(true), 900);
    return () => clearTimeout(t);
  }, [index]);

  function advance() {
    if (index < SLIDES.length - 1) {
      setIndex(i => i + 1);
    }
  }

  function finish() {
    localStorage.setItem('prep_intro_seen', 'true');
    onComplete();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col shell-fixed"
      style={{ background: 'linear-gradient(160deg, #080F1E 0%, #0A1628 50%, #0D1E3A 100%)' }}
      onClick={slide.cta ? undefined : advance}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: slide.glow, transition: 'background 0.6s ease' }} />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 pt-14 pb-0">
        {/* Wordmark */}
        <span className="font-display font-bold" style={{ fontSize: 15, color: '#4F6EF7', letterSpacing: '0.02em' }}>
          prep
        </span>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === index ? 20 : 6,
                background: i <= index ? '#4F6EF7' : 'rgba(255,255,255,0.15)',
              }}
              className="h-1.5 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Skip */}
        <button
          onClick={e => { e.stopPropagation(); finish(); }}
          className="font-body cursor-pointer"
          style={{ fontSize: 13, color: 'rgba(122,139,173,0.6)' }}
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="relative flex-1 flex flex-col justify-end px-6 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col"
          >
            {/* Headline */}
            <h1
              className="font-display whitespace-pre-line mb-4"
              style={{ fontSize: 34, fontWeight: 800, color: '#F0F4FF', lineHeight: 1.2, letterSpacing: '-0.01em' }}
            >
              {slide.headline}
            </h1>

            {/* Subline */}
            <p className="font-body mb-10" style={{ fontSize: 15, color: '#7A8BAD', lineHeight: 1.6 }}>
              {slide.sub}
            </p>

            {/* CTA on last slide */}
            {slide.cta ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={e => { e.stopPropagation(); finish(); }}
                className="w-full font-display font-bold text-white cursor-pointer"
                style={{
                  height: 54,
                  background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)',
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: '0 4px 32px rgba(79,110,247,0.4)',
                }}
              >
                Get started →
              </motion.button>
            ) : (
              /* Tap hint */
              <AnimatePresence>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-center"
                    style={{ fontSize: 12, color: 'rgba(122,139,173,0.45)' }}
                  >
                    Tap to continue
                  </motion.p>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
