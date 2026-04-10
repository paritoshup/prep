import { NextResponse } from 'next/server';

export const revalidate = 28800; // 8 hours

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  tag: string;
}

const FEEDS = [
  {
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    source: 'The Verge',
    tag: 'AI · Product',
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    source: 'TechCrunch',
    tag: 'AI · Tech',
  },
  {
    url: 'https://www.wired.com/feed/category/design/latest/rss',
    source: 'Wired',
    tag: 'Design · Culture',
  },
  {
    url: 'https://www.technologyreview.com/feed/',
    source: 'MIT Tech Review',
    tag: 'AI · Research',
  },
  {
    url: 'https://www.fastcompany.com/technology/rss',
    source: 'Fast Company',
    tag: 'Tech · Innovation',
  },
  {
    url: 'https://www.fastcompany.com/section/design/rss',
    source: 'Fast Company',
    tag: 'Design · Innovation',
  },
  {
    url: 'https://www.reddit.com/r/userexperience/top/.rss?t=week&limit=10',
    source: 'r/userexperience',
    tag: 'Community · UX',
  },
  {
    url: 'https://www.reddit.com/r/ProductManagement/top/.rss?t=week&limit=10',
    source: 'r/ProductManagement',
    tag: 'Community · Product',
  },
];

// Minimal RSS XML parser — no external deps
function parseRSS(xml: string, source: string, tag: string): FeedItem[] {
  const items: FeedItem[] = [];

  // Match <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link') || extractAttr(block, 'link', 'href');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published');

    if (title && link) {
      items.push({ title, link, pubDate, source, sourceUrl: link, tag });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return match ? match[1].trim().replace(/<[^>]+>/g, '') : '';
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]+${attr}="([^"]+)"`, 'i'));
  return match ? match[1] : '';
}

// Score an item for relevance to design + AI careers
function relevanceScore(title: string): number {
  const keywords = [
    'ai', 'design', 'product', 'ux', 'interface', 'model', 'gpt', 'llm',
    'figma', 'anthropic', 'openai', 'google', 'apple', 'agent', 'workflow',
    'tool', 'feature', 'launch', 'startup', 'billion', 'future', 'build',
    'innovation', 'hire', 'portfolio', 'interview', 'stakeholder', 'research',
  ];
  const lower = title.toLowerCase();
  return keywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}

