'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveUser, type UserProfile } from '@/lib/storage';

type Role = 'Designer' | 'Product Manager' | 'Researcher' | 'Other';

const ROLES: Role[] = ['Designer', 'Product Manager', 'Researcher', 'Other'];

const ROLE_ICONS: Record<Role, string> = {
  'Designer':        '✦',
  'Product Manager': '◈',
  'Researcher':      '◎',
  'Other':           '◇',
};

const REMINDER_TIMES = [
  { label: 'Morning',   value: '08:00', sub: '8:00 AM' },
  { label: 'Afternoon', value: '13:00', sub: '1:00 PM' },
  { label: 'Evening',   value: '19:00', sub: '7:00 PM' },
  { label: 'Night',     value: '21:00', sub: '9:00 PM' },
];

interface StepProps {
  onNext: (data: Partial<UserProfile>) => void;
}

/* ─── Step 1: Name ───────────────────────────────────────────────── */
function StepName({ onNext }: StepProps) {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Step 1 of 4
        </p>
        <h1 className="font-display leading-tight mb-2" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
          What should we call you?
        </h1>
        <p className="font-body" style={{ fontSize: 14, color: '#7A8BAD' }}>
          This shows up on your score cards and drills.
        </p>
      </div>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your first name"
        autoFocus
        className="w-full font-display outline-none rounded-2xl px-5"
        style={{
          height: 56,
          background: 'rgba(15,32,64,0.8)',
          border: '1px solid rgba(79,110,247,0.3)',
          color: '#F0F4FF',
          fontSize: 18,
          fontWeight: 600,
        }}
        onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onNext({ name: name.trim() }); }}
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!name.trim()}
        onClick={() => onNext({ name: name.trim() })}
        className="w-full font-display font-bold text-white cursor-pointer"
        style={{
          height: 52,
          background: name.trim() ? 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)' : 'rgba(255,255,255,0.06)',
          borderRadius: 100,
          fontSize: 16,
          fontWeight: 700,
          color: name.trim() ? '#fff' : '#4A5A7A',
          transition: 'all 0.2s',
          boxShadow: name.trim() ? '0 4px 24px rgba(79,110,247,0.3)' : 'none',
        }}
      >
        Continue →
      </motion.button>
    </div>
  );
}

