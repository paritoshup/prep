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

  const briefs   = ALL_DRILLS.filter(x => x.type === 'READ THE BRIEF');
  const visions  = ALL_DRILLS.filter(x => x.type === 'BUILD THE VISION');
  const dilemmas = ALL_DRILLS.filter(x => x.type === 'DESIGN DILEMMA');
  const owns     = ALL_DRILLS.filter(x => x.type === 'OWN THE CALL');

  const slot1 = d % 2 === 0
    ? briefs[Math.floor(d / 2) % briefs.length]
    : dilemmas[Math.floor(d / 2) % dilemmas.length];

  const slot2 = visions[d % visions.length];
  const slot3 = owns[d % owns.length];

  return [slot1, slot2, slot3].map((drill, i) => ({ ...drill, id: i + 1 }));
}
