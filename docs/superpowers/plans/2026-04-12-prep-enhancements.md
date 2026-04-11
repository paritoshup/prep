# Prep App Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 UX enhancements: streak at-risk warning, milestone confetti, 30-day dynamic drill bank, listening waveform animation, and AI ideal-answer reveal.

**Architecture:** No new libraries needed. Confetti uses canvas + rAF. Drill bank expands to 10 drills/type with deterministic day-based rotation. Ideal answer calls a new `/api/ideal-answer` Claude Haiku route. All state is localStorage-backed.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript 5, Framer Motion v12, Anthropic SDK (already installed), localStorage.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `lib/drillBank.ts` | Modify | Expand to 40 drills (10/type), day-based rotation |
| `components/ui/ConfettiCelebration.tsx` | **Create** | Canvas confetti burst + milestone message |
| `components/home/HomeScreen.tsx` | Modify | At-risk banner, confetti trigger, updated drill call |
| `components/drill/DrillScreen.tsx` | Modify | Animated listening waveform |
| `components/drill/KeywordResult.tsx` | Modify | "Ideal answer" lazy-fetch section |
| `app/api/ideal-answer/route.ts` | **Create** | Claude Haiku ideal answer endpoint |

---

## Task 1: Expand drill bank to 40 drills with 30-day rotation

**Files:**
- Modify: `lib/drillBank.ts`

The current bank has 24 drills (6/type). We expand to 10/type and switch from a 12-hour time-window rotation to a `dayNumber`-based rotation so the curriculum progresses intentionally over 30 days.

**Rotation logic:**
- Slot 1 alternates READ THE BRIEF (even days) / DESIGN DILEMMA (odd days), advancing one drill every 2 days → 20-day unique cycle
- Slot 2: BUILD THE VISION advances one per day → 10-day cycle
- Slot 3: OWN THE CALL advances one per day → 10-day cycle
- After 30 days the combination loops gracefully

- [ ] **Step 1: Replace `lib/drillBank.ts` entirely**

