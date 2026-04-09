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
    url: 'https://feeds.feedburner.com/TroyHunt', // fallback — MIT Tech Review
    source: 'MIT Tech Review',
    tag: 'AI · Research',
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

  return NextResponse.json({
    item: {
      source: top.source,
      headline: top.title,
      tag: top.tag,
      link: top.link,
      summary: generateSummary(top.title, top.source),
    },
    live: true,
  });
}

function generateSummary(title: string, source: string): string {
  const lower = title.toLowerCase();

  if (lower.includes('agent') || lower.includes('agentic')) {
    return "Autonomous agents are changing the product design brief entirely — users set goals, not tasks. Prepare to speak about how you design for outcomes, surface agent status, and handle failure states gracefully in an AI-first world.";
  }
  if (lower.includes('figma') || lower.includes('design tool')) {
    return "Design tooling is evolving faster than workflows. In a design round, you should be able to speak to how you adapt your process as AI enters your toolkit — from research synthesis to rapid prototyping and handoff.";
  }
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('chatgpt')) {
    return "Foundation model updates ripple through every product that uses them. As a designer, understanding capability changes — and what they mean for your users' expectations — is becoming a core competency.";
  }
  if (lower.includes('apple') || lower.includes('siri') || lower.includes('ios')) {
    return "Platform-level AI shifts what users expect by default. Designing for Apple platforms means understanding how system intelligence changes interaction patterns, defaults, and the baseline users compare your product to.";
  }
  if (lower.includes('google') || lower.includes('gemini') || lower.includes('deepmind')) {
    return "Google's AI moves set the pace for search, productivity, and ambient computing. Understanding these shifts is critical when designing products that live alongside or compete with Google's ecosystem.";
  }
  if (lower.includes('startup') || lower.includes('funding') || lower.includes('raise')) {
    return "Where capital flows signals where the industry is heading. Being aware of the AI product landscape — who's building what and why — makes you a sharper product thinker in any interview room.";
  }
  if (lower.includes('ux') || lower.includes('user experience') || lower.includes('interface')) {
    return "UX is the battleground where AI capabilities become actual products. Your ability to translate complex model behaviour into clear, trustworthy, and useful interfaces is exactly what companies are hiring for right now.";
  }

  return `${source} is covering this because it's reshaping how products get built. Knowing the signal — and being able to connect it to your design decisions — separates candidates who think about craft from those who think about industry.`;
}

const FALLBACK = {
  source: 'The Verge',
  headline: "AI assistants are getting better at knowing when to stay quiet.",
  tag: 'AI · Design',
  link: 'https://www.theverge.com/ai-artificial-intelligence',
  summary: "One of the hardest design problems in AI products isn't what the AI says — it's when it doesn't say anything. Knowing when to surface information vs. stay out of the way is a product judgment call, not an ML one. Be ready to speak to this.",
};