export async function GET() {
  const results: FeedItem[] = [];

  await Promise.allSettled(
    FEEDS.map(async ({ url, source, tag }) => {
      try {
        const res = await fetch(url, {
          next: { revalidate: 28800 },
          headers: { 'User-Agent': 'PrepApp/1.0' },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return;
        const xml = await res.text();
        const items = parseRSS(xml, source, tag);
        results.push(...items.slice(0, 5)); // top 5 per feed
      } catch {
        // feed unavailable — skip silently
      }
    })
  );

  if (results.length === 0) {
    // Fallback to curated content if all feeds fail
    return NextResponse.json({ item: FALLBACK, fromCache: false, live: false });
  }

  // Sort by relevance score, then recency
  const ranked = results.sort((a, b) => {
    const scoreDiff = relevanceScore(b.title) - relevanceScore(a.title);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const top = ranked[0];

  const { gist, summary } = generateSummary(top.title, top.source);

  return NextResponse.json({
    item: {
      source: top.source,
      headline: top.title,
      tag: top.tag,
      link: top.link,
      gist,
      summary,
    },
    live: true,
  });
}

function generateSummary(title: string, source: string): { gist: string; summary: string } {
  const lower = title.toLowerCase();

  // Reddit community threads — practitioner perspective
  if (source.startsWith('r/')) {
    if (lower.includes('hire') || lower.includes('job') || lower.includes('interview') || lower.includes('portfolio')) {
      return {
        gist: "Practitioners are debating what actually gets people hired right now — worth knowing before your interview.",
        summary: "Reddit's UX and PM communities are unusually honest about hiring signals — what portfolios actually get looked at, what interviewers are really evaluating, and what candidates keep getting wrong. This thread is a direct window into how hiring managers think. Read it as prep material, not just industry gossip. What are the recurring complaints? What do the successful candidates have in common? Bring that awareness into your next interview.",
      };
    }
    if (lower.includes('ai') || lower.includes('tool') || lower.includes('figma') || lower.includes('workflow')) {
      return {
        gist: "Practitioners are sharing real reactions to AI in their workflows — not vendor marketing, actual day-to-day impact.",
        summary: "When designers and PMs discuss AI tools on Reddit, you get unfiltered signal: what's genuinely saving time, what's overhyped, and where people are genuinely worried about their role. That practitioner perspective is exactly what interviewers want to see — not a recitation of feature lists, but an opinion grounded in how real work gets done. Read this thread and form a point of view you can defend.",
      };
    }
    if (lower.includes('stakeholder') || lower.includes('feedback') || lower.includes('pushback') || lower.includes('convince')) {
      return {
        gist: "Someone in the community hit a real friction point — and the responses are a masterclass in professional navigation.",
        summary: "The most useful interview prep isn't practice questions — it's reading how experienced practitioners handle messy situations. Stakeholder conflict, design pushback, research that gets ignored — these threads are full of hard-won tactics. When you're asked 'tell me about a time you had to convince a stakeholder', a specific framework beats a vague story. These discussions give you language and structure for real answers.",
      };
    }
    return {
      gist: "A real conversation from practitioners in the field — the kind of thinking that separates candidates who've been in the room from those who haven't.",
      summary: "Community discussions like this one surface the unwritten rules of the industry — the things that don't make it into job descriptions or design blogs. Reading what experienced UX and product people are actually wrestling with gives you a more honest picture of the role than any course or book. Go in with a question: what does this tell me about what the job is really like? What would I have done differently?",
    };
  }

  if (lower.includes('agent') || lower.includes('agentic')) {
    return {
      gist: "AI agents don't just answer questions — they take actions. That changes what 'user control' means in a product.",
      summary: "Autonomous agents are rewriting the design brief entirely. Users set goals, not tasks — which means your interface needs to communicate intent, status, and failure in ways current patterns weren't built for. In a design round, be ready to walk through how you'd design an agent-powered feature: what does the user see while it's working? What happens when it gets it wrong? How do you keep users in control without burdening them with every decision? Companies building in this space are actively hiring for this exact thinking.",
    };
  }
  if (lower.includes('figma') || lower.includes('design tool')) {
    return {
      gist: "Your design tools are changing faster than your process. Knowing why matters more than knowing the shortcuts.",
      summary: "Figma and its competitors are racing to embed AI into every step of the design workflow — from research synthesis to auto-layout, component generation, and handoff. The risk isn't that tools get smarter. It's that designers who can't articulate when to use AI and when not to will be outpaced by those who can. In your interview, don't just mention Figma — speak to how your process adapts when the tools change, and what you keep doing manually and why.",
    };
  }
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('chatgpt')) {
    return {
      gist: "Every model update reshapes what users expect your product to be able to do — whether you use AI or not.",
      summary: "OpenAI releases aren't just developer news — they shift the baseline of what users consider 'normal.' When GPT gets better at writing, users expect every text input to have AI assist. When vision improves, every camera interaction is up for reinvention. As a designer or PM, your job is to track capability changes and ask: does this obsolete a pattern I rely on? Does it unlock something I couldn't build six months ago? Being fluent in model progress is now part of product literacy.",
    };
  }
  if (lower.includes('apple') || lower.includes('siri') || lower.includes('ios')) {
    return {
      gist: "Apple's AI moves set the floor for what 350 million iPhone users will expect from every app.",
      summary: "When Apple ships an AI feature at the OS level, it becomes the baseline. Siri getting smarter, on-device ML improving, new API surfaces — these aren't just platform features. They're new expectations your users bring to every app on their phone. In an interview, especially for consumer or mobile-first products, you should be able to speak to how platform-level intelligence changes your interaction model. What do you now get for free? What should you stop doing yourself?",
    };
  }
  if (lower.includes('google') || lower.includes('gemini') || lower.includes('deepmind')) {
    return {
      gist: "Google is rebuilding search, productivity, and ambient computing around AI — which reshapes the context your product lives in.",
      summary: "Google's AI strategy isn't one product — it's a platform shift. Gemini embedded in Search, Docs, Gmail, Android. When Google changes how people find, create, and communicate, it changes the context your product competes in. A designer or PM who understands this can ask sharper questions: Are my users coming from Search differently now? Does AI in Gmail change how they expect to interact with notifications? Does Gemini in Android change what 'ambient' means for my app? These are the kinds of questions that signal senior thinking.",
    };
  }
  if (lower.includes('startup') || lower.includes('funding') || lower.includes('raise')) {
    return {
      gist: "Where money flows in AI right now tells you what problems the industry has decided are worth solving.",
      summary: "Funding rounds aren't gossip — they're a signal about where the industry is placing bets. If a category is attracting capital, it means smart people think there's a real problem to solve and real customers who'll pay. Staying aware of the funding landscape makes you a sharper product thinker: you can speak to competitive dynamics, where incumbents are vulnerable, and what the next wave of products will look like. In an interview, being able to reference what's getting funded — and what it means for your space — shows you think beyond your current role.",
    };
  }
  if (lower.includes('ux') || lower.includes('user experience') || lower.includes('interface')) {
    return {
      gist: "The craft of UX is being stress-tested by AI — and that's exactly the conversation your next interviewer wants to have.",
      summary: "AI doesn't replace UX — it makes it harder. When the system is probabilistic, outputs vary, and errors are subtle, the bar for clear communication rises dramatically. Designing for trust, for recoverable mistakes, for variable output quality — these are genuinely hard problems that require strong craft. The companies worth working for know this. Be ready to speak about a moment where you had to design for ambiguity, uncertainty, or a product that didn't always do what the user expected.",
    };
  }

  return {
    gist: `${source} is covering this because it's reshaping how products get built — and the designers who understand it will have an edge.`,
    summary: "Industry signals like this one matter because they shape what your interviewers are thinking about. The best candidates don't just know their craft — they know the landscape their work lives in. Be ready to connect what's happening in the industry to a real product decision: how does this change what you'd build, how you'd prioritise, or what you'd push back on?",
  };
}

const FALLBACK = {
  source: 'The Verge',
  headline: "AI assistants are getting better at knowing when to stay quiet.",
  tag: 'AI · Design',
  link: 'https://www.theverge.com/ai-artificial-intelligence',
  gist: "The hardest AI design problem isn't what the system says — it's knowing when it should say nothing at all.",
  summary: "Silence is a design decision. In AI products, surfacing information at the wrong moment is as damaging as surfacing the wrong information. Knowing when to intervene versus stay out of the way is a product judgment call, not an ML one — and it requires a clear mental model of user attention, trust, and context. In your next interview, be ready to speak about a moment where you chose to reduce AI visibility in a product, and why that made the experience better.",
};
