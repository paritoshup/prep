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

  // Recalculate readiness score based on drills + streak
  const streak = updateStreak();
  record.readinessScore = Math.min(100, 40 + record.drillsDone * 15 + Math.min(streak * 2, 20));

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

// ─── Day counter ──────────────────────────────────────────────────────────────

export function getCurrentDay(): number {
  const user = getUser();
  if (!user) return 1;
  // Backfill joinedAt for users who onboarded before this field existed
  if (!user.joinedAt) {
    const patched = { ...user, joinedAt: new Date().toISOString() };
    saveUser(patched);
    return 1;
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