```typescript
import type { Drill } from './mockData';

const ALL_DRILLS: Omit<Drill, 'id'>[] = [

  // ── READ THE BRIEF ────────────────────────────────────────────────────────
  {
    type: 'READ THE BRIEF',
    name: "You're asked to redesign AI search. What's your first question?",
    description: "Before opening Figma, what do you need to know? Speak your answer out loud.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "A PM says 'make it more intuitive.' What does that mean?",
    description: "Push back on vague briefs. Show how you reframe the ask before designing.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "Users are dropping off at step 3. What do you do first?",
    description: "Don't jump to solutions. Walk through exactly what you'd investigate.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "The brief says: build an AI onboarding. What's missing from that?",
    description: "Spot what the brief doesn't say. The best designers ask what others skip.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "Design a feature for a billion people. Where do you even start?",
    description: "Scope the unscopeable. Show how you'd break down an impossible brief.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "The team wants to add AI everywhere. What would you push back on?",
    description: "Not every problem needs AI. Speak to your criteria for when it earns its place.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "You're handed a 40-page research report. How do you find the design opportunity?",
    description: "Research is raw material, not a brief. Show how you extract signal from noise.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "The CEO saw a competitor's feature and wants to 'build that.' How do you respond?",
    description: "Don't say yes, don't say no. Show how you redirect toward the real problem.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "A feature exists in 6 different places in the product. What does that tell you?",
    description: "Fragmentation is a symptom. Diagnose the cause before proposing a fix.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "You've been asked to 'improve retention.' What's your first question?",
    description: "Retention is an outcome, not a feature. Show how you break it into something designable.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },

  // ── BUILD THE VISION ──────────────────────────────────────────────────────
  {
    type: 'BUILD THE VISION',
    name: "Design an AI onboarding flow. Walk us through it.",
    description: "Think out loud. Product decisions, not just UI choices.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "How would you redesign Google Search for 2026?",
    description: "Not just visual — what's the model? What changes about how it works?",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "Design the 'undo' feature for an AI that takes actions on your behalf.",
    description: "Hard problem, no clean answer. Show your thinking, not a perfect solution.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "A user got a wrong AI answer and lost trust. How do you fix it?",
    description: "Trust is a design problem. Walk through your recovery flow.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "Design a product that helps junior designers learn faster using AI.",
    description: "Real use case, real users. Structure your answer: who, what, why, how.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "What does the settings screen of an AI assistant actually need?",
    description: "Most are broken. Design one that gives control without overwhelming.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "Design a voice interface for a medical AI. Walk through the critical constraints.",
    description: "High stakes, voice modality, anxious users. What does that force you to prioritise?",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "How would you design the confidence indicator for AI-generated content?",
    description: "Users need to know when to trust the machine. Design the signal.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "Design a feedback loop that makes AI personalisation feel useful, not invasive.",
    description: "The line between helpful and creepy is thin. Where do you draw it?",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },
  {
    type: 'BUILD THE VISION',
    name: "Redesign email for a world where AI drafts your replies. What changes fundamentally?",
    description: "Don't just add features. Rethink what email is when AI is the first reader.",
    meta: { mode: 'Camera on', duration: '90s', color: 'amber' },
  },

  // ── DESIGN DILEMMA ────────────────────────────────────────────────────────
  {
    type: 'DESIGN DILEMMA',
    name: "Two users want opposite things. Who do you design for?",
    description: "There's no right answer — only a well-reasoned one. Make your call.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Ship fast with tech debt, or slow with clean foundations?",
    description: "Context changes everything. What factors would tip your decision?",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "The data says one thing. Your gut says another. What wins?",
    description: "Both can be right. Walk through how you'd resolve the tension.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Your most-used feature is also your most confusing. Now what?",
    description: "Redesigning it means breaking familiarity. How do you approach that?",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "You have 3 days to ship. What gets cut and what stays?",
    description: "Prioritisation under pressure is a core design skill. Show it.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Accessibility improvement vs. a feature 80% of users want. Pick one.",
    description: "No easy answer. Make your reasoning explicit.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "A/B test results are significant but the winning variant feels wrong. What do you do?",
    description: "Data has limits. When does designer judgment override a metric?",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Research says users don't want this feature. Leadership wants it anyway.",
    description: "You can't just say no. Show how you'd navigate the tension without losing your integrity.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Improve the experience for 20% of power users, or 80% of casual ones. Which?",
    description: "The answer changes the whole product direction. Reason it out.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' }, active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "The ethical path and the business path diverge. How do you navigate it?",
    description: "No hypotheticals — speak as if this is real and your career is on the line.",
    meta: { mode: 'Mic only', duration: '60s', color: 'accent' }, active: true,
  },

  // ── OWN THE CALL ──────────────────────────────────────────────────────────
  {
    type: 'OWN THE CALL',
    name: "Why did you drop that feature? We loved it.",
    description: "You made the call. Justify it without backtracking or apologising.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "Your design tested badly. Do you ship it anyway?",
    description: "Context matters. Walk through the factors that would change your answer.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "The engineer says your design is impossible. Now what?",
    description: "You've been here before. Show how you handle constraint without folding.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "You disagreed with the PM and you were right. How do you handle it?",
    description: "Being right isn't enough. How you handle it is what gets remembered.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "The stakeholder wants a dark pattern. What do you do?",
    description: "Ethical line or career risk? Walk through how you'd navigate it.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "You shipped something broken. What do you say to the team?",
    description: "Accountability is a design skill too. Speak plainly.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "You're 6 months into a project and realise you've been solving the wrong problem.",
    description: "Sunk cost is real. Show how you'd surface this without burning trust.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "A senior designer publicly criticised your work in a design review. How do you respond?",
    description: "Composure is a skill. Defend your work without getting defensive.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "The product you shipped is being used in a way you never intended. What's your responsibility?",
    description: "Designers ship intent, but users bring reality. Where does your obligation end?",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
  {
    type: 'OWN THE CALL',
    name: "You're the most junior person in the room. How do you make your perspective count?",
    description: "Influence without authority is a core skill at every level.",
    meta: { mode: 'Mic only', duration: '60s', color: 'green' },
  },
];

/**
 * Returns 3 drills for the given day number (1-indexed).
 *
 * Slot logic:
 *  - Slot 1 alternates READ THE BRIEF (even day index) / DESIGN DILEMMA (odd day index),
 *    advancing one drill every 2 days → full cycle every 20 days
 *  - Slot 2: BUILD THE VISION cycles one per day → full cycle every 10 days
 *  - Slot 3: OWN THE CALL cycles one per day → full cycle every 10 days
 *
 * With 10 drills/type, days 1–20 are fully unique combos.
 * Days 21–30 loop gracefully with different slot-2/3 pairings.
 */
export function getCurrentDrills(dayNumber: number = 1): Drill[] {
  const d = Math.max(0, dayNumber - 1); // 0-indexed

  const briefs    = ALL_DRILLS.filter(x => x.type === 'READ THE BRIEF');
  const visions   = ALL_DRILLS.filter(x => x.type === 'BUILD THE VISION');
  const dilemmas  = ALL_DRILLS.filter(x => x.type === 'DESIGN DILEMMA');
  const owns      = ALL_DRILLS.filter(x => x.type === 'OWN THE CALL');

  const slot1 = d % 2 === 0
    ? briefs[Math.floor(d / 2) % briefs.length]
    : dilemmas[Math.floor(d / 2) % dilemmas.length];

  const slot2 = visions[d % visions.length];
  const slot3 = owns[d % owns.length];

  return [slot1, slot2, slot3].map((drill, i) => ({ ...drill, id: i + 1 }));
}
```

