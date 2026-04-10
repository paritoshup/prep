import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'right', 'so well'];

// ─── Local analysis fallback ──────────────────────────────────────────────────
// Used when AI is unavailable. Scores on 4 axes, max 100.
function localAnalysis(transcript: string, durationSeconds: number) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = durationSeconds > 5 ? Math.round((wordCount / durationSeconds) * 60) : 0;
  const lower = transcript.toLowerCase();

  const fillerCount = FILLER_WORDS.reduce((n, f) => {
    return n + (lower.match(new RegExp(`\\b${f}\\b`, 'g'))?.length ?? 0);
  }, 0);

  // Start at 50 — earn your score
  let score = 50;
  const feedback: string[] = [];

  // 1. Pacing (±10)
  if (wpm > 0) {
    if (wpm < 80)       { score -= 8;  feedback.push(`Slow pace (~${wpm} wpm). Aim for 120–150 wpm to sound confident.`); }
    else if (wpm > 190) { score -= 5;  feedback.push(`Fast pace (~${wpm} wpm). Slow down — let your ideas breathe.`); }
    else if (wpm >= 120 && wpm <= 160) { score += 10; feedback.push(`Strong pace at ~${wpm} wpm — clear and easy to follow.`); }
    else                { score += 5;  feedback.push(`Decent pace at ~${wpm} wpm. Aim for 120–150 for optimal clarity.`); }
  }

  // 2. Filler words (±10)
  if (fillerCount > 5)      { score -= 10; feedback.push(`${fillerCount} filler words (um, uh, like). Replace each with a deliberate pause.`); }
  else if (fillerCount > 2) { score -= 4;  feedback.push(`${fillerCount} filler words — close. A pause sounds more confident than "um".`); }
  else                      { score += 10; feedback.push('Clean delivery — almost no filler words. That signals confidence.'); }

  // 3. Answer depth (±15)
  if (wordCount < 15 && durationSeconds > 15) {
    score -= 15;
    feedback.push('Very short answer. Use the full time — interviewers want depth, not brevity.');
  } else if (wordCount >= 60) {
    score += 15;
    feedback.push('Good depth — you developed your thinking across the full answer.');
  } else if (wordCount >= 30) {
    score += 8;
    feedback.push('Reasonable depth. Push further with a specific example or outcome next time.');
  }

  // 4. Structure signals (±15)
  const hasUser     = /\buser[s]?\b|\bpeople\b|\bcustomer[s]?\b/.test(lower);
  const hasProblem  = /\bproblem\b|\bchallenge\b|\bissue\b|\bgap\b|\bneed\b/.test(lower);
  const hasOutcome  = /\bresult\b|\boutcome\b|\bimpact\b|\bimprove\b|\bsolve[d]?\b|\bsuccess\b/.test(lower);
  const hasExample  = /\bfor example\b|\bfor instance\b|\bsuch as\b|\blike when\b|\bonce\b|\bi once\b/.test(lower);
  const hasQuestion = /\?/.test(transcript);

  if (hasUser && hasProblem) score += 8;
  if (hasOutcome)            score += 5;
  if (hasExample)            score += 5;
  if (hasQuestion)           score += 3; // shows curiosity / reframing

  // Clamp
  score = Math.max(25, Math.min(95, score));

  return {
    score,
    feedback: feedback.slice(0, 3),
    coachingLine: score >= 80
      ? 'Sharp answer — your structure and delivery work together.'
      : score >= 60
        ? 'Solid foundation. Add one concrete example and it lands harder.'
        : 'Focus on structure first: set up the problem, then your thinking, then the outcome.',
    keywords: words
      .filter(w => w.length > 4 && !['would','could','should','their','there','about','think','that'].includes(w))
      .slice(0, 5),
    fillerCount,
    wpm,
  };
}

export async function POST(req: NextRequest) {
  const { transcript, drillName, drillType, durationSeconds } = await req.json();

  if (!transcript || transcript.trim().length < 5) {
    return NextResponse.json({
      score: 0,
      feedback: ['No speech detected. Make sure your mic is enabled and speak clearly into it.'],
      coachingLine: 'Enable mic access and try again — your words are the signal.',
      keywords: [],
      fillerCount: 0,
      wpm: 0,
    });
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const wpm = durationSeconds > 5 ? Math.round((wordCount / durationSeconds) * 60) : 0;

  const prompt = `You are a sharp, direct interview coach for product designers, PMs, and UX researchers. Score this drill answer honestly — don't inflate scores.

Drill: "${drillName}" (${drillType})
Duration: ${durationSeconds}s | Words: ${wordCount} | WPM: ${wpm}
Transcript: "${transcript}"

Score on 4 dimensions (each out of 25, total out of 100):
1. STRUCTURE (0-25): Clear framework or narrative? Problem → thinking → outcome? Or just rambling?
2. DEPTH (0-25): Specific examples, reasoning, nuance? Or vague and surface-level?
3. RELEVANCE (0-25): Actually answers what was asked? Stays on topic?
4. COMMUNICATION (0-25): Clear delivery, good pace, minimal fillers, confident?

Scoring anchors:
- 85-100: Exceptional — structured, specific, relevant, confident delivery
- 70-84: Strong — good thinking, minor gaps in depth or concreteness
- 55-69: Developing — ideas present but underdeveloped or off-track
- 40-54: Weak — vague, rambling, or barely addresses the question
- Below 40: Did not engage with the question meaningfully

Be strict. A score of 75 should feel earned. Reference their actual words.

Respond with valid JSON only — no markdown:
{
  "score": <integer 0-100, sum of 4 dimensions>,
  "breakdown": { "structure": <0-25>, "depth": <0-25>, "relevance": <0-25>, "communication": <0-25> },
  "feedback": [<3 specific feedback strings under 90 chars each, referencing their actual words>],
  "coachingLine": <one sharp memorable coaching insight under 110 chars>,
  "keywords": [<up to 6 strong signal words or phrases from their answer>],
  "fillerCount": <count of: um, uh, like, you know, basically, literally>
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    // Strip markdown code fences if present
    const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({
      score: Math.max(0, Math.min(100, parsed.score ?? 60)),
      breakdown: parsed.breakdown ?? null,
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback.slice(0, 3) : [],
      coachingLine: parsed.coachingLine ?? '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 6) : [],
      fillerCount: parsed.fillerCount ?? 0,
      wpm,
    });
  } catch {
    // AI unavailable — run local analysis instead of generic error
    const local = localAnalysis(transcript, durationSeconds);
    return NextResponse.json({ ...local, breakdown: null });
  }
}
