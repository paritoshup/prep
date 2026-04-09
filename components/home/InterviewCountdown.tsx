'use client';

import { getDaysUntilInterview, getUser } from '@/lib/storage';

export default function InterviewCountdown() {
  const days = getDaysUntilInterview();
  const user = getUser();

  if (days === null) return null;

  const company = user?.company;
  const label = company ? `${days}d to interview at ${company}` : `${days} days to your interview`;

  let color = '#4ADE80';
  let bg = 'rgba(34,197,94,0.1)';
  let border = 'rgba(34,197,94,0.2)';

  if (days <= 3) {
    color = '#FB7185'; bg = 'rgba(251,113,133,0.1)'; border = 'rgba(251,113,133,0.2)';
  } else if (days <= 7) {
    color = '#F6B84B'; bg = 'rgba(246,184,75,0.1)'; border = 'rgba(246,184,75,0.2)';
  }

  if (days < 0) return null; // interview passed

  return (
    <div
      className="rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="font-body whitespace-nowrap" style={{ fontSize: 11, color, fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