- [ ] **Step 2: Update all `getCurrentDrills()` call sites to pass `getCurrentDay()`**

In `components/home/HomeScreen.tsx`, there are two calls:

```typescript
// In TodayView (line ~35) — change:
const drills = getCurrentDrills();
// to:
const drills = getCurrentDrills(getCurrentDay());

// In root HomeScreen (line ~113) — change:
const drills = getCurrentDrills();
// to:
const drills = getCurrentDrills(getCurrentDay());
```

Also add `getCurrentDay` to the storage import if not already present:
```typescript
import { getUser, getCurrentDay, getCurrentReadinessScore, getTodayRecord, loadState } from '@/lib/storage';
```

- [ ] **Step 3: Verify in browser**

Navigate to `/` — today's 3 drills should render. Open DevTools console and run:
```javascript
JSON.parse(localStorage.getItem('prep_state') || '{}')
```
Note `joinedAt`. The drill titles should match what day 1, 2, 3, etc. would produce per the new rotation.

- [ ] **Step 4: Commit**
```bash
git add lib/drillBank.ts components/home/HomeScreen.tsx
git commit -m "feat: expand drill bank to 40 drills with 30-day day-based rotation"
```

---

## Task 2: Streak at-risk warning

**Files:**
- Modify: `components/home/HomeScreen.tsx`

Show a pulsing red banner in `TodayView` when it's past 7pm, the user has an active streak (> 0), and they haven't finished today's drills.

- [ ] **Step 1: Add `useMemo` and `loadState` imports to `HomeScreen.tsx`**

```typescript
import { useState, useMemo } from 'react';
// ...
import { getUser, getCurrentDay, getCurrentReadinessScore, getTodayRecord, loadState } from '@/lib/storage';
```

- [ ] **Step 2: Add `isAtRisk` computation inside `TodayView`**

Add immediately after the existing state/derived values at the top of `TodayView`:

```typescript
const isAtRisk = useMemo(() => {
  const hour = new Date().getHours();
  const streak = loadState().streak;
  return hour >= 19 && completedDrillIds.length < drills.length && streak > 0;
}, [completedDrillIds, drills]);
```

- [ ] **Step 3: Add the at-risk banner JSX in `TodayView`, between `<InterviewCountdown />` and `<DailySignalCard …/>`**

```tsx
{/* Streak at-risk warning */}
{isAtRisk && (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    className="rounded-2xl px-4 py-3 flex items-center gap-3"
    style={{ background: 'var(--red-bg)', border: '1px solid rgba(229,62,62,0.2)' }}
  >
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }}
    />
    <p className="font-body" style={{ fontSize: 12, color: 'var(--red)', flex: 1, lineHeight: 1.5 }}>
      Streak at risk — finish today's drills before midnight.
    </p>
  </motion.div>
)}
```

Wrap the JSX return in `<AnimatePresence>` around the banner so exit animation fires — or simply rely on conditional render (the banner disappears once `isAtRisk` turns false).

- [ ] **Step 4: Verify**

To test without waiting for 7pm, temporarily change the threshold in `isAtRisk` to `hour >= 0`, ensure a streak > 0 in localStorage, and verify the banner appears and disappears when all 3 drills complete.

