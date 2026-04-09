// ─── Types ───────────────────────────────────────────────────────────────────

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: 'Design' | 'AI' | 'Product' | 'Process';
}

// ─── Question Bank ────────────────────────────────────────────────────────────

const QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    category: 'Design',
    question: "A user says your product is 'confusing'. What's the most useful next step?",
    options: [
      { id: 'A', text: 'Redesign the UI immediately' },
      { id: 'B', text: 'Ask them to show you where they got stuck' },
      { id: 'C', text: 'Add a tooltip to every button' },
      { id: 'D', text: 'Run an A/B test' },
    ],
    correct: 'B',
    explanation: "'Confusing' is a symptom, not a diagnosis. Watching someone get stuck tells you more than any redesign assumption.",
  },
  {
    id: 2,
    category: 'AI',
    question: "An AI gives a confident but wrong answer. What's the biggest design failure here?",
    options: [
      { id: 'A', text: 'The model accuracy is too low' },
      { id: 'B', text: 'The UI made the answer look trustworthy without showing uncertainty' },
      { id: 'C', text: 'There was no loading state' },
      { id: 'D', text: 'The font was too small' },
    ],
    correct: 'B',
    explanation: "Confidence calibration is a design problem. If the UI presents all answers equally, users can't tell when to trust the AI.",
  },
  {
    id: 3,
    category: 'Product',
    question: "You have 3 features to build and 1 sprint. How do you choose?",
    options: [
      { id: 'A', text: 'Build the one the CEO asked for' },
      { id: 'B', text: 'Build the easiest one to ship fast' },
      { id: 'C', text: 'Build the one with highest impact relative to effort' },
      { id: 'D', text: 'Build all three but smaller' },
    ],
    correct: 'C',
    explanation: "Impact-to-effort ratio is the foundation of good prioritisation. Easiest or loudest stakeholder rarely = most valuable.",
  },
  {
    id: 4,
    category: 'Design',
    question: "What does 'affordance' mean in UX design?",
    options: [
      { id: 'A', text: 'How much a product costs to build' },
      { id: 'B', text: 'A visual cue that tells users how to interact with something' },
      { id: 'C', text: 'The number of features a product has' },
      { id: 'D', text: 'How fast a page loads' },
    ],
    correct: 'B',
    explanation: "Affordances signal action — a button looks tappable, a handle looks graspable. Good design makes affordances obvious.",
  },
  {
    id: 5,
    category: 'AI',
    question: "When should an AI product ask the user for confirmation before acting?",
    options: [
      { id: 'A', text: 'Always — safety first' },
      { id: 'B', text: 'Never — it slows down the experience' },
      { id: 'C', text: "When the action is hard to reverse or high-stakes" },
      { id: 'D', text: 'Only when the user is new' },
    ],
    correct: 'C',
    explanation: "Confirmation friction should match action reversibility. Deleting files, sending emails, spending money — these warrant a pause. Everything else should flow.",
  },
  {
    id: 6,
    category: 'Process',
    question: "A stakeholder wants to skip user research to ship faster. You should:",
    options: [
      { id: 'A', text: 'Agree — speed is more important than research' },
      { id: 'B', text: 'Do the research anyway without telling them' },
      { id: 'C', text: 'Propose a lightweight research method that fits the timeline' },
      { id: 'D', text: 'Escalate to your manager' },
    ],
    correct: 'C',
    explanation: "Research doesn't have to be a 4-week study. A 3-user hallway test, 5 recorded sessions, or a quick survey can all reduce risk within tight timelines.",
  },
  {
    id: 7,
    category: 'Design',
    question: "Which layout principle makes mobile interfaces easiest to use one-handed?",
    options: [
      { id: 'A', text: 'Centering all content' },
      { id: 'B', text: 'Placing primary actions in the bottom third of the screen' },
      { id: 'C', text: 'Using smaller touch targets to fit more on screen' },
      { id: 'D', text: 'Adding a floating action button at the top right' },
    ],
    correct: 'B',
    explanation: "Thumb reach zones matter. Primary actions in the bottom third are reachable without repositioning your grip — this is why most nav bars live there.",
  },
  {
    id: 8,
    category: 'AI',
    question: "What's the term for AI outputs that sound plausible but are factually wrong?",
    options: [
      { id: 'A', text: 'Bias' },
      { id: 'B', text: 'Overfitting' },
      { id: 'C', text: 'Hallucination' },
      { id: 'D', text: 'Prompt injection' },
    ],
    correct: 'C',
    explanation: "Hallucinations are confident errors. They're a core design constraint — your UI must help users identify and verify AI claims, not just present them.",
  },
  {
    id: 9,
    category: 'Product',
    question: "What's the best definition of product-market fit?",
    options: [
      { id: 'A', text: 'When your app gets featured in the App Store' },
      { id: 'B', text: "When users would be very disappointed if your product disappeared" },
      { id: 'C', text: 'When you reach 1 million users' },
      { id: 'D', text: 'When your NPS score is above 50' },
    ],
    correct: 'B',
    explanation: "Sean Ellis's test — 40%+ of users saying they'd be 'very disappointed' if the product went away — is still the most honest measure of PMF.",
  },
  {
    id: 10,
    category: 'Design',
    question: "You're designing for a screen reader user. Which matters most?",
    options: [
      { id: 'A', text: 'High contrast colours' },
      { id: 'B', text: 'Semantic HTML and meaningful aria-labels' },
      { id: 'C', text: 'Large font sizes' },
      { id: 'D', text: 'Smooth animations' },
    ],
    correct: 'B',
    explanation: "Screen readers parse structure and labels, not visuals. Semantic markup and descriptive aria-labels are the foundation of accessible design.",
  },
  {
    id: 11,
    category: 'AI',
    question: "A user asks your AI a question it can't answer well. Best response?",
    options: [
      { id: 'A', text: 'Make up a plausible-sounding answer' },
      { id: 'B', text: "Say 'I don't know' and suggest alternatives" },
      { id: 'C', text: 'Redirect to a FAQ page' },
      { id: 'D', text: 'Ask them to rephrase the question 3 times' },
    ],
    correct: 'B',
    explanation: "Admitting uncertainty builds trust. An AI that says 'I'm not sure — here's where to find out' is more trustworthy than one that confidently guesses.",
  },
  {
    id: 12,
    category: 'Product',
    question: "What does 'north star metric' mean?",
    options: [
      { id: 'A', text: 'The KPI your investors care about most' },
      { id: 'B', text: 'The single metric that best captures your product delivering value to users' },
      { id: 'C', text: 'Monthly active users' },
      { id: 'D', text: 'The metric that went up last quarter' },
    ],
    correct: 'B',
    explanation: "North star metrics reflect user value, not business extraction. Spotify's is time listening. Airbnb's is nights booked. It aligns teams around what actually matters.",
  },
  {
    id: 13,
    category: 'Design',
    question: "When is it okay to break established design patterns?",
    options: [
      { id: 'A', text: 'Whenever you want to be creative' },
      { id: 'B', text: 'When user research shows a better solution for your specific context' },
      { id: 'C', text: 'When your designer thinks it looks better' },
      { id: 'D', text: 'Never — always follow patterns' },
    ],
    correct: 'B',
    explanation: "Patterns exist to reduce cognitive load. Break them only when you have evidence that a different approach better serves your users — not for novelty.",
  },
  {
    id: 14,
    category: 'AI',
    question: "What does 'retrieval-augmented generation' (RAG) let AI products do?",
    options: [
      { id: 'A', text: 'Generate images from text' },
      { id: 'B', text: 'Answer questions using your own documents and data' },
      { id: 'C', text: 'Run faster on mobile devices' },
      { id: 'D', text: 'Translate between programming languages' },
    ],
    correct: 'B',
    explanation: "RAG lets AI ground answers in your specific data — company docs, knowledge bases, live content. It's how enterprise AI products stay accurate and relevant.",
  },
  {
    id: 15,
    category: 'Process',
    question: "What's the right time to involve engineers in the design process?",
    options: [
      { id: 'A', text: 'Only after designs are fully approved' },
      { id: 'B', text: 'During final handoff' },
      { id: 'C', text: 'Early — during problem definition and ideation' },
      { id: 'D', text: "When the design doesn't look good enough" },
    ],
    correct: 'C',
    explanation: "Early engineering involvement surfaces constraints before they become blockers. The best products come from design and engineering thinking together, not in sequence.",
  },
  {
    id: 16,
    category: 'Design',
    question: "What is 'progressive disclosure' in UX?",
    options: [
      { id: 'A', text: 'Showing all features upfront so users know what exists' },
      { id: 'B', text: 'Revealing complexity gradually as users need it' },
      { id: 'C', text: 'Hiding settings behind multiple taps' },
      { id: 'D', text: 'Onboarding users with a tutorial video' },
    ],
    correct: 'B',
    explanation: "Progressive disclosure keeps interfaces simple by showing only what's needed now. It respects novice users while not limiting experts — a balance most great products get right.",
  },
  {
    id: 17,
    category: 'AI',
    question: "Why is 'explainability' important in AI product design?",
    options: [
      { id: 'A', text: "It makes the AI run faster" },
      { id: 'B', text: 'It helps users understand why the AI made a decision, building trust' },
      { id: 'C', text: 'It reduces the cost of model training' },
      { id: 'D', text: 'It is only needed for enterprise products' },
    ],
    correct: 'B',
    explanation: "When users understand why an AI recommended something, they can judge whether to trust it. Unexplained AI decisions feel arbitrary and erode confidence over time.",
  },
  {
    id: 18,
    category: 'Product',
    question: "What is a 'jobs to be done' framework?",
    options: [
      { id: 'A', text: 'A hiring process for product teams' },
      { id: 'B', text: 'A way to understand what users are trying to accomplish, not just what they click' },
      { id: 'C', text: 'A sprint planning methodology' },
      { id: 'D', text: 'A framework for writing job descriptions' },
    ],
    correct: 'B',
    explanation: "JTBD shifts focus from features to motivations. People don't buy a drill — they buy a hole in the wall. Understanding the job changes what you design entirely.",
  },
  {
    id: 19,
    category: 'Design',
    question: "What does a 'design system' primarily solve?",
    options: [
      { id: 'A', text: 'Making designs look more beautiful' },
      { id: 'B', text: 'Consistency and speed across a product at scale' },
      { id: 'C', text: 'Replacing the need for designers' },
      { id: 'D', text: 'Managing design file versions' },
    ],
    correct: 'B',
    explanation: "Design systems are force multipliers — they let teams move fast without breaking consistency. They solve the coordination problem that emerges as products and teams grow.",
  },
  {
    id: 20,
    category: 'AI',
    question: "What is a 'prompt' in the context of large language models?",
    options: [
      { id: 'A', text: 'A keyboard shortcut' },
      { id: 'B', text: 'The input text you give to an AI model to generate a response' },
      { id: 'C', text: 'A type of model architecture' },
      { id: 'D', text: 'A security vulnerability in AI systems' },
    ],
    correct: 'B',
    explanation: "Prompts are how you instruct LLMs. Prompt engineering — crafting inputs that reliably produce useful outputs — is now a core skill for AI product designers.",
  },
  {
    id: 21,
    category: 'Process',
    question: "What is the 'double diamond' design process?",
    options: [
      { id: 'A', text: 'A two-sprint delivery model' },
      { id: 'B', text: 'Diverge to understand the problem, converge to define it, diverge to explore solutions, converge to deliver' },
      { id: 'C', text: 'A method for running A/B tests' },
      { id: 'D', text: 'A stakeholder alignment framework' },
    ],
    correct: 'B',
    explanation: "The double diamond captures design thinking: explore broadly, then focus. Most teams skip the first diamond (problem exploration) and jump straight to solutions.",
  },
  {
    id: 22,
    category: 'Product',
    question: "What does DAU/MAU ratio measure?",
    options: [
      { id: 'A', text: 'Revenue per user' },
      { id: 'B', text: 'How sticky a product is — how often monthly users return daily' },
      { id: 'C', text: 'App store rating' },
      { id: 'D', text: 'Cost per acquisition' },
    ],
    correct: 'B',
    explanation: "A high DAU/MAU means users come back often. Facebook targets 60%+. It tells you whether people find daily value in your product — not just whether they signed up.",
  },
  {
    id: 23,
    category: 'AI',
    question: "What is 'fine-tuning' in the context of AI models?",
    options: [
      { id: 'A', text: 'Adjusting the UI to look better' },
      { id: 'B', text: 'Training a pre-trained model further on specific data to improve it for a particular task' },
      { id: 'C', text: 'Reducing model file size for mobile' },
      { id: 'D', text: 'Adding more parameters to a model' },
    ],
    correct: 'B',
    explanation: "Fine-tuning lets companies customise foundation models for their domain without training from scratch. It's how AI products get specialised behaviour — like a legal AI that speaks like a lawyer.",
  },
  {
    id: 24,
    category: 'Design',
    question: "What is the primary goal of usability testing?",
    options: [
      { id: 'A', text: 'To validate that your design looks good' },
      { id: 'B', text: "To observe real users attempting real tasks and discover where they struggle" },
      { id: 'C', text: 'To get approval from stakeholders' },
      { id: 'D', text: 'To benchmark against competitors' },
    ],
    correct: 'B',
    explanation: "Usability testing is about observation, not validation. You're not looking for praise — you're looking for friction. Even 5 users will surface 85% of major issues.",
  },
  {
    id: 25,
    category: 'AI',
    question: "What problem does 'context window' refer to in LLMs?",
    options: [
      { id: 'A', text: 'How many users can access the AI at once' },
      { id: 'B', text: 'The amount of text the model can consider at one time when generating a response' },
      { id: 'C', text: 'The geographic region where the AI is hosted' },
      { id: 'D', text: 'The memory usage of the model on a server' },
    ],
    correct: 'B',
    explanation: "Context window limits how much the AI 'remembers' in one conversation. Designing for this means thinking about what information is most critical to keep in context.",
  },
  {
    id: 26,
    category: 'Product',
    question: "What is a 'wizard of oz' prototype?",
    options: [
      { id: 'A', text: 'A fully coded prototype' },
      { id: 'B', text: 'A test where a human simulates AI or system behaviour behind the scenes to test user reactions' },
      { id: 'C', text: 'A gamified onboarding experience' },
      { id: 'D', text: 'A prototype that uses real data' },
    ],
    correct: 'B',
    explanation: "Wizard of Oz prototyping lets you test AI or complex system concepts before building them. A human 'plays' the AI while users interact naturally — cheap, fast, revealing.",
  },
  {
    id: 27,
    category: 'Design',
    question: "Which Gestalt principle explains why items close together feel related?",
    options: [
      { id: 'A', text: 'Similarity' },
      { id: 'B', text: 'Continuity' },
      { id: 'C', text: 'Proximity' },
      { id: 'D', text: 'Closure' },
    ],
    correct: 'C',
    explanation: "Proximity is why labels sit next to fields, why nav items cluster, and why whitespace creates sections. It's one of the most-used Gestalt principles in UI layout.",
  },
  {
    id: 28,
    category: 'AI',
    question: "What is 'multimodal AI'?",
    options: [
      { id: 'A', text: 'AI that works across multiple devices' },
      { id: 'B', text: 'AI that can understand and generate multiple types of content — text, images, audio, video' },
      { id: 'C', text: 'AI that runs in multiple programming languages' },
      { id: 'D', text: 'AI that supports multiple user accounts' },
    ],
    correct: 'B',
    explanation: "Multimodal models like GPT-4o can reason across text, images, and audio simultaneously. This opens entirely new design spaces — and entirely new failure modes.",
  },
  {
    id: 29,
    category: 'Process',
    question: "What is a 'how might we' statement used for in design?",
    options: [
      { id: 'A', text: 'Defining acceptance criteria for engineers' },
      { id: 'B', text: 'Reframing a problem as an opportunity to invite creative solutions' },
      { id: 'C', text: 'Writing user stories for the backlog' },
      { id: 'D', text: 'Summarising user research findings' },
    ],
    correct: 'B',
    explanation: "'How might we...' statements open up solution space without prescribing answers. They turn problems into design invitations — a staple of design thinking sprints.",
  },
  {
    id: 30,
    category: 'Design',
    question: "What does 'information architecture' mean?",
    options: [
      { id: 'A', text: 'The visual hierarchy of a single screen' },
      { id: 'B', text: 'The structure, organisation, and labelling of content across a product' },
      { id: 'C', text: 'The data model behind a product' },
      { id: 'D', text: 'The way a product stores user information' },
    ],
    correct: 'B',
    explanation: "IA is the skeleton of a product. Bad IA means users can't find what they need even if the UI looks great. It covers navigation, categories, labels, and search.",
  },
];

// ─── Rotation ─────────────────────────────────────────────────────────────────
// Returns 7 questions for the current 4-hour window.

export function getCurrentMCQQuestions(): MCQQuestion[] {
  const INTERVAL_MS = 4 * 60 * 60 * 1000;
  const BATCH_SIZE = 7;
  const windowIndex = Math.floor(Date.now() / INTERVAL_MS);
  const startIndex = (windowIndex * BATCH_SIZE) % QUESTIONS.length;

  const result: MCQQuestion[] = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    result.push(QUESTIONS[(startIndex + i) % QUESTIONS.length]);
  }
  return result;
}
