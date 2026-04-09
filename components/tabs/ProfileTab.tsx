'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, saveUser, getTodayRecord, loadState, type UserProfile } from '@/lib/storage';
import RankBadge from '@/components/ui/RankBadge';
import BottomSheet from '@/components/ui/BottomSheet';

const REMINDER_TIMES = [
  { label: 'Morning',   value: '08:00', sub: '8:00 AM' },
  { label: 'Afternoon', value: '13:00', sub: '1:00 PM' },
  { label: 'Evening',   value: '19:00', sub: '7:00 PM' },
  { label: 'Night',     value: '21:00', sub: '9:00 PM' },
];

const BADGES = [
  { label: 'First Drill',   earned: true,  icon: '⚡' },
  { label: '7-Day Streak',  earned: true,  icon: '🔥' },
  { label: 'Sharp Reader',  earned: true,  icon: '🎯' },
  { label: '14-Day Streak', earned: false, icon: '💎' },
  { label: 'Perfect Score', earned: false, icon: '🏆' },
  { label: 'Signal Master', earned: false, icon: '📡' },
];

/* ─── Edit sheet ─────────────────────────────────────────────────── */
function EditSheet({
  label, value, onSave, onClose, type = 'text',
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
  type?: string;
}) {
  const [val, setVal] = useState(value);

  return (
    <div className="flex flex-col gap-5 pt-2 pb-4">
      <h3 className="font-display font-bold" style={{ fontSize: 18, color: '#F0F4FF' }}>
        Edit {label}
      </h3>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        autoFocus
        className="w-full font-body outline-none rounded-2xl px-5"
        style={{
          height: 52,
          background: 'rgba(15,32,64,0.8)',
          border: '1px solid rgba(79,110,247,0.3)',
          color: '#F0F4FF',
          fontSize: 15,
          colorScheme: 'dark',
        }}
      />
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { onSave(val); onClose(); }}
          className="flex-1 font-display font-bold text-white cursor-pointer"
          style={{ height: 48, background: 'linear-gradient(135deg, #4F6EF7, #6B84FF)', borderRadius: 100, fontSize: 14, fontWeight: 700 }}
        >
          Save
        </motion.button>
        <button
          onClick={onClose}
          className="flex-1 font-body cursor-pointer"
          style={{ height: 48, background: 'rgba(255,255,255,0.06)', borderRadius: 100, fontSize: 14, color: '#7A8BAD', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Reminder picker sheet ──────────────────────────────────────── */
function ReminderSheet({ current, onSave, onClose }: { current: string; onSave: (v: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState(current);
  return (
    <div className="flex flex-col gap-5 pt-2 pb-4">
      <h3 className="font-display font-bold" style={{ fontSize: 18, color: '#F0F4FF' }}>
        Daily reminder
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {REMINDER_TIMES.map(t => (
          <motion.button
            key={t.value}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(t.value)}
            className="rounded-2xl px-4 py-3 cursor-pointer text-left"
            style={{ background: selected === t.value ? 'rgba(79,110,247,0.15)' : 'rgba(15,32,64,0.7)', border: `1px solid ${selected === t.value ? 'rgba(79,110,247,0.4)' : 'rgba(255,255,255,0.07)'}` }}
          >
            <p className="font-display font-semibold" style={{ fontSize: 13, color: selected === t.value ? '#F0F4FF' : '#B8C8E8' }}>{t.label}</p>
            <p className="font-body" style={{ fontSize: 11, color: '#7A8BAD' }}>{t.sub}</p>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { onSave(selected); onClose(); }}
        className="w-full font-display font-bold text-white cursor-pointer"
        style={{ height: 48, background: 'linear-gradient(135deg, #4F6EF7, #6B84FF)', borderRadius: 100, fontSize: 14, fontWeight: 700 }}
      >
        Save reminder
      </motion.button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function ProfileTab() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState(0);
  const [drillsDone, setDrillsDone] = useState(0);
  const [editSheet, setEditSheet] = useState<null | 'name' | 'company' | 'date' | 'reminder'>(null);

  useEffect(() => {
    const u = getUser();
    const state = loadState();
    const today = getTodayRecord();
    setUser(u);
    setStreak(state.streak);
    setDrillsDone(today.drillsDone);
  }, []);

  function updateUser(patch: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...patch };
    saveUser(updated);
    setUser(updated);

    // Re-schedule notification if reminder changed
    if (patch.reminderTime && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.active?.postMessage({
          type: 'SCHEDULE_REMINDER',
          reminderTime: patch.reminderTime,
          title: "Your daily stack is ready 🎯",
          body: `Keep your streak going, ${updated.name}.`,
        });
      });
    }
  }

  if (!user) return null;

  const STATS = [
    { label: 'Day Streak',  value: `${streak}`,    unit: 'days',   color: '#F6B84B' },
    { label: 'Drills Done', value: `${drillsDone}`, unit: 'today',  color: '#4ADE80' },
    { label: 'Role',        value: user.role.split(' ')[0], unit: '', color: '#7B96FF' },
    { label: 'Rapid Fire',  value: '—',            unit: 'today',  color: '#C084FC' },
  ];

  const reminderLabel = REMINDER_TIMES.find(t => t.value === user.reminderTime)?.label ?? user.reminderTime;

  const SETTINGS = [
    { key: 'name' as const,     label: 'Name',             value: user.name,          icon: '👤' },
    { key: 'company' as const,  label: 'Target company',   value: user.company || 'Not set', icon: '🎯' },
    { key: 'date' as const,     label: 'Interview date',   value: user.interviewDate ? new Date(user.interviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set', icon: '📅' },
    { key: 'reminder' as const, label: 'Daily reminder',   value: reminderLabel,       icon: '🔔' },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 px-4 pt-6 pb-40">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.12) 0%, rgba(15,32,64,0.9) 100%)', border: '1px solid rgba(79,110,247,0.2)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #4F6EF7, #6B84FF)' }}>
              <span className="font-display font-bold" style={{ fontSize: 22, color: '#fff' }}>{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold" style={{ fontSize: 20, color: '#F0F4FF' }}>{user.name}</h2>
              <p className="font-body mt-0.5" style={{ fontSize: 12, color: '#7A8BAD' }}>{user.role} · Day {streak + 1}</p>
            </div>
            <RankBadge rank="Contender" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="rounded-2xl p-4" style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="font-body" style={{ fontSize: 10, color: '#7A8BAD', marginBottom: 6 }}>{s.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold" style={{ fontSize: 22, color: s.color }}>{s.value}</span>
                {s.unit && <span className="font-body" style={{ fontSize: 10, color: '#7A8BAD' }}>{s.unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>Badges</p>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b, i) => (
              <motion.div key={b.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
                className="rounded-2xl p-3 flex flex-col items-center gap-2"
                style={{ background: b.earned ? 'rgba(15,32,64,0.8)' : 'rgba(15,32,64,0.3)', border: `1px solid ${b.earned ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, opacity: b.earned ? 1 : 0.4 }}
              >
                <span style={{ fontSize: 22, filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.icon}</span>
                <p className="font-body text-center leading-tight" style={{ fontSize: 10, color: b.earned ? '#B8C8E8' : '#4A5A7A' }}>{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>Settings</p>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {SETTINGS.map((item, i, arr) => (
              <button
                key={item.key}
                onClick={() => setEditSheet(item.key)}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
                style={{ background: 'rgba(15,32,64,0.6)', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div className="text-left">
                    <p className="font-body" style={{ fontSize: 13, color: '#B8C8E8' }}>{item.label}</p>
                    <p className="font-body" style={{ fontSize: 11, color: '#4A5A7A' }}>{item.value}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="#7A8BAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Edit sheets */}
      <BottomSheet open={editSheet === 'name'} onClose={() => setEditSheet(null)}>
        <EditSheet label="name" value={user.name} onSave={v => updateUser({ name: v })} onClose={() => setEditSheet(null)} />
      </BottomSheet>
      <BottomSheet open={editSheet === 'company'} onClose={() => setEditSheet(null)}>
        <EditSheet label="target company" value={user.company} onSave={v => updateUser({ company: v })} onClose={() => setEditSheet(null)} />
      </BottomSheet>
      <BottomSheet open={editSheet === 'date'} onClose={() => setEditSheet(null)}>
        <EditSheet label="interview date" value={user.interviewDate} type="date" onSave={v => updateUser({ interviewDate: v })} onClose={() => setEditSheet(null)} />
      </BottomSheet>
      <BottomSheet open={editSheet === 'reminder'} onClose={() => setEditSheet(null)}>
        <ReminderSheet current={user.reminderTime} onSave={v => updateUser({ reminderTime: v })} onClose={() => setEditSheet(null)} />
      </BottomSheet>
    </>
  );
}
