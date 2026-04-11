'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from '@/components/ui/BottomSheet';
import { getCurrentSignal, type DailySignal } from '@/lib/dailySignal';

interface LiveSignal {
  source: string;
  headline: string;
  tag: string;
  link?: string;
  gist?: string;
  summary: string;
}

interface DailySignalCardProps {
  open: boolean;
  onClose: () => void;
}

const SIGNAL_CACHE_KEY = 'prep_signal_cache';
const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;

function loadCachedSignal(): { signal: LiveSignal; fetchedAt: number } | null {
  try { const raw = localStorage.getItem(SIGNAL_CACHE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function cacheSignal(signal: LiveSignal) {
  try { localStorage.setItem(SIGNAL_CACHE_KEY, JSON.stringify({ signal, fetchedAt: Date.now() })); } catch { /* quota */ }
}
function scheduleSignalNotification() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    reg.active?.postMessage({ type: 'SCHEDULE_SIGNAL_NOTIFICATION', delayMs: REFRESH_INTERVAL_MS });
  });
}

export default function DailySignalCard({ open, onClose }: DailySignalCardProps) {
  const [signal, setSignal] = useState<LiveSignal | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = loadCachedSignal();
    if (cached && Date.now() - cached.fetchedAt < REFRESH_INTERVAL_MS) {
      if (!cancelled) setSignal(cached.signal);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/signal');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) { setSignal(data.item); cacheSignal(data.item); scheduleSignalNotification(); }
      } catch {
        if (!cancelled) {
          const fallback = cached?.signal ?? (getCurrentSignal() as LiveSignal);
          setSignal(fallback);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Open sheet when parent triggers open prop
  useEffect(() => { if (open) setSheetOpen(true); }, [open]);

  const display = signal ?? (getCurrentSignal() as LiveSignal);

  return (
    <>
      {/* Compact dark signal tile */}
      <motion.div
        onClick={() => setSheetOpen(true)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="cursor-pointer relative overflow-hidden"
        style={{
          background: '#1A1A1A',
          borderRadius: 14,
          padding: '13px 14px',
        }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Shimmer sweep */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '60%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.045) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
          animate={{ x: ['-100%', '280%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 3.5 }}
        />

        <div className="flex items-center gap-3 relative">
          {/* Pulsing ambient dot */}
          <div className="relative shrink-0 flex items-center justify-center" style={{ width: 10, height: 10 }}>
            <motion.div
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--amber)',
              }}
              animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              style={{
                position: 'absolute',
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'var(--amber)',
                opacity: 0,
              }}
              animate={{ opacity: [0, 0.18, 0], scale: [0.5, 1.4, 1.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>

          {/* Label + headline */}
          <div className="flex-1 min-w-0 flex items-baseline gap-2 overflow-hidden">
            <span
              className="font-body shrink-0"
              style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}
            >
              Daily Read
            </span>
            {signal ? (
              <span
                className="font-body truncate"
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}
              >
                {display.headline}
              </span>
            ) : (
              <motion.div
                className="rounded"
                style={{ height: 12, width: 140, background: 'rgba(255,255,255,0.08)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </div>

          {/* Chevron */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <path d="M5 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>

      {/* Full bottom sheet */}
      <BottomSheet open={sheetOpen} onClose={() => { setSheetOpen(false); onClose(); }}>
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--blue)' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--blue)' }} />
              </span>
              <span className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                {signal ? display.source : 'Loading…'}
              </span>
            </div>
            {signal && (
              <span className="font-body rounded-full px-2.5 py-1" style={{ fontSize: 10, color: 'var(--blue-text)', background: 'var(--blue-bg)' }}>
                {display.tag}
              </span>
            )}
          </div>

          {!signal ? (
            <div className="space-y-3">
              {[90, 70, 50].map((w, i) => (
                <div key={i} className="h-4 rounded-full animate-pulse" style={{ background: 'var(--surface2)', width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <>
              <h2 className="font-display leading-snug" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                {display.headline}
              </h2>

              {display.gist && (
                <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--blue-bg)', border: '1px solid rgba(59,110,248,0.15)' }}>
                  <p className="font-body uppercase tracking-widest mb-1.5" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>The gist</p>
                  <p className="font-display font-semibold" style={{ fontSize: 14, color: 'var(--blue-text)', lineHeight: 1.55 }}>{display.gist}</p>
                </div>
              )}

              <div>
                <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                  Why this matters for your career
                </p>
                <p className="font-body leading-relaxed" style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
                  {display.summary}
                </p>
              </div>

              {display.link && (
                <a href={display.link} target="_blank" rel="noopener noreferrer" className="font-body flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--blue)' }}>
                  Read the full article
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="var(--blue)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}

              <div className="rounded-2xl p-4" style={{ background: 'var(--amber-bg)', border: '1px solid rgba(245,166,35,0.2)' }}>
                <p className="font-body uppercase tracking-widest mb-2" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>Interview angle</p>
                <p className="font-body" style={{ fontSize: 13, color: 'var(--amber-text)', lineHeight: 1.6 }}>
                  Be ready to connect this to a design decision. How would you apply this if you were designing a product today?
                </p>
              </div>
            </>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
