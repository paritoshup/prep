interface RankBadgeProps {
  rank: string;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  return (
    <div
      className="p-[1px] rounded-full shrink-0"
      style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}
    >
      <div className="rounded-full px-3 py-1" style={{ background: 'var(--surface)' }}>
        <span
          className="font-body font-medium text-[11px] tracking-wide"
          style={{ color: '#F59E0B' }}
        >
          {rank}
        </span>
      </div>
    </div>
  );
}
