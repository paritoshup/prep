'use client';

import type { NavTab } from '@/lib/mockData';

/* ─── Icons ──────────────────────────────────────────────────────── */
function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        stroke="currentColor"
        strokeWidth={active ? '2' : '1.6'}
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.2 : 0}
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

/* ─── Tab config (3 tabs) ────────────────────────────────────────── */
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
      className="fixed bottom-0 left-0 right-0"
      style={{
        background: 'rgba(8,15,30,0.94)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-[390px] mx-auto flex items-center justify-around pb-safe pt-2 px-3">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-col items-center gap-1 py-1.5 px-4 min-w-[44px] min-h-[44px] justify-center cursor-pointer transition-all duration-200 rounded-2xl"
              style={{
                color: isActive ? '#F0F4FF' : '#7A8BAD',
                background: isActive ? 'rgba(79,110,247,0.15)' : 'transparent',
              }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon active={isActive} />
              <span
                className="font-body leading-none"
                style={{
                  fontSize: 10,
                  color: isActive ? '#7B96FF' : '#7A8BAD',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
