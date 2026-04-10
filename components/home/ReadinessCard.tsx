'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomSheet from '@/components/ui/BottomSheet';
import { getReadinessBreakdown } from '@/lib/storage';

interface ReadinessCardProps {
  score: number;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
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

function ScoreRow({
  label, value, max, color, tip,
}: { label: string; value: number; max: number; color: string; tip: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body" style={{ fontSize: 13, color: '#B8C8E8' }}>{label}</span>
        <span className="font-display font-bold" style={{ fontSize: 13, color }}>
          {value}<span style={{ color: '#4A5A7A', fontWeight: 400 }}>/{max}</span>
        </span>
      </div>
      <Bar value={value} max={max} color={color} />
      <p className="font-body" style={{ fontSize: 11, color: '#4A5A7A', lineHeight: 1.5 }}>{tip}</p>
    </div>
  );
}

export default function ReadinessCard({ score }: ReadinessCardProps) {
  const [open, setOpen] = useState(false);

  function openSheet() {
    setOpen(true);
  }

  const bd = open ? getReadinessBreakdown() : null;

  // Tips based on breakdown
  function drillTip(pts: number, drills: number, avg: number) {
    if (drills === 0) return 'Complete today\'s drills to earn up to 50 points here.';
    if (avg < 60) return 'Your drill scores are low — focus on structure: problem → thinking → outcome.';
    if (drills < 3) return `${3 - drills} drill${3 - drills > 1 ? 's' : ''} left today. Finish all 3 to hit the full 50.`;
    return 'All 3 drills done today — drill quality is your biggest lever.';
  }
  function streakTip(streak: number) {
    if (streak === 0) return 'Open the app and drill daily to start a streak. +2 pts per day, up to 20.';
    if (streak < 5) return `${streak}-day streak — keep going. Each consecutive day adds 2 more points.`;
    return `${streak}-day streak. Strong momentum — don't break the chain.`;
  }
  function consistencyTip(days: number) {
    if (days <= 2) return 'You\'ve been active only a few days this week. Aim for 5+ days to max this out.';
    if (days < 6) return `${days}/7 active days this week. One more day gets you close to the max.`;
    return 'Excellent weekly consistency — this is fully working in your favor.';
  }
  function rapidTip(pts: number) {
    if (pts === 0) return 'Try the Rapid Fire quiz on the home screen — it contributes up to 15 points.';
    if (pts < 10) return 'Rapid Fire score is moderate. Retake it to push higher.';
    return 'Rapid Fire score is strong. Keep it up each session.';
  }

  return (
    <>
      <motion.div
        onClick={openSheet}
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer"
        style={{
          background: 'rgba(15,32,64,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Score */}
        <div>
          <p className="font-body text-xs mb-2" style={{ color: '#7A8BAD' }}>Readiness Score</p>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="font-display leading-none" style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF' }}>
              {score}
            </span>
            <span className="font-body text-muted text-sm">/ 100</span>
          </div>
          <p className="font-body" style={{ fontSize: 10, color: '#4A5A7A', lineHeight: 1.5 }}>
            Tap to see what's driving your score.
          </p>
        </div>

        {/* Mini bar chart */}
        <div className="flex items-end gap-[5px] h-12 shrink-0">
          {[40, 65, 55, 80, 70, 90, score].map((h, i) => (
            <motion.div
              key={i}
              className="w-[5px] rounded-sm"
              style={{
                height: `${Math.max(10, h)}%`,
                background: i === 6 ? '#4F6EF7' : 'rgba(79,110,247,0.25)',
                transformOrigin: 'bottom',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 280, damping: 22 }}
            />
          ))}
        </div>

        {/* Chevron hint */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
          <path d="M5 3l4 4-4 4" stroke="#4A5A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        {bd && (
          <div className="flex flex-col gap-5 pt-2 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold" style={{ fontSize: 18, color: '#F0F4FF' }}>
                  Readiness Score
                </h3>
                <p className="font-body" style={{ fontSize: 12, color: '#7A8BAD' }}>
                  What's working — and what to improve
                </p>
              </div>
              <span className="font-display font-bold" style={{ fontSize: 36, color: '#F0F4FF', lineHeight: 1 }}>
                {score}
              </span>
            </div>

            <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {/* Breakdown rows */}
            <ScoreRow
              label="Drill quality"
              value={bd.drillPoints}
              max={50}
              color="#4F6EF7"
              tip={drillTip(bd.drillPoints, bd.drillsCompleted, bd.avgDrillScore)}
            />
            <ScoreRow
              label="Daily streak"
              value={bd.streakPoints}
              max={20}
              color="#F6B84B"
              tip={streakTip(bd.streak)}
            />
            <ScoreRow
              label="Weekly consistency"
              value={bd.consistencyPoints}
              max={15}
              color="#4ADE80"
              tip={consistencyTip(bd.activeDays)}
            />
            <ScoreRow
              label="Rapid Fire"
              value={bd.rapidPoints}
              max={15}
              color="#C084FC"
              tip={rapidTip(bd.rapidPoints)}
            />

            <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

            <p className="font-body" style={{ fontSize: 11, color: '#4A5A7A', lineHeight: 1.6 }}>
              Score updates after each drill. Drill quality is the biggest lever — aim for structured, specific answers.
            </p>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