/* ─── Step 2: Role ───────────────────────────────────────────────── */
function StepRole({ onNext }: StepProps) {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Step 2 of 4
        </p>
        <h1 className="font-display leading-tight mb-2" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
          What's your role?
        </h1>
        <p className="font-body" style={{ fontSize: 14, color: '#7A8BAD' }}>
          We'll tailor your drills and signals to match.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ROLES.map(role => (
          <motion.button
            key={role}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(role)}
            className="w-full flex items-center gap-4 rounded-2xl px-5 cursor-pointer text-left"
            style={{
              height: 60,
              background: selected === role ? 'rgba(79,110,247,0.15)' : 'rgba(15,32,64,0.7)',
              border: `1px solid ${selected === role ? 'rgba(79,110,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 18, color: selected === role ? '#7B96FF' : '#4A5A7A' }}>
              {ROLE_ICONS[role]}
            </span>
            <span className="font-display font-semibold" style={{ fontSize: 15, color: selected === role ? '#F0F4FF' : '#B8C8E8' }}>
              {role}
            </span>
            {selected === role && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
                width="18" height="18" viewBox="0 0 18 18" fill="none"
              >
                <circle cx="9" cy="9" r="8.25" stroke="#4F6EF7" strokeWidth="1.5" />
                <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#4F6EF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!selected}
        onClick={() => selected && onNext({ role: selected })}
        className="w-full font-display font-bold cursor-pointer"
        style={{
          height: 52,
          background: selected ? 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)' : 'rgba(255,255,255,0.06)',
          borderRadius: 100,
          fontSize: 16,
          fontWeight: 700,
          color: selected ? '#fff' : '#4A5A7A',
          transition: 'all 0.2s',
          boxShadow: selected ? '0 4px 24px rgba(79,110,247,0.3)' : 'none',
        }}
      >
        Continue →
      </motion.button>
    </div>
  );
}

/* ─── Step 3: Company ────────────────────────────────────────────── */
function StepCompany({ onNext }: StepProps) {
  const [company, setCompany] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Step 3 of 4
        </p>
        <h1 className="font-display leading-tight mb-2" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
          Who are you interviewing with?
        </h1>
        <p className="font-body" style={{ fontSize: 14, color: '#7A8BAD' }}>
          Your countdown and drills will reference this. Skip if you're exploring.
        </p>
      </div>

      <input
        type="text"
        value={company}
        onChange={e => setCompany(e.target.value)}
        placeholder="e.g. Figma, Notion, Google..."
        autoFocus
        className="w-full font-display outline-none rounded-2xl px-5"
        style={{
          height: 56,
          background: 'rgba(15,32,64,0.8)',
          border: '1px solid rgba(79,110,247,0.3)',
          color: '#F0F4FF',
          fontSize: 16,
          fontWeight: 600,
        }}
        onKeyDown={e => { if (e.key === 'Enter') onNext({ company: company.trim() }); }}
      />

      <div className="flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext({ company: company.trim() })}
          className="w-full font-display font-bold text-white cursor-pointer"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)',
            borderRadius: 100,
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0 4px 24px rgba(79,110,247,0.3)',
          }}
        >
          {company.trim() ? 'Continue →' : 'Continue →'}
        </motion.button>
        <button
          onClick={() => onNext({ company: '' })}
          className="font-body cursor-pointer py-2"
          style={{ fontSize: 13, color: '#4A5A7A' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Interview date + reminder ──────────────────────────── */
function StepSchedule({ onNext }: StepProps) {
  const [date, setDate] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Step 4 of 4
        </p>
        <h1 className="font-display leading-tight mb-2" style={{ fontSize: 28, fontWeight: 800, color: '#F0F4FF' }}>
          When's the interview?
        </h1>
        <p className="font-body" style={{ fontSize: 14, color: '#7A8BAD' }}>
          Set a deadline and a daily reminder. Your streak depends on it.
        </p>
      </div>

      {/* Date picker */}
      <div className="flex flex-col gap-2">
        <label className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Interview date (optional)
        </label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={e => setDate(e.target.value)}
          className="w-full font-body outline-none rounded-2xl px-5 cursor-pointer"
          style={{
            height: 52,
            background: 'rgba(15,32,64,0.8)',
            border: '1px solid rgba(79,110,247,0.3)',
            color: date ? '#F0F4FF' : '#4A5A7A',
            fontSize: 15,
            colorScheme: 'dark',
          }}
        />
      </div>

      {/* Reminder time */}
      <div className="flex flex-col gap-3">
        <label className="font-body uppercase tracking-widest" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
          Daily reminder
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {REMINDER_TIMES.map(t => (
            <motion.button
              key={t.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => setReminderTime(t.value)}
              className="rounded-2xl px-4 py-3 cursor-pointer text-left"
              style={{
                background: reminderTime === t.value ? 'rgba(79,110,247,0.15)' : 'rgba(15,32,64,0.7)',
                border: `1px solid ${reminderTime === t.value ? 'rgba(79,110,247,0.4)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <p className="font-display font-semibold" style={{ fontSize: 13, color: reminderTime === t.value ? '#F0F4FF' : '#B8C8E8' }}>
                {t.label}
              </p>
              <p className="font-body" style={{ fontSize: 11, color: '#7A8BAD' }}>{t.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext({ interviewDate: date, reminderTime })}
          className="w-full font-display font-bold text-white cursor-pointer"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)',
            borderRadius: 100,
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0 4px 24px rgba(79,110,247,0.3)',
          }}
        >
          Let's go →
        </motion.button>
        <button
          onClick={() => onNext({ interviewDate: '', reminderTime })}
          className="font-body cursor-pointer py-2"
          style={{ fontSize: 13, color: '#4A5A7A' }}
        >
          Skip interview date
        </button>
      </div>
    </div>
  );
}

/* ─── Main flow ──────────────────────────────────────────────────── */
export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({});

  function handleNext(patch: Partial<UserProfile>) {
    const updated = { ...data, ...patch };
    setData(updated);

    if (step < 3) {
      setStep(s => s + 1);
    } else {
      // Complete
      const user: UserProfile = {
        name: updated.name ?? 'You',
        role: updated.role ?? 'Designer',
        company: updated.company ?? '',
        interviewDate: updated.interviewDate ?? '',
        reminderTime: updated.reminderTime ?? '08:00',
        onboardingComplete: true,
        joinedAt: new Date().toISOString(),
      };
      saveUser(user);

      // Request notification permission + schedule reminder
      if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            navigator.serviceWorker.ready.then(reg => {
              reg.active?.postMessage({
                type: 'SCHEDULE_REMINDER',
                reminderTime: user.reminderTime,
                title: "Your daily stack is ready 🎯",
                body: `Keep your streak going, ${user.name}. Today's drills are waiting.`,
              });
            });
          }
        });
      }

      onComplete();
    }
  }

  const steps = [
    <StepName key="name" onNext={handleNext} />,
    <StepRole key="role" onNext={handleNext} />,
    <StepCompany key="company" onNext={handleNext} />,
    <StepSchedule key="schedule" onNext={handleNext} />,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end shell-fixed"
      style={{ background: 'linear-gradient(160deg, #080F1E 0%, #0A1628 50%, #0D1E3A 100%)' }}
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-16 pb-8">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{ width: i === step ? 20 : 6, background: i <= step ? '#4F6EF7' : 'rgba(255,255,255,0.12)' }}
            className="h-1.5 rounded-full"
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
