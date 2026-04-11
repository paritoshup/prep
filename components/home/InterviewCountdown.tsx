'use client';

import { getDaysUntilInterview, getUser } from '@/lib/storage';

export default function InterviewCountdown() {
  const days = getDaysUntilInterview();
  const user = getUser();

  if (days === null || days < 0) return null;

  const company = user?.company;
  const label = company ? `${days}d to interview at ${company}` : `${days} days to your interview`;

  let color = 'var(--green-text)';
  let bg = 'var(--green-bg)';

  if (days <= 3) {
    color = 'var(--red-text)'; bg = 'var(--red-bg)';
  } else if (days <= 7) {
    color = 'var(--amber-text)'; bg = 'var(--amber-bg)';
  }

  return (
    <div
      className="rounded-full px-3 py-1.5 flex items-center gap-2 self-start"
      style={{ background: bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="font-body whitespace-nowrap" style={{ fontSize: 11, color, fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