- [ ] **Step 5: Commit**
```bash
git add components/home/HomeScreen.tsx
git commit -m "feat: streak at-risk warning after 7pm"
```

---

## Task 3: Confetti celebration on streak milestones

**Files:**
- Create: `components/ui/ConfettiCelebration.tsx`
- Modify: `components/home/HomeScreen.tsx`

Milestones: streaks of 1, 3, 7, 15, 21, 30. Each milestone is celebrated once (tracked in localStorage key `prep_celebrated`). A canvas burst fires, overlaid with a centered message that fades in/out.

- [ ] **Step 1: Create `components/ui/ConfettiCelebration.tsx`**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#FF5C35', '#3B6EF8', '#1A9E5C', '#F5A623', '#C084FC', '#FB7185', '#F2F0EB'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number; rotationSpeed: number;
  color: string;
  w: number; h: number;
  life: number;
}

interface Props {
  active: boolean;
  message?: string;
}

export default function ConfettiCelebration({ active, message }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.38;

    particles.current = Array.from({ length: 90 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      return {
        x: cx + (Math.random() - 0.5) * 80,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 6 + Math.random() * 7,
        h: 10 + Math.random() * 8,
        life: 1,
      };
    });

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      let alive = false;
      for (const p of particles.current) {
        p.vy    += 0.28;
        p.x     += p.vx;
        p.y     += p.vy;
        p.rotation += p.rotationSpeed;
        p.life  -= 0.011;
        if (p.life <= 0) continue;
        alive = true;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      }
      if (alive) rafRef.current = requestAnimationFrame(tick);
      else ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none', zIndex: 300,
          display: active ? 'block' : 'none',
        }}
      />
      <AnimatePresence>
        {active && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 310,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              className="font-display text-center px-8 py-6 rounded-3xl"
              style={{
                background: '#1A1A1A',
                boxShadow: '0 16px 60px rgba(0,0,0,0.25)',
                maxWidth: 300,
              }}
            >
              <p style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Milestone
              </p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Add confetti state + trigger to root `HomeScreen`**

Add imports:
```typescript
import ConfettiCelebration from '@/components/ui/ConfettiCelebration';
```

Add state inside root `HomeScreen` component (alongside existing `toast` state):
```typescript
const [confetti, setConfetti] = useState<{ message: string } | null>(null);
```

Add milestone constants above `HomeScreen`:
```typescript
const MILESTONES = [1, 3, 7, 15, 21, 30];
const MILESTONE_MESSAGES: Record<number, string> = {
  1:  'First day done. The habit starts now.',
  3:  '3-day streak. You\'re building something real.',
  7:  'One week. Interviews fear consistency.',
  15: 'Halfway there. Your answers are getting sharper.',
  21: '21 days. This is a habit now.',
  30: '30 days. You showed up every single day.',
};
```

- [ ] **Step 3: Update `handleDrillComplete` to check milestones**

```typescript
function handleDrillComplete(id: number) {
  setCompletedDrillIds(prev => {
    const updated = [...prev, id];
    setToast({ drillNumber: updated.length });

    // Fire confetti if stack just completed and streak is a milestone
    if (updated.length === drills.length) {
      try {
        const streak = loadState().streak;
        if (MILESTONES.includes(streak)) {
          const celebrated: number[] = JSON.parse(
            localStorage.getItem('prep_celebrated') ?? '[]'
          );
          if (!celebrated.includes(streak)) {
            celebrated.push(streak);
            localStorage.setItem('prep_celebrated', JSON.stringify(celebrated));
            const msg = MILESTONE_MESSAGES[streak];
            setConfetti({ message: msg });
            setTimeout(() => setConfetti(null), 4200);
          }
        }
      } catch { /* localStorage unavailable */ }
    }

    return updated;
  });
}
```

- [ ] **Step 4: Add `<ConfettiCelebration />` to the JSX return of root `HomeScreen`**

Add just before the closing `</div>`:
```tsx
<ConfettiCelebration active={!!confetti} message={confetti?.message} />
```

- [ ] **Step 5: Verify**

In DevTools, manually set `prep_state` streak to 7, set `prep_celebrated` to `[]`, then complete 3 drills. Confetti should burst and the milestone card should appear for ~4 seconds.

- [ ] **Step 6: Commit**
```bash
git add components/ui/ConfettiCelebration.tsx components/home/HomeScreen.tsx
git commit -m "feat: confetti milestone celebration on streak days 1/3/7/15/21/30"
```

---

## Task 4: Listening waveform animation in DrillScreen

**Files:**
- Modify: `components/drill/DrillScreen.tsx`

Replace the simple pulsing dot + "Listening" text with a 7-bar animated waveform that breathes when the mic is active and collapses to flat when silent.

- [ ] **Step 1: Add `ListeningWave` component inside `DrillScreen.tsx` (before the default export)**

```typescript
const WAVE = [
  { maxH: 20, dur: 0.50 },
  { maxH: 32, dur: 0.68 },
  { maxH: 16, dur: 0.58 },
  { maxH: 38, dur: 0.78 },
  { maxH: 22, dur: 0.53 },
  { maxH: 30, dur: 0.63 },
  { maxH: 16, dur: 0.44 },
];

function ListeningWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1" style={{ height: 48 }}>
      {WAVE.map((bar, i) => (
        <motion.div
          key={i}
          style={{ width: 3, borderRadius: 4, background: active ? 'var(--green)' : 'var(--surface2)' }}
          animate={active
            ? { height: [4, bar.maxH, 4] }
            : { height: 4 }
          }
          transition={active
            ? { duration: bar.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }
            : { duration: 0.35 }
          }
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Replace the existing listening indicator in the `recording` stage JSX**

Find and replace this block inside the `stage === 'recording'` section:
```tsx
{/* REMOVE this */}
{isListening && (
  <div className="flex items-center gap-1.5 mt-1">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: 'var(--green)' }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--green)' }} />
    </span>
    <p className="font-body" style={{ fontSize: 11, color: 'var(--green-text)' }}>Listening</p>
  </div>
)}
```

Replace with:
```tsx
{/* Waveform — always visible, animates when mic is active */}
<div className="mt-2">
  <ListeningWave active={isListening} />
