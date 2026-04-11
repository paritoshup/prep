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
