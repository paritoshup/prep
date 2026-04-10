// ─── Schema ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  role: 'Designer' | 'Product Manager' | 'Researcher' | 'Other';
  company: string;          // target company, optional
  interviewDate: string;    // ISO date string, optional
  reminderTime: string;     // "HH:MM" 24h format
  onboardingComplete: boolean;
  joinedAt: string;         // ISO date string — set once on onboarding complete
}

export interface DrillSession {
  drillId: number;
  drillType: string;
  keywords: string[];
  score: number;
  completedAt: string; // ISO
}

export interface DailyRecord {
  date: string;           // "YYYY-MM-DD"
  drillsDone: number;     // 0-3
  sessions: DrillSession[];
  rapidFireScore: number; // correct / 7
  readinessScore: number;
}

export interface AppState {
  user: UserProfile | null;
  streak: number;
  lastActiveDate: string;  // "YYYY-MM-DD"
  history: DailyRecord[];  // last 30 days
  notificationPermission: 'default' | 'granted' | 'denied';
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_STATE: AppState = {
  user: null,
  streak: 0,
  lastActiveDate: '',
  history: [],
  notificationPermission: 'default',
};

const STORAGE_KEY = 'prep_app_v1';

// ─── Core helpers ─────────────────────────────────────────────────────────────

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage quota exceeded — silent fail
  }
}

export function updateState(patch: Partial<AppState>): AppState {
  const current = loadState();
  const next = { ...current, ...patch };
  saveState(next);
  return next;
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export function saveUser(user: UserProfile): void {
  updateState({ user });
}

export function getUser(): UserProfile | null {
  return loadState().user;
}

export function isOnboardingComplete(): boolean {
  return loadState().user?.onboardingComplete === true;
}

// ─── Streak helpers ───────────────────────────────────────────────────────────

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function updateStreak(): number {
  const state = loadState();
  const today = getTodayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let streak = state.streak;

  if (state.lastActiveDate === today) {
    return streak; // already counted today
  } else if (state.lastActiveDate === yesterday) {
    streak += 1;   // consecutive day
  } else {
    streak = 1;    // reset
  }

  updateState({ streak, lastActiveDate: today });
  return streak;
}

// ─── Daily record helpers ─────────────────────────────────────────────────────

export function getTodayRecord(): DailyRecord {
  const state = loadState();
  const today = getTodayKey();
  return state.history.find(r => r.date === today) ?? {
    date: today,
    drillsDone: 0,
    sessions: [],
    rapidFireScore: 0,
    readinessScore: 0,
  };
}

// ─── Readiness score formula ──────────────────────────────────────────────────
// Max 100 = drill quality (50) + streak (20) + consistency (15) + rapid fire (15)
function calculateReadinessScore(
  sessions: DrillSession[],
  streak: number,
  history: DailyRecord[],
  rapidFireScore: number,
): number {
  // 1. Drill quality (0–50): avg drill score × completion factor
  let drillPoints = 0;
  if (sessions.length > 0) {
    const avg = sessions.reduce((s, d) => s + d.score, 0) / sessions.length;
    const factor = sessions.length === 1 ? 0.40 : sessions.length === 2 ? 0.46 : 0.50;
    drillPoints = Math.round(avg * factor);
  }

  // 2. Streak bonus (0–20): 2 pts per day, capped at 10 days
  const streakPoints = Math.min(20, streak * 2);

  // 3. Consistency (0–15): active days out of last 7
  const today = new Date().toISOString().slice(0, 10);
  const last7 = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
  );
  const activeDays = last7.filter(d =>
    d === today || history.some(r => r.date === d && r.drillsDone > 0)
  ).length;
  const consistencyPoints = Math.round((activeDays / 7) * 15);

  // 4. Rapid fire (0–15)
  const rapidPoints = Math.round((rapidFireScore / 100) * 15);

  return Math.min(100, drillPoints + streakPoints + consistencyPoints + rapidPoints);
}