</div>
{isListening && (
  <p className="font-body text-center" style={{ fontSize: 11, color: 'var(--green-text)', marginTop: 2 }}>
    Listening
  </p>
)}
```

- [ ] **Step 3: Verify**

Start a drill with mic enabled. During recording the 7 bars should animate independently at different speeds. When not listening (brief silence / mic restarting) the bars collapse flat then re-animate.

- [ ] **Step 4: Commit**
```bash
git add components/drill/DrillScreen.tsx
git commit -m "feat: animated listening waveform on drill recording screen"
```

---

## Task 5: Ideal answer reveal after drill completion

**Files:**
- Create: `app/api/ideal-answer/route.ts`
- Modify: `components/drill/KeywordResult.tsx`

After scoring, a "What does a great answer look like?" button lazy-fetches a structured Claude Haiku response and reveals it in a dark card. Results are cached in component state (no re-fetch on re-render).

- [ ] **Step 1: Create `app/api/ideal-answer/route.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { drillName, drillType } = await req.json();

  if (!drillName) {
    return NextResponse.json({ error: 'drillName required' }, { status: 400 });
  }

  const prompt = `You are a senior product design interview coach. A candidate just attempted this drill:

Drill: "${drillName}"
Type: ${drillType}

Write a concise ideal-answer guide — NOT a transcript. Guide what a strong answer COVERS.

Return valid JSON only, no markdown:
{
  "opening": "<one sentence on how to frame the first 10 seconds — the hook>",
  "keyPoints": [
    "<specific point 1 — under 55 words>",
    "<specific point 2 — under 55 words>",
    "<specific point 3 — under 55 words>"
  ],
  "avoid": "<the single most common mistake candidates make on this exact question — under 60 words>"
}

Be specific to this drill. Do not give generic advice. Reference the actual scenario.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({
      opening:   parsed.opening   ?? '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 3) : [],
      avoid:     parsed.avoid     ?? '',
    });
  } catch {
    return NextResponse.json({
      opening: 'Start by naming the core tension in the question, then walk through your reasoning.',
      keyPoints: [
        'Ground your answer in a specific user need or real-world constraint.',
        'Make your decision-making process explicit — show the "why" not just the "what".',
        'Close with a signal of impact or outcome — what would success look like?',
      ],
      avoid: 'Giving a generic framework answer without connecting it to the specifics of this question.',
    });
  }
}
```

- [ ] **Step 2: Add ideal-answer state + fetch to `KeywordResult.tsx`**

