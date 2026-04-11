'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Drill } from '@/lib/mockData';
import MicConsentModal from './MicConsentModal';
import KeywordResult from './KeywordResult';

/* ─── Web Speech API ─────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','being','i','you','we','they','he',
  'she','it','this','that','these','those','my','your','our','its','have',
  'has','had','do','did','does','will','would','could','should','may',
  'might','can','not','no','so','if','as','by','from','up','out','about',
  'into','then','than','just','also','like','very','really','um','uh','yeah',
  'okay','right','so','well','actually','basically','literally',
]);

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'right', 'okay', 'so well'];

function extractKeywords(transcript: string): string[] {
  const words = transcript.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const word of words) {
    if (!seen.has(word)) { seen.add(word); result.push(word); }
    if (result.length === 5) break;
  }
  return result;
}

function analyseTranscript(transcript: string, durationSeconds: number): VoiceFeedback {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = durationSeconds > 5 ? Math.round((wordCount / durationSeconds) * 60) : 0;

  // Filler word count
  const lower = transcript.toLowerCase();
  const fillerCount = FILLER_WORDS.reduce((count, f) => {
    const regex = new RegExp(`\\b${f}\\b`, 'g');
    return count + (lower.match(regex)?.length ?? 0);
  }, 0);

  const feedback: string[] = [];
  let score = 70;

  // Pacing
  if (wpm > 0) {
    if (wpm < 80) { feedback.push('Pacing felt slow — aim for 120–150 wpm to sound confident.'); score -= 5; }
    else if (wpm > 180) { feedback.push('You spoke quickly — slow down slightly so ideas land clearly.'); score -= 5; }
    else { feedback.push(`Good pace at ~${wpm} wpm. Clear and easy to follow.`); score += 5; }
  }

  // Filler words
  if (fillerCount > 4) { feedback.push(`${fillerCount} filler words detected (um, uh, like). Replace with a pause.`); score -= 10; }
  else if (fillerCount > 1) { feedback.push(`${fillerCount} filler words. Nearly there — a deliberate pause beats "um".`); score -= 3; }
  else { feedback.push('Clean delivery — minimal filler words. Strong signal.'); score += 8; }

  // Length
  if (wordCount < 20 && durationSeconds > 20) { feedback.push('Answer was short. Push yourself to develop the idea further.'); score -= 10; }
  else if (wordCount > 10) { feedback.push('Good answer depth — you used the time well.'); score += 5; }

  // Structure signals
  const hasUserMention = /\buser[s]?\b|\bpeople\b|\bteam\b/.test(lower);
  const hasProblemMention = /\bproblem\b|\bchallenge\b|\bissue\b|\bgap\b/.test(lower);
  const hasOutcome = /\bresult\b|\boutcome\b|\bimpact\b|\bimprove\b|\bsolve\b/.test(lower);

  if (hasUserMention && hasProblemMention) { score += 8; }
  if (hasOutcome) { score += 5; }

  return {
    feedback: feedback.slice(0, 3),
    score: Math.max(30, Math.min(100, score)),
    wpm,
    fillerCount,
  };
}

export interface VoiceFeedback {
  feedback: string[];
  score: number;
  wpm: number;
  fillerCount: number;
  coachingLine?: string;
}

function parseDuration(d: string): number {
  const match = d.match(/(\d+)(s|m)/);
  if (!match) return 30;
  const n = parseInt(match[1]);
  return match[2] === 'm' ? n * 60 : n;
}

const WAVE = [
  { maxH: 20, dur: 0.50 },
  { maxH: 32, dur: 0.68 },
  { maxH: 16, dur: 0.58 },
  { maxH: 38, dur: 0.78 },
  { maxH: 22, dur: 0.53 },
  { maxH: 30, dur: 0.63 },
  { maxH: 16, dur: 0.44 },
];

function ListeningWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1" style={{ height: 48 }}>
      {WAVE.map((bar, i) => (
        <motion.div
          key={i}
          style={{ width: 3, borderRadius: 4, background: active ? 'var(--green)' : 'var(--surface2)' }}
          animate={active
            ? { height: [4, bar.maxH, 4] }
            : { height: 4 }
          }
          transition={active
            ? { duration: bar.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }
            : { duration: 0.35 }
          }
        />
      ))}
    </div>
  );
}

type Stage = 'consent' | 'ready' | 'recording' | 'done';

interface DrillScreenProps {
  drill: Drill;
  drillNumber: number;
  totalDrills: number;
  onComplete: (keywords: string[]) => void;
  onClose: () => void;
}

export default function DrillScreen({ drill, drillNumber, totalDrills, onComplete, onClose }: DrillScreenProps) {
  const totalSeconds = parseDuration(drill.meta.duration);
  const [stage, setStage] = useState<Stage>('consent');
  const [micEnabled, setMicEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [voiceFeedback, setVoiceFeedback] = useState<VoiceFeedback | null>(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<AnySpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const transcriptRef = useRef('');

  useEffect(() => {
    const stored = localStorage.getItem('prep_mic_consent');
    if (stored === 'true') { setMicEnabled(true); setStage('ready'); }
    else if (stored === 'false') { setStage('ready'); }
  }, []);

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
      srActiveRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  function handleConsentAccept() {
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        localStorage.setItem('prep_mic_consent', 'true');
        setMicEnabled(true);
        setStage('ready');
      })
      .catch(() => {
        localStorage.setItem('prep_mic_consent', 'false');
        setMicEnabled(false);
        setStage('ready');
      });
  }

  function handleConsentDecline() {
    localStorage.setItem('prep_mic_consent', 'false');
    setStage('ready');
  }

  function startDrill() {
    setStage('recording');
    setTimeLeft(totalSeconds);
    elapsedRef.current = 0;

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      setTimeLeft(prev => {
        if (prev <= 1) {
          timerRef.current && clearInterval(timerRef.current);
          endDrill();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (micEnabled) startSpeechRecognition();
  }

  const srActiveRef = useRef(false);

  function startSpeechRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    srActiveRef.current = true;

    function createAndStart() {
      if (!srActiveRef.current) return;
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);

      recognition.onend = () => {
        setIsListening(false);
        if (srActiveRef.current) {
          try { createAndStart(); } catch (_) { /* ignore */ }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; i++) full += event.results[i][0].transcript + ' ';
        transcriptRef.current = full;
        setTranscript(full);
      };

      recognition.onerror = (e: { error: string }) => {
        setIsListening(false);
        if (e.error === 'aborted' || e.error === 'not-allowed') {
          srActiveRef.current = false;
        }
      };

      recognitionRef.current = recognition;
      try { recognition.start(); } catch (_) { /* already started */ }
    }

    createAndStart();
  }

  function endDrill() {
    timerRef.current && clearInterval(timerRef.current);
    srActiveRef.current = false;
    recognitionRef.current?.stop();
    setStage('done');
  }

  useEffect(() => {
    if (stage === 'done') {
      if (navigator.vibrate) navigator.vibrate(100);
      const duration = elapsedRef.current || totalSeconds;
      const finalTranscript = transcriptRef.current || transcript;

      fetch('/api/drill-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalTranscript,
          drillName: drill.name,
          drillType: drill.type,
          durationSeconds: duration,
        }),
      })
        .then(r => r.json())
        .then(data => {
          setKeywords(data.keywords?.length ? data.keywords : extractKeywords(transcript));
          setVoiceFeedback({
            feedback: data.feedback ?? [],
            score: data.score ?? 60,
            wpm: data.wpm ?? 0,
            fillerCount: data.fillerCount ?? 0,
            coachingLine: data.coachingLine ?? '',
          });
        })
        .catch(() => {
          const kw = extractKeywords(finalTranscript);
          const feedback = analyseTranscript(finalTranscript, duration);
          setKeywords(kw);
          setVoiceFeedback(feedback);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col shell-fixed"
      style={{ background: 'var(--bg)' }}
    >
      {/* Top bar — hidden when results are shown */}
      {stage !== 'done' && (
        <div className="flex items-center gap-3 px-4 pt-14 pb-4 max-w-[390px] mx-auto w-full">
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
            style={{ background: 'var(--surface2)' }}
            aria-label="Close drill"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Segmented progress bar */}
          <div className="flex-1 flex items-center gap-1.5">
            {Array.from({ length: totalDrills }).map((_, i) => {
              const completed = i < drillNumber - 1;
              const active    = i === drillNumber - 1;

              return (
                <div
                  key={i}
                  className="flex-1 rounded-full overflow-hidden"
                  style={{ height: 4, background: 'var(--surface2)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent)' }}
                    initial={{ width: completed ? '100%' : '0%' }}
                    animate={{
                      width: completed
                        ? '100%'
                        : active && stage === 'recording'
                          ? '100%'
                          : '0%',
                    }}
                    transition={
                      active && stage === 'recording'
                        ? { duration: totalSeconds, ease: 'linear' }
                        : { duration: 0.3 }
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 px-4 max-w-[390px] mx-auto w-full overflow-y-auto ${stage === 'done' ? 'pt-14 pb-40' : 'pb-40'}`}>
        <AnimatePresence mode="wait">

          {stage === 'ready' && (
            <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-5">
              <h2 className="font-display leading-snug" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
                {drill.name}
              </h2>
              <p className="font-body leading-relaxed" style={{ fontSize: 14, color: 'var(--muted)' }}>
                {drill.description}
              </p>
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="font-body" style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {drill.meta.duration} · {drill.meta.mode}
                </p>
              </div>
              {micEnabled ? (
                <div className="rounded-2xl p-3 flex items-center gap-2.5" style={{ background: 'var(--green-bg)', border: '1px solid rgba(26,158,92,0.2)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                  <p className="font-body" style={{ fontSize: 12, color: 'var(--green-text)' }}>
                    Mic on — AI voice feedback enabled
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem('prep_mic_consent');
                    setStage('consent');
                  }}
                  className="rounded-2xl p-3 flex items-center gap-2.5 w-full cursor-pointer text-left"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                  <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Mic off — tap to enable AI feedback
                  </p>
                </button>
              )}
            </motion.div>
          )}

          {stage === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 py-8">
                <motion.div key={timeLeft} initial={{ scale: 1.05 }} animate={{ scale: 1 }} className="font-display" style={{ fontSize: 72, fontWeight: 800, color: timeLeft <= 10 ? 'var(--red)' : 'var(--text)', lineHeight: 1 }}>
                  {timeLeft}
                </motion.div>
                <p className="font-body" style={{ fontSize: 12, color: 'var(--muted)' }}>seconds remaining</p>
                <div className="mt-2">
                  <ListeningWave active={isListening} />
                </div>
                {isListening && (
                  <p className="font-body text-center" style={{ fontSize: 11, color: 'var(--green-text)', marginTop: 2 }}>
                    Listening
                  </p>
                )}
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="font-display leading-snug" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
                  {drill.name}
                </p>
              </div>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <KeywordResult
                drill={drill}
                keywords={keywords}
                voiceFeedback={voiceFeedback}
                onDone={() => onComplete(keywords)}
                onRepeat={() => {
                  setStage('ready');
                  setTranscript('');
                  setKeywords([]);
                  setVoiceFeedback(null);
                  setTimeLeft(totalSeconds);
                  setElapsed(0);
                  elapsedRef.current = 0;
                  transcriptRef.current = '';
                }}
                ctaLabel={drillNumber < totalDrills ? `Next drill (${drillNumber + 1}/${totalDrills}) →` : 'Back to home'}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 'consent' && (
          <MicConsentModal onAccept={handleConsentAccept} onDecline={handleConsentDecline} />
        )}
      </AnimatePresence>

      {(stage === 'ready' || stage === 'recording') && (
        <div className="fixed left-0 right-0 px-4 z-40 shell-fixed" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
          <div className="max-w-[390px] mx-auto">
            {stage === 'ready' && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={startDrill} className="w-full font-display font-bold text-white cursor-pointer" style={{ height: 52, background: 'var(--accent)', borderRadius: 14, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(255,92,53,0.3)' }}>
                Start — I'm ready
              </motion.button>
            )}
            {stage === 'recording' && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={endDrill} className="w-full font-display font-bold cursor-pointer" style={{ height: 52, background: 'var(--surface)', borderRadius: 14, fontSize: 16, fontWeight: 700, color: 'var(--text)', border: '1px solid var(--border)' }}>
                Done — end early
              </motion.button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
