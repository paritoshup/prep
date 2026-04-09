// ─── Types ───────────────────────────────────────────────────────────────────

export interface RapidFireQuestion {
  id: number;
  question: string;
  category: 'Product' | 'Design' | 'AI' | 'Process' | 'Soft Skills';
}

// ─── Question Bank ────────────────────────────────────────────────────────────
// 5 questions surface every 8 hours, rotating through the full bank.

const QUESTIONS: RapidFireQuestion[] = [
  // Product
  { id: 1,  category: 'Product',     question: "What's the difference between a feature and a product?" },
  { id: 2,  category: 'Product',     question: "How do you decide what NOT to build?" },
  { id: 3,  category: 'Product',     question: "Walk me through how you'd prioritise a backlog with no data." },
  { id: 4,  category: 'Product',     question: "What makes a 0-to-1 product different to a scaled one?" },
  { id: 5,  category: 'Product',     question: "How do you know when a product is ready to ship?" },
  { id: 6,  category: 'Product',     question: "Describe a time you killed a feature you loved. Why?" },
  { id: 7,  category: 'Product',     question: "What's the first thing you do when you join a new product team?" },
  { id: 8,  category: 'Product',     question: "How do you validate a hypothesis without building anything?" },
  { id: 9,  category: 'Product',     question: "What's your definition of product-market fit?" },
  { id: 10, category: 'Product',     question: "How would you redesign the onboarding for a product you use daily?" },

  // Design
  { id: 11, category: 'Design',      question: 'What does "good design" mean to you in one sentence?' },
  { id: 12, category: 'Design',      question: "How do you design for someone you can't interview?" },
  { id: 13, category: 'Design',      question: "Walk me through a design decision that failed. What did you learn?" },
  { id: 14, category: 'Design',      question: "How do you push back on a stakeholder who wants a bad UX?" },
  { id: 15, category: 'Design',      question: "What's the most underrated design principle?" },
  { id: 16, category: 'Design',      question: 'How do you decide when a design is "done enough"?' },
  { id: 17, category: 'Design',      question: "Explain your design process in under 60 seconds." },
  { id: 18, category: 'Design',      question: "How do you balance aesthetics with usability?" },
  { id: 19, category: 'Design',      question: "What's a design pattern you dislike? Why does it exist anyway?" },
  { id: 20, category: 'Design',      question: "How do you present a design to engineers vs. executives?" },

  // AI
  { id: 21, category: 'AI',          question: "What UX problems does AI create that it can't solve itself?" },
  { id: 22, category: 'AI',          question: "How do you design for AI errors without breaking user trust?" },
  { id: 23, category: 'AI',          question: "What's the difference between a feature powered by AI and an AI product?" },
  { id: 24, category: 'AI',          question: "When should a product NOT use AI?" },
  { id: 25, category: 'AI',          question: "How do you design for AI outputs that are probabilistic, not deterministic?" },
  { id: 26, category: 'AI',          question: 'What does "human in the loop" mean in a design context?' },
  { id: 27, category: 'AI',          question: "How would you explain AI limitations to a non-technical stakeholder?" },
  { id: 28, category: 'AI',          question: "Design a feature that uses AI but hides it completely from the user." },
  { id: 29, category: 'AI',          question: "What's the most important trust signal in an AI-powered product?" },
  { id: 30, category: 'AI',          question: 'How do you handle the "uncanny valley" in AI-generated content?' },

  // Process
  { id: 31, category: 'Process',     question: "How do you run a design critique without it becoming a popularity contest?" },
  { id: 32, category: 'Process',     question: "What's your approach to research synthesis?" },
  { id: 33, category: 'Process',     question: "How do you keep design consistent across a growing team?" },
  { id: 34, category: 'Process',     question: "Walk me through how you handle conflicting feedback from two stakeholders." },
  { id: 35, category: 'Process',     question: "How do you know when to do more research vs. just ship and learn?" },
  { id: 36, category: 'Process',     question: "What does your design handoff process look like?" },
  { id: 37, category: 'Process',     question: "How do you document design decisions so future-you understands them?" },
  { id: 38, category: 'Process',     question: "How do you keep momentum in a long, ambiguous project?" },

  // Soft Skills
  { id: 39, category: 'Soft Skills', question: "Tell me about a time you changed your mind after getting feedback." },
  { id: 40, category: 'Soft Skills', question: "How do you communicate a design decision you're not confident in?" },
  { id: 41, category: 'Soft Skills', question: "What do you do when you disagree with your manager's product call?" },
  { id: 42, category: 'Soft Skills', question: "Describe your relationship with ambiguity in one story." },
  { id: 43, category: 'Soft Skills', question: "How do you give feedback to a designer whose work isn't landing?" },
  { id: 44, category: 'Soft Skills', question: 'What\'s the hardest "no" you\'ve ever said at work?' },
  { id: 45, category: 'Soft Skills', question: "How do you earn trust with a new engineering team?" },
];

// ─── Rotation Logic ───────────────────────────────────────────────────────────
// Returns 5 questions for the current 8-hour window.
// Each window gets a distinct, non-repeating set until the bank cycles.

export function getCurrentQuestions(): RapidFireQuestion[] {
  const INTERVAL_MS = 8 * 60 * 60 * 1000; // 8 hours
  const BATCH_SIZE = 5;
  const windowIndex = Math.floor(Date.now() / INTERVAL_MS);
  const startIndex = (windowIndex * BATCH_SIZE) % QUESTIONS.length;

  // Wrap-around slice so we always get exactly BATCH_SIZE questions
  const result: RapidFireQuestion[] = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    result.push(QUESTIONS[(startIndex + i) % QUESTIONS.length]);
  }
  return result;
}
