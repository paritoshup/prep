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
}

function parseDuration(d: string): number {
  const match = d.match(/(\d+)(s|m)/);
  if (!match) return 30;
  const n = parseInt(match[1]);
  return match[2] === 'm' ? n * 60 : n;
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

  useEffect(() => {
    const stored = localStorage.getItem('prep_mic_consent');
    if (stored === 'true') { setMicEnabled(true); setStage('ready'); }
    else if (stored === 'false') { setStage('ready'); }
  }, []);

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  function handleConsentAccept() {
    localStorage.setItem('prep_mic_consent', 'true');
    setMicEnabled(true);
    setStage('ready');
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

  function startSpeechRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) full += event.results[i][0].transcript + ' ';
      setTranscript(full);
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    try { recognition.start(); } catch (_) { /* already started */ }
  }

  function endDrill() {
    timerRef.current && clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    setStage('done');
  }

  useEffect(() => {
    if (stage === 'done') {
      const kw = extractKeywords(transcript);
      const feedback = analyseTranscript(transcript, elapsedRef.current || totalSeconds);
      setKeywords(kw);
      setVoiceFeedback(feedback);
      // Haptic
      if (navigator.vibrate) navigator.vibrate(100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(160deg, #080F1E 0%, #0A1628 50%, #0D1E3A 100%)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 max-w-[390px] mx-auto w-full">
        <div>
          <p className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            {drill.type}
          </p>
          <p className="font-body" style={{ fontSize: 11, color: '#4F6EF7' }}>
            Drill {drillNumber} of {totalDrills}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Close drill"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="#7A8BAD" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 max-w-[390px] mx-auto w-full overflow-y-auto pb-40">
        <AnimatePresence mode="wait">

          {stage === 'ready' && (
            <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-5">
              <h2 className="font-display leading-snug" style={{ fontSize: 22, fontWeight: 700, color: '#F0F4FF' }}>
                {drill.name}
              </h2>
              <p className="font-body leading-relaxed" style={{ fontSize: 14, color: '#B8C8E8' }}>
                {drill.description}
              </p>
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BAD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="font-body" style={{ fontSize: 13, color: '#7A8BAD' }}>
                  {drill.meta.duration} · {drill.meta.mode}
                </p>
              </div>
              {micEnabled && (
                <div className="rounded-2xl p-3 flex items-center gap-2.5" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                  <p className="font-body" style={{ fontSize: 12, color: '#4ADE80' }}>
                    Mic on — keywords + voice feedback enabled
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {stage === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 py-8">
                <motion.div key={timeLeft} initial={{ scale: 1.05 }} animate={{ scale: 1 }} className="font-display" style={{ fontSize: 72, fontWeight: 800, color: timeLeft <= 10 ? '#FB7185' : '#F0F4FF', lineHeight: 1 }}>
                  {timeLeft}
                </motion.div>
                <p className="font-body" style={{ fontSize: 12, color: '#7A8BAD' }}>seconds remaining</p>
                {isListening && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: '#4ADE80' }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4ADE80' }} />
                    </span>
                    <p className="font-body" style={{ fontSize: 11, color: '#4ADE80' }}>Listening</p>
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-display leading-snug" style={{ fontSize: 16, fontWeight: 600, color: '#F0F4FF' }}>
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
                ctaLabel={drillNumber < totalDrills ? `Next drill (${drillNumber + 1}/${totalDrills}) →` : 'Complete the stack →'}
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
        <div className="fixed left-0 right-0 px-4 z-40" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
          <div className="max-w-[390px] mx-auto">
            {stage === 'ready' && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={startDrill} className="w-full font-display font-bold text-white cursor-pointer" style={{ height: 52, background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)', borderRadius: 100, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(79,110,247,0.35)' }}>
                Start — I'm ready
              </motion.button>
            )}
            {stage === 'recording' && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={endDrill} className="w-full font-display font-bold cursor-pointer" style={{ height: 52, background: 'rgba(255,255,255,0.06)', borderRadius: 100, fontSize: 16, fontWeight: 700, color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.1)' }}>
                Done — end early
              </motion.button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