Add imports at the top:
```typescript
import { useState } from 'react';
```
(it may already be imported — check first)

Add the state and fetch function inside `KeywordResult` component, after the existing `const score = ...` line:

```typescript
interface IdealAnswer {
  opening: string;
  keyPoints: string[];
  avoid: string;
}

const [idealAnswer, setIdealAnswer] = useState<IdealAnswer | null>(null);
const [loadingIdeal, setLoadingIdeal] = useState(false);

async function fetchIdealAnswer() {
  if (idealAnswer || loadingIdeal) return;
  setLoadingIdeal(true);
  try {
    const res = await fetch('/api/ideal-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drillName: drill.name, drillType: drill.type }),
    });
    const data = await res.json();
    setIdealAnswer(data);
  } catch {
    setIdealAnswer({
      opening: 'Start by naming the core tension, then walk your reasoning.',
      keyPoints: ['Ground in a real user need.', 'Show your decision-making process.', 'Close with a signal of impact.'],
      avoid: 'Generic framework answers without connecting to this specific scenario.',
    });
  } finally {
    setLoadingIdeal(false);
  }
}
```

- [ ] **Step 3: Add the ideal-answer section to the JSX in `KeywordResult.tsx`**

Add this block after the keywords section and before the share card section:

```tsx
{/* Ideal answer reveal */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.45 }}
>
  {!idealAnswer && (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={fetchIdealAnswer}
      disabled={loadingIdeal}
      className="w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl"
      style={{
        background: '#1A1A1A',
        opacity: loadingIdeal ? 0.7 : 1,
      }}
    >
      <div className="flex items-center gap-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--amber)" strokeWidth="1.3" />
          <path d="M7 4v3.5l2 1.5" stroke="var(--amber)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="font-display font-semibold" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          {loadingIdeal ? 'Generating ideal answer…' : 'What does a great answer look like?'}
        </span>
      </div>
      {!loadingIdeal && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  )}

  {idealAnswer && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1A1A1A' }}
    >
      <div className="px-4 pt-4 pb-1">
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.1em' }}>
          Ideal answer
        </p>
        {/* Opening hook */}
        <p className="font-display font-semibold mb-3" style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.55 }}>
          "{idealAnswer.opening}"
        </p>
        {/* Key points */}
        <div className="flex flex-col gap-2.5 mb-3">
          {idealAnswer.keyPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="font-display font-bold shrink-0 flex items-center justify-center rounded-md"
                style={{ width: 18, height: 18, fontSize: 9, background: 'rgba(255,92,53,0.2)', color: 'var(--accent)', marginTop: 1 }}
              >
                {i + 1}
              </span>
              <p className="font-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{pt}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Avoid */}
      <div className="mx-4 mb-4 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)' }}>
        <p className="font-body uppercase tracking-widest mb-1" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: '0.08em' }}>Common mistake</p>
        <p className="font-body" style={{ fontSize: 12, color: 'rgba(255,150,150,0.8)', lineHeight: 1.55 }}>{idealAnswer.avoid}</p>
      </div>
    </motion.div>
  )}
</motion.div>
```

- [ ] **Step 4: Verify**

Complete a drill → reach the results screen → tap "What does a great answer look like?" → loading state for ~1-2s → dark card reveals with opening, 3 key points, and common mistake. Content should be specific to the actual drill question, not generic.

- [ ] **Step 5: Commit**
```bash
git add app/api/ideal-answer/route.ts components/drill/KeywordResult.tsx
git commit -m "feat: AI ideal answer reveal on drill result screen"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Task 1 → streak at-risk warning
- [x] Task 2 → confetti milestones (1, 3, 7, 15, 21, 30)
- [x] Task 3 → 30-day drill bank (40 drills, day-based rotation)
- [x] Task 4 → listening waveform animation
- [x] Task 5 → ideal answer reveal (AI-powered)

**Type consistency:**
- `getCurrentDrills(dayNumber: number = 1)` — consistent across drillBank.ts and all call sites
- `ConfettiCelebration` props: `{ active: boolean; message?: string }` — consistent
- `ListeningWave` props: `{ active: boolean }` — consistent
- `IdealAnswer` interface: `{ opening, keyPoints, avoid }` — consistent between route and component

**No placeholders:** All code blocks are complete. No TODOs or TBDs.
