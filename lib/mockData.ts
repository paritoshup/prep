// ─── Types ───────────────────────────────────────────────────────────────────

export type DrillColor = 'accent' | 'amber' | 'green';
export type NavTab = 'today' | 'progress' | 'profile';

export interface DrillMeta {
  mode: string;
  duration: string;
  color: DrillColor;
}

export interface Drill {
  id: number;
  type: string;        // Category label shown above name
  name: string;        // Headline — short, punchy
  description: string; // One crisp line of what to expect inside
  meta: DrillMeta;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  rank: string;
  day: number;
  totalDays: number;
  readinessScore: number;
  dayProgress: number; // 0–100
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const userProfile: UserProfile = {
  name: 'Alex',
  rank: 'Contender',
  day: 11,
  totalDays: 30,
  readinessScore: 74,
  dayProgress: 37,
};

export const todaysDrills: Drill[] = [
  {
    id: 1,
    type: 'READ THE BRIEF',
    name: 'What is the prompt really asking?',
    description: 'Spot the hidden constraint before you start designing.',
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    id: 2,
    type: 'BUILD THE VISION',
    name: 'Design an AI onboarding flow.',
    description: 'Walk us through your thinking — product decisions under pressure.',
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    id: 3,
    type: 'OWN THE CALL',
    name: 'Why did you drop that feature?',
    description: 'You made the call. Now justify it without backtracking.',
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
];

// Bar heights as percentages (0–100) — 5 bars for readiness chart
export const readinessBars: number[] = [45, 70, 55, 85, 65];
