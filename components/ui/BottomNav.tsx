'use client';

import { motion } from 'framer-motion';
import type { NavTab } from '@/lib/mockData';

function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        stroke="currentColor"
        strokeWidth={active ? '2' : '1.6'}
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.25 : 0}
      />
    </svg>
  );
}

function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4"  y1="20" x2="4"  y2="12" stroke="currentColor" strokeWidth={active ? '2.5' : '1.8'} />
      <line x1="9"  y1="20" x2="9"  y2="7"  stroke="currentColor" strokeWidth={active ? '2.5' : '1.8'} />
      <line x1="14" y1="20" x2="14" y2="14" stroke="currentColor" strokeWidth={active ? '2.5' : '1.8'} />
      <line x1="19" y1="20" x2="19" y2="4"  stroke="currentColor" strokeWidth={active ? '2.5' : '1.8'} />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2' : '1.6'} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export type AppTab = 'today' | 'progress' | 'profile';

const TABS: { id: AppTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: 'today',    label: 'Today',    Icon: TodayIcon },
  { id: 'progress', label: 'Progress', Icon: ProgressIcon },
  { id: 'profile',  label: 'Profile',  Icon: ProfileIcon },
];

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 shell-fixed"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[390px] mx-auto flex items-center justify-around pb-safe pt-1.5 px-3">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              onClick={() => onChange(id)}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="relative flex flex-col items-center gap-0.5 px-5 min-w-[44px] min-h-[44px] justify-center cursor-pointer"
              style={{ color: isActive ? 'var(--accent)' : 'var(--subtle)' }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-x-1 top-1 bottom-1 rounded-2xl"
                  style={{ background: 'var(--accent-bg)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10"><Icon active={isActive} /></span>
              <span
                className="relative z-10 font-body leading-none"
                style={{ fontSize: 10, fontWeight: isActive ? 500 : 400 }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
