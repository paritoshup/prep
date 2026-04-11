'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomSheet from '@/components/ui/BottomSheet';
import { getReadinessBreakdown, loadState } from '@/lib/storage';

interface ReadinessCardProps {
  score: number;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      />
    </div>
  );
}

function ScoreRow({ label, value, max, color, tip }: { label: string; value: number; max: number; color: string; tip: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body" style={{ fontSize: 13, color: 'var(--text)' }}>{label}</span>
        <span className="font-display font-bold" style={{ fontSize: 13, color }}>
          {value}<span style={{ color: 'var(--muted)', fontWeight: 400 }}>/{max}</span>
        </span>
      </div>
      <Bar value={value} max={max} color={color} />
      <p className="font-body" style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{tip}</p>
    </div>
  );
}

export default function ReadinessCard({ score }: ReadinessCardProps) {
  const [open, setOpen] = useState(false);
  const streak = loadState().streak;

  const bd = open ? getReadinessBreakdown() : null;

  function drillTip(drills: number, avg: number) {
    if (drills === 0) return 'Complete today\'s drills to earn up to 50 points here.';
    if (avg < 60) return 'Focus on structure: problem → thinking → outcome.';
    if (drills < 3) return `${3 - drills} drill${3 - drills > 1 ? 's' : ''} left today. Finish all 3 to hit the max.`;
    return 'All 3 drills done. Drill quality is your biggest lever.';
  }
  function streakTip(s: number) {
    if (s === 0) return 'Practice daily to start a streak. +2 pts per day, up to 20.';
    if (s < 5) return `${s}-day streak — keep going. Each day adds 2 more points.`;
    return `${s}-day streak. Strong momentum.`;
  }
  function consistencyTip(days: number) {
    if (days <= 2) return 'Aim for 5+ active days this week to max this out.';
    if (days < 6) return `${days}/7 active days. One more day gets you close.`;
    return 'Excellent weekly consistency.';
  }
  function rapidTip(pts: number) {
    if (pts === 0) return 'Try the Rapid Fire quiz — it contributes up to 15 points.';
    if (pts < 10) return 'Moderate. Retake Rapid Fire to push higher.';
    return 'Strong Rapid Fire score.';
  }

  return (
    <>
      {/* Row: readiness + streak */}
      <div className="flex gap-2.5">
        {/* Readiness card */}
        <motion.div
          onClick={() => setOpen(true)}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-2xl cursor-pointer"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 16px',
          }}
        >
          <p className="font-body uppercase mb-2" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.07em', fontWeight: 500 }}>
            Score
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
              {score}
            </span>
            <span className="font-body" style={{ fontSize: 13, color: 'var(--muted)' }}>/100</span>
          </div>
          <p className="font-body" style={{ fontSize: 11, color: score >= 75 ? 'var(--accent)' : 'var(--muted)' }}>
            {score >= 75 ? 'Top 25% today' : 'Tap to see breakdown'}
          </p>
        </motion.div>

        {/* Streak card */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl shrink-0"
          style={{
            width: 68,
            background: streak > 0 ? 'var(--accent)' : 'var(--surface2)',
            borderRadius: 16,
            boxShadow: streak > 0 ? '0 4px 14px rgba(255,92,53,0.25)' : 'none',
          }}
        >
          <span className="font-display" style={{ fontSize: 26, fontWeight: 800, color: streak > 0 ? '#fff' : 'var(--muted)', lineHeight: 1 }}>
            {streak}
          </span>
          <span className="font-body uppercase" style={{ fontSize: 9, color: streak > 0 ? 'rgba(255,255,255,0.7)' : 'var(--muted)', letterSpacing: '0.07em', fontWeight: 500, marginTop: 2 }}>
            Streak
          </span>
        </div>
      </div>

      {/* Breakdown sheet */}
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        {bd && (
          <div className="flex flex-col gap-5 pt-2 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold" style={{ fontSize: 18, color: 'var(--text)' }}>Score Breakdown</h3>
                <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)' }}>What's working — and what to improve</p>
              </div>
              <span className="font-display font-bold" style={{ fontSize: 36, color: 'var(--text)', lineHeight: 1 }}>{score}</span>
            </div>
            <div className="h-px" style={{ background: 'var(--border)' }} />
            <ScoreRow label="Drill quality" value={bd.drillPoints} max={50} color="var(--blue)" tip={drillTip(bd.drillsCompleted, bd.avgDrillScore)} />
            <ScoreRow label="Daily streak" value={bd.streakPoints} max={20} color="var(--accent)" tip={streakTip(bd.streak)} />
            <ScoreRow label="Weekly consistency" value={bd.consistencyPoints} max={15} color="var(--green)" tip={consistencyTip(bd.activeDays)} />
            <ScoreRow label="Rapid Fire" value={bd.rapidPoints} max={15} color="var(--amber)" tip={rapidTip(bd.rapidPoints)} />
            <div className="h-px" style={{ background: 'var(--border)' }} />
            <p className="font-body" style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
              Score updates after each drill. Drill quality is the biggest lever — aim for structured, specific answers.
            </p>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
