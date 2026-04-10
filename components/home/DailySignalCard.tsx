'use client';

import { useState, useEffect } from 'react';
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
const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

function loadCachedSignal(): { signal: LiveSignal; fetchedAt: number } | null {
  try {
    const raw = localStorage.getItem(SIGNAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function cacheSignal(signal: LiveSignal) {
  try {
    localStorage.setItem(SIGNAL_CACHE_KEY, JSON.stringify({ signal, fetchedAt: Date.now() }));
  } catch { /* quota */ }
}

function scheduleSignalNotification() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    reg.active?.postMessage({
      type: 'SCHEDULE_SIGNAL_NOTIFICATION',
      delayMs: REFRESH_INTERVAL_MS,
    });
  });
}

export default function DailySignalCard({ open, onClose }: DailySignalCardProps) {
  const [signal, setSignal] = useState<LiveSignal | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Use cache if fresh (< 4 hours old)
      const cached = loadCachedSignal();
      if (cached && Date.now() - cached.fetchedAt < REFRESH_INTERVAL_MS) {
        if (!cancelled) setSignal(cached.signal);
        return;
      }
      try {
        const res = await fetch('/api/signal');
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        if (!cancelled) {
          setSignal(data.item);
          cacheSignal(data.item);
          scheduleSignalNotification();
        }
      } catch {
        if (!cancelled) {
          const fallback = cached?.signal ?? (getCurrentSignal() as LiveSignal);
          setSignal(fallback);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const display = signal ?? (getCurrentSignal() as LiveSignal);
  const loading = !signal;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-5 pt-2">
        {/* Source + tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#4F6EF7' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4F6EF7' }} />
            </span>
            <span className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
              {loading ? 'Loading…' : display.source}
            </span>
          </div>
          {!loading && (
            <span className="font-body rounded-full px-2.5 py-1" style={{ fontSize: 10, color: '#7B96FF', background: 'rgba(79,110,247,0.15)' }}>
              {display.tag}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '90%' }} />
            <div className="h-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '70%' }} />
            <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: '50%' }} />
          </div>
        ) : (
          <>
            {/* Headline */}
            <h2 className="font-display leading-snug" style={{ fontSize: 20, fontWeight: 700, color: '#F0F4FF', lineHeight: 1.3 }}>
              {display.headline}
            </h2>

            {/* Gist */}
            {display.gist && (
              <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)' }}>
                <p className="font-body uppercase tracking-widest mb-1.5" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>The gist</p>
                <p className="font-display font-semibold" style={{ fontSize: 14, color: '#C8D8FF', lineHeight: 1.55 }}>{display.gist}</p>
              </div>
            )}

            {/* Why it matters */}
            <div>
              <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
                Why this matters for your career
              </p>
              <p className="font-body leading-relaxed" style={{ fontSize: 13, color: '#B8C8E8', lineHeight: 1.8 }}>
                {display.summary}
              </p>
            </div>

            {/* Read more */}
            {display.link && (
              <a href={display.link} target="_blank" rel="noopener noreferrer" className="font-body flex items-center gap-1.5" style={{ fontSize: 13, color: '#4F6EF7' }}>
                Read the full article
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="#4F6EF7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}

            {/* Interview angle */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(79,110,247,0.07)', border: '1px solid rgba(79,110,247,0.15)' }}>
              <p className="font-body uppercase tracking-widest mb-2" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>Interview angle</p>
              <p className="font-body" style={{ fontSize: 13, color: '#7B96FF', lineHeight: 1.6 }}>
                Be ready to connect this to a design decision. How would you apply this if you were designing a product today?
              </p>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