export function saveDrillSession(session: DrillSession): void {
  const state = loadState();
  const today = getTodayKey();
  const history = [...state.history];
  const idx = history.findIndex(r => r.date === today);

  const record: DailyRecord = idx >= 0 ? { ...history[idx] } : {
    date: today,
    drillsDone: 0,
    sessions: [],
    rapidFireScore: 0,
    readinessScore: 0,
  };

  // Add session if not already recorded
  if (!record.sessions.find(s => s.drillId === session.drillId)) {
    record.sessions = [...record.sessions, session];
    record.drillsDone = record.sessions.length;
  }

  // Recalculate readiness score with proper weighted formula
  const streak = updateStreak();
  record.readinessScore = calculateReadinessScore(record.sessions, streak, history, record.rapidFireScore);

  if (idx >= 0) {
    history[idx] = record;
  } else {
    history.push(record);
  }

  // Keep last 30 days only
  const trimmed = history
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  saveState({ ...state, history: trimmed, lastActiveDate: today, streak });
}

export function saveRapidFireScore(correct: number, total: number): void {
  const state = loadState();
  const today = getTodayKey();
  const history = [...state.history];
  const idx = history.findIndex(r => r.date === today);
  const record: DailyRecord = idx >= 0 ? { ...history[idx] } : {
    date: today, drillsDone: 0, sessions: [], rapidFireScore: 0, readinessScore: 0,
  };
  record.rapidFireScore = Math.round((correct / total) * 100);
  if (idx >= 0) { history[idx] = record; } else { history.push(record); }
  saveState({ ...state, history });
}

// ─── Readiness history for chart ──────────────────────────────────────────────

export function getReadinessHistory(): { date: string; score: number }[] {
  const state = loadState();
  return state.history
    .filter(r => r.readinessScore > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({ date: r.date, score: r.readinessScore }));
}

export function getCurrentReadinessScore(): number {
  const history = getReadinessHistory();
  if (history.length === 0) return 0;
  return history[history.length - 1].score;
}

export interface ReadinessBreakdown {
  drillPoints: number;     // 0–50
  streakPoints: number;    // 0–20
  consistencyPoints: number; // 0–15
  rapidPoints: number;     // 0–15
  streak: number;
  activeDays: number;      // out of last 7
  drillsCompleted: number; // today
  avgDrillScore: number;
}

export function getReadinessBreakdown(): ReadinessBreakdown {
  const state = loadState();
  const today = getTodayKey();
  const record = state.history.find(r => r.date === today);
  const sessions = record?.sessions ?? [];
  const streak = state.streak;

  const avgDrillScore = sessions.length > 0
    ? Math.round(sessions.reduce((s, d) => s + d.score, 0) / sessions.length)
    : 0;
  const factor = sessions.length === 1 ? 0.40 : sessions.length === 2 ? 0.46 : 0.50;
  const drillPoints = sessions.length > 0 ? Math.round(avgDrillScore * factor) : 0;
  const streakPoints = Math.min(20, streak * 2);

  const last7 = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
  );
  const activeDays = last7.filter(d =>
    d === today || state.history.some(r => r.date === d && r.drillsDone > 0)
  ).length;
  const consistencyPoints = Math.round((activeDays / 7) * 15);

  const rapidFireScore = record?.rapidFireScore ?? 0;
  const rapidPoints = Math.round((rapidFireScore / 100) * 15);

  return { drillPoints, streakPoints, consistencyPoints, rapidPoints, streak, activeDays, drillsCompleted: sessions.length, avgDrillScore };
}

// ─── Day counter ──────────────────────────────────────────────────────────────

export function getCurrentDay(): number {
  const user = getUser();
  if (!user) return 1;

  // Backfill joinedAt for users who onboarded before this field existed.
  // Use earliest date in history → lastActiveDate → today, in that order.
  if (!user.joinedAt) {
    const state = loadState();
    const sorted = [...state.history].sort((a, b) => a.date.localeCompare(b.date));
    const earliest = sorted[0]?.date ?? state.lastActiveDate ?? new Date().toISOString().slice(0, 10);
    const patched = { ...user, joinedAt: new Date(earliest).toISOString() };
    saveUser(patched);
    const diff = Date.now() - new Date(earliest).getTime();
    return Math.max(1, Math.floor(diff / 86400000) + 1);
  }

  const diff = Date.now() - new Date(user.joinedAt).getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

// ─── Days until interview ─────────────────────────────────────────────────────

export function getDaysUntilInterview(): number | null {
  const user = getUser();
  if (!user?.interviewDate) return null;
  const diff = new Date(user.interviewDate).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}
