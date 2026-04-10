import type { Drill } from './mockData';

// ─── Full drill bank ──────────────────────────────────────────────────────────
// 18 drills across 3 types, rotating in sets of 3 every 12 hours.

const ALL_DRILLS: Omit<Drill, 'id'>[] = [
  // ── READ THE BRIEF ────────────────────────────────────────────────────────
  {
    type: 'READ THE BRIEF',
    name: "You're asked to redesign AI search. What's your first question?",
    description: "Before opening Figma, what do you need to know? Speak your answer out loud.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "A PM says 'make it more intuitive.' What does that mean?",
    description: "Push back on vague briefs. Show how you reframe the ask before designing.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "Users are dropping off at step 3. What do you do first?",
    description: "Don't jump to solutions. Walk through exactly what you'd investigate.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "The brief says: build an AI onboarding. What's missing from that?",
    description: "Spot what the brief doesn't say. The best designers ask what others skip.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "Design a feature for a billion people. Where do you even start?",
    description: "Scope the unscopeable. Show how you'd break down an impossible brief.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
  },
  {
    type: 'READ THE BRIEF',
    name: "The team wants to add AI everywhere. What would you push back on?",
    description: "Not every problem needs AI. Speak to your criteria for when it earns its place.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
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
    name: "How would you redesign Google search for 2026?",
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

  // ── DESIGN DILEMMA ───────────────────────────────────────────────────────
  {
    type: 'DESIGN DILEMMA',
    name: "Two users want opposite things. Who do you design for?",
    description: "There's no right answer — only a well-reasoned one. Make your call.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Ship fast with tech debt, or slow with clean foundations?",
    description: "Context changes everything. What factors would tip your decision?",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "The data says one thing. Your gut says another. What wins?",
    description: "Both can be right. Walk through how you'd resolve the tension.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Your most-used feature is also your most confusing. Now what?",
    description: "Redesigning it means breaking familiarity. How do you approach that?",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "You have 3 days to ship. What gets cut and what stays?",
    description: "Prioritisation under pressure is a core design skill. Show it.",
    meta: { mode: 'Mic only', duration: '30s', color: 'accent' },
    active: true,
  },
  {
    type: 'DESIGN DILEMMA',
    name: "Accessibility improvement vs. a feature 80% of users want. Pick one.",
    description: "No easy answer. Make your reasoning explicit.",
    meta: { mode: 'Mic only', duration: '45s', color: 'accent' },
    active: true,
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
    name: "You disagreed with the PM's decision and you were right. How do you handle it?",
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
];

// ─── Rotation ─────────────────────────────────────────────────────────────────
// Every 12 hours, pick a new set of 3 drills (one per type).
// Cycles through the bank ensuring variety.

export function getCurrentDrills(): Drill[] {
  const INTERVAL_MS = 12 * 60 * 60 * 1000;
  const windowIndex = Math.floor(Date.now() / INTERVAL_MS);

  const briefDrills   = ALL_DRILLS.filter(d => d.type === 'READ THE BRIEF');
  const visionDrills  = ALL_DRILLS.filter(d => d.type === 'BUILD THE VISION');
  const ownDrills     = ALL_DRILLS.filter(d => d.type === 'OWN THE CALL');
  const dilemmaDrills = ALL_DRILLS.filter(d => d.type === 'DESIGN DILEMMA');

  // Slot 1: alternate between READ THE BRIEF and DESIGN DILEMMA every window
  const usesDilemma = windowIndex % 3 === 2; // every 3rd window is a dilemma
  const firstPool = usesDilemma ? dilemmaDrills : briefDrills;
  const first  = firstPool[windowIndex % firstPool.length];
  const vision = visionDrills[windowIndex % visionDrills.length];
  const own    = ownDrills[windowIndex   % ownDrills.length];

  return [first, vision, own].map((d, i) => ({ ...d, id: i + 1 }));
}
