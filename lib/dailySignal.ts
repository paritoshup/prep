// ─── Types ───────────────────────────────────────────────────────────────────

export interface DailySignal {
  id: number;
  source: string;
  headline: string;
  tag: string;
  summary: string;
}

// ─── Signal Bank ─────────────────────────────────────────────────────────────
// Rotates every 8 hours — cycles through the full bank.

const SIGNALS: DailySignal[] = [
  {
    id: 1,
    source: 'The Verge',
    headline: 'Apple is rebuilding Siri from scratch with a large language model core.',
    tag: 'AI · Product',
    summary: "Every product designer needs to understand what happens when voice UI meets LLM reasoning. Expect interview questions about conversational interfaces, fallback states, and trust-building UX — this is the new frontier.",
  },
  {
    id: 2,
    source: 'Mindstream',
    headline: "OpenAI's Canvas editor shows why AI needs a new interaction model — not a chatbox.",
    tag: 'AI · Design',
    summary: "The shift from prompt-response to collaborative editing is a design problem, not just an engineering one. Be ready to speak about how you'd design AI tools that feel like a partner, not a tool.",
  },
  {
    id: 3,
    source: 'Superhuman · Zain Kahn',
    headline: "Agents are replacing workflows. Here's what PMs and designers need to know.",
    tag: 'AI · Strategy',
    summary: "Autonomous agents mean users no longer do tasks — they set goals. This flips the entire UX model. Prepare to discuss how you design for outcomes instead of flows, and how you surface agent status without overwhelming users.",
  },
  {
    id: 4,
    source: 'The Verge',
    headline: "Google's NotebookLM is becoming a product design case study in retention.",
    tag: 'Product · Growth',
    summary: "When a tool makes users feel smarter, they come back. NotebookLM's audio overview feature is a masterclass in unexpected delight. Think about where in your designs you create that moment of surprise.",
  },
  {
    id: 5,
    source: 'Mindstream',
    headline: "Figma's AI features are changing how teams hand off designs to engineers.",
    tag: 'Design · Tooling',
    summary: "Auto-annotations, variable suggestions, and AI-written component docs are shifting what design handoff looks like. In a design round, you should be able to speak to how you keep dev collaboration tight as tooling evolves.",
  },
  {
    id: 6,
    source: 'Superhuman · Zain Kahn',
    headline: "The companies winning with AI aren't using it to cut headcount — they're using it to ship faster.",
    tag: 'AI · Leadership',
    summary: "Speed is the new moat. Interviewers are increasingly asking how you use AI in your design process — from research synthesis to rapid prototyping. Have a concrete, honest answer ready.",
  },
  {
    id: 7,
    source: 'The Verge',
    headline: "Meta's Ray-Ban AI glasses sold out again. Ambient computing is real.",
    tag: 'Hardware · UX',
    summary: "Designing for ambient interfaces means rethinking every assumption about screen, touch, and attention. If you're interviewing at a company touching hardware, AR, or wearables — this is the context you need.",
  },
  {
    id: 8,
    source: 'Mindstream',
    headline: 'Perplexity hits 100M queries/day — and none of them look like a Google search.',
    tag: 'AI · Search',
    summary: "The query-to-answer shift is changing traditional IA models. As a designer, you need a perspective on how discoverability, trust, and citations change when search becomes conversational.",
  },
  {
    id: 9,
    source: 'Superhuman · Zain Kahn',
    headline: 'The rise of "vibe coding" is making non-engineers into product builders.',
    tag: 'AI · Culture',
    summary: "Designers who can build prototypes with AI-assisted code are becoming the most valuable people in the room. This isn't about replacing engineers — it's about shortening the gap between idea and reality.",
  },
  {
    id: 10,
    source: 'The Verge',
    headline: 'Anthropic launches Claude for Work — and enterprises are switching fast.',
    tag: 'AI · Enterprise',
    summary: "B2B AI products have different design requirements: trust, auditability, and role-based access matter more than delight. If you're interviewing for enterprise-facing roles, understand how these constraints shape your decisions.",
  },
  {
    id: 11,
    source: 'Mindstream',
    headline: "Dark patterns are getting an EU crackdown — here's what designers need to know.",
    tag: 'Design · Policy',
    summary: "Regulatory literacy is becoming a design skill. Knowing what counts as a deceptive pattern — and how to push back on PMs who want to add them — is now a real interview topic, especially in fintech and health.",
  },
  {
    id: 12,
    source: 'Superhuman · Zain Kahn',
    headline: 'The best AI product launches of this quarter all had one thing in common: taste.',
    tag: 'Product · AI',
    summary: "Technical capability is table stakes. What separates good AI products is editorial judgment — what the AI says, when it says it, and when it stays quiet. This is a design and product problem, not an ML problem.",
  },
];

// ─── Rotation Logic ───────────────────────────────────────────────────────────

export function getCurrentSignal(): DailySignal {
  const INTERVAL_MS = 8 * 60 * 60 * 1000; // 8 hours
  const windowIndex = Math.floor(Date.now() / INTERVAL_MS);
  const index = windowIndex % SIGNALS.length;
  return SIGNALS[index];
}
