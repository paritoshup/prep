import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { transcript, drillName, drillType, durationSeconds } = await req.json();

  if (!transcript || transcript.trim().length < 5) {
    return NextResponse.json({
      score: 50,
      feedback: ['No transcript captured. Make sure your mic is enabled and speak clearly.'],
      wpm: 0,
      fillerCount: 0,
      coachingLine: 'Enable your mic and try again — your words are the signal.',
      keywords: [],
    });
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const wpm = durationSeconds > 5 ? Math.round((wordCount / durationSeconds) * 60) : 0;

  const prompt = `You are a sharp, direct interview coach for product designers, PMs, and researchers. Analyse this drill answer.

Drill: "${drillName}" (${drillType})
Duration: ${durationSeconds}s | Word count: ${wordCount} | Estimated WPM: ${wpm}
Transcript: "${transcript}"

Respond with valid JSON only — no markdown, no extra text:
{
  "score": <integer 0-100>,
  "feedback": [<exactly 3 short feedback strings, each under 80 chars>],
  "coachingLine": <one sharp, memorable coaching insight under 100 chars>,
  "keywords": [<up to 5 key terms or phrases that stood out in their answer>],
  "fillerCount": <count of filler words: um, uh, like, you know, basically, literally>
}

Scoring rubric:
- 85-100: Strong structure, clear thinking, specific examples, good pace
- 70-84: Solid answer, minor gaps in depth or structure
- 50-69: Ideas present but underdeveloped or unclear
- Below 50: Needs significant improvement in clarity or depth

Be direct and specific. Reference their actual words. Don't be vague.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      score: Math.max(0, Math.min(100, parsed.score ?? 60)),
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback.slice(0, 3) : [],
      coachingLine: parsed.coachingLine ?? '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 5) : [],
      fillerCount: parsed.fillerCount ?? 0,
      wpm,
    });
  } catch {
    // Fallback to basic analysis if API fails
    return NextResponse.json({
      score: 60,
      feedback: ['Answer captured. AI analysis unavailable — check your API key.'],
      coachingLine: 'Keep practising — consistency beats perfection.',
      keywords: [],
      fillerCount: 0,
      wpm,
    });
  }
}
