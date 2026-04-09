'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function DailySignalCard() {
  const [open, setOpen] = useState(false);
  const [signal, setSignal] = useState<LiveSignal | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live signal on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/signal', { next: { revalidate: 28800 } } as RequestInit);
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        if (!cancelled) setSignal(data.item);
      } catch {
        // Fallback to static bank
        if (!cancelled) setSignal(getCurrentSignal() as LiveSignal);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const display = signal ?? (getCurrentSignal() as LiveSignal);

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen(true)}
        className="rounded-2xl p-4 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(79,110,247,0.12) 0%, rgba(15,32,64,0.85) 100%)',
          border: '1px solid rgba(79,110,247,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0 mt-0.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: '#4F6EF7' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4F6EF7' }} />
            </span>
            <span
              className="font-body uppercase tracking-widest"
              style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}
            >
              {loading ? 'Loading signal...' : `Daily Signal · ${display.source}`}
            </span>
          </div>
          {!loading && (
            <span
              className="font-body rounded-full px-2 py-0.5 shrink-0"
              style={{ fontSize: 10, color: '#7B96FF', background: 'rgba(79,110,247,0.15)' }}
            >
              {display.tag}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '85%' }} />
            <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '60%' }} />
          </div>
        ) : (
          <>
            <p className="font-display leading-snug" style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF' }}>
              {display.headline}
            </p>
            <p className="font-body mt-1.5" style={{ fontSize: 11, color: '#4F6EF7' }}>
              Tap to see why this matters →
            </p>
          </>
        )}
      </motion.div>

      {/* Bottom Sheet */}
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-5 pt-2">
          {/* Source + tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#4F6EF7' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4F6EF7' }} />
              </span>
              <span className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
                {display.source}
              </span>
            </div>
            <span
              className="font-body rounded-full px-2.5 py-1"
              style={{ fontSize: 10, color: '#7B96FF', background: 'rgba(79,110,247,0.15)' }}
            >
              {display.tag}
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-display leading-snug"
            style={{ fontSize: 20, fontWeight: 700, color: '#F0F4FF', lineHeight: 1.3 }}
          >
            {display.headline}
          </h2>

          {/* Gist — short punchy TL;DR */}
          {display.gist && (
            <div
              className="rounded-2xl px-4 py-3"
              style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)' }}
            >
              <p className="font-body uppercase tracking-widest mb-1.5" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
                The gist
              </p>
              <p className="font-display font-semibold" style={{ fontSize: 14, color: '#C8D8FF', lineHeight: 1.55 }}>
                {display.gist}
              </p>
            </div>
          )}

          {/* Why it matters — full context */}
          <div>
            <p
              className="font-body uppercase tracking-widest mb-3"
              style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}
            >
              Why this matters for your career
            </p>
            <p
              className="font-body leading-relaxed"
              style={{ fontSize: 13, color: '#B8C8E8', lineHeight: 1.8 }}
            >
              {display.summary}
            </p>
          </div>

          {/* Read more link */}
          {(display as LiveSignal & { link?: string }).link && (
            <a
              href={(display as LiveSignal & { link?: string }).link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body flex items-center gap-1.5"
              style={{ fontSize: 13, color: '#4F6EF7' }}
            >
              Read the full article
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="#4F6EF7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}

          {/* Divider + Interview angle */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(79,110,247,0.07)', border: '1px solid rgba(79,110,247,0.15)' }}
          >
            <p
              className="font-body uppercase tracking-widest mb-2"
              style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}
            >
              Interview angle
            </p>
            <p className="font-body" style={{ fontSize: 13, color: '#7B96FF', lineHeight: 1.6 }}>
              Be ready to connect this to a design decision. How would you apply this if you were designing a product today?
            </p>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
