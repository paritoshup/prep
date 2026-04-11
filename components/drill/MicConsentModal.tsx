'use client';

import { motion } from 'framer-motion';

interface MicConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function MicConsentModal({ onAccept, onDecline }: MicConsentModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 shell-fixed"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-[390px] rounded-3xl p-6"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Mic icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'var(--blue-bg)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </div>

        <h2
          className="font-display mb-2"
          style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}
        >
          We'll listen during your drill
        </h2>

        <p
          className="font-body leading-relaxed mb-1"
          style={{ fontSize: 13, color: 'var(--text)' }}
        >
          To assess your answers, we'll use your microphone to detect the keywords you speak.
        </p>
        <p
          className="font-body leading-relaxed mb-5"
          style={{ fontSize: 13, color: 'var(--muted)' }}
        >
          We never store your audio — only the words. Your recordings stay on your device.
        </p>

        {/* What we capture */}
        <div
          className="rounded-2xl p-3 mb-5 flex items-start gap-3"
          style={{ background: 'var(--blue-bg)', border: '1px solid rgba(59,110,248,0.15)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="var(--blue)" strokeWidth="1.2" />
            <path d="M5.5 8l2 2 3-3" stroke="var(--blue)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-body" style={{ fontSize: 12, color: 'var(--blue-text)' }}>
            We capture <strong>keywords only</strong> — 4 to 5 words that show up in your answer — not the full audio.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            className="w-full font-display font-bold text-white cursor-pointer"
            style={{
              height: 50,
              background: 'var(--accent)',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(255,92,53,0.3)',
            }}
          >
            Allow microphone
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDecline}
            className="w-full font-body cursor-pointer"
            style={{
              height: 44,
              borderRadius: 14,
              fontSize: 14,
              color: 'var(--muted)',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
            }}
          >
            Skip for now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
