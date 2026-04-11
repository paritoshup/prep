'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';

interface ShareCardProps {
  drill: Drill;
  keywords: string[];
  score: number;
  userName: string;
  rank: string;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateCardBlob(
  userName: string,
  rank: string,
  score: number,
  drillType: string,
  keywords: string[],
): Promise<Blob> {
  const W = 640;
  const H = 400;
  const PAD = 48;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ────────────────────────────────────────────────────────
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.fillStyle = '#F2F0EB';
  ctx.fill();

  // Border
  roundRect(ctx, 1, 1, W - 2, H - 2, 31);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── App label (top-left) ──────────────────────────────────────────────
  ctx.font = '500 13px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#888880';
  ctx.letterSpacing = '0.08em';
  ctx.fillText('PREP · INTERVIEW FITNESS', PAD, 52);
  ctx.letterSpacing = '0';

  // ── Rank pill (top-right) ─────────────────────────────────────────────
  const rankText = rank.toUpperCase();
  ctx.font = '600 12px -apple-system, system-ui, sans-serif';
  const rankW = ctx.measureText(rankText).width + 24;
  const rankX = W - PAD - rankW;
  roundRect(ctx, rankX, 34, rankW, 28, 14);
  ctx.fillStyle = 'rgba(245,166,35,0.12)';
  ctx.fill();
  roundRect(ctx, rankX, 34, rankW, 28, 14);
  ctx.strokeStyle = 'rgba(245,166,35,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#C47E0A';
  ctx.fillText(rankText, rankX + 12, 52);

  // ── User name ─────────────────────────────────────────────────────────
  ctx.font = 'bold 40px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#1A1A1A';
  let displayName = userName;
  while (ctx.measureText(displayName).width > W - PAD * 2 - rankW - 24 && displayName.length > 4) {
    displayName = displayName.slice(0, -1);
  }
  if (displayName !== userName) displayName += '…';
  ctx.fillText(displayName, PAD, 110);

  // ── Divider ───────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, 130);
  ctx.lineTo(W - PAD, 130);
  ctx.stroke();

  // ── Score section ─────────────────────────────────────────────────────
  let scoreColor = '#888880';
  if (score >= 80) scoreColor = '#1A9E5C';
  else if (score >= 60) scoreColor = '#C47E0A';
  else if (score > 0) scoreColor = '#E53E3E';

  // Score number — large
  ctx.font = 'bold 72px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = scoreColor;
  const scoreStr = `${score}`;
  ctx.fillText(scoreStr, PAD, 218);

  // "/100" — smaller, muted, baseline-aligned
  const scoreNumW = ctx.measureText(scoreStr).width;
  ctx.font = '400 22px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(136,136,128,0.6)';
  ctx.fillText('/100', PAD + scoreNumW + 6, 218);

  // "SCORE" label beneath
  ctx.font = '500 11px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(136,136,128,0.5)';
  ctx.letterSpacing = '0.1em';
  ctx.fillText('SCORE', PAD, 238);
  ctx.letterSpacing = '0';

  // ── Drill type (right side of score row) ──────────────────────────────
  ctx.font = '500 11px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(136,136,128,0.5)';
  ctx.letterSpacing = '0.1em';
  ctx.textAlign = 'right';
  ctx.fillText('DRILL TYPE', W - PAD, 158);
  ctx.letterSpacing = '0';
  ctx.font = '700 16px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#2B52C8';
  ctx.fillText(drillType, W - PAD, 182);
  ctx.textAlign = 'left';

  // ── Keywords ──────────────────────────────────────────────────────────
  if (keywords.length > 0) {
    let kx = PAD;
    const ky = 258;
    ctx.font = '500 13px -apple-system, system-ui, sans-serif';
    for (const kw of keywords.slice(0, 5)) {
      const tw = ctx.measureText(kw).width;
      const pw = tw + 20;
      if (kx + pw > W - PAD) break;
      roundRect(ctx, kx, ky, pw, 28, 14);
      ctx.fillStyle = '#EBF0FF';
      ctx.fill();
      roundRect(ctx, kx, ky, pw, 28, 14);
      ctx.strokeStyle = 'rgba(59,110,248,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#2B52C8';
      ctx.fillText(kw, kx + 10, ky + 19);
      kx += pw + 8;
    }
  }

  // ── CTA button ────────────────────────────────────────────────────────
  const btnY = H - 88;
  roundRect(ctx, PAD, btnY, W - PAD * 2, 48, 14);
  ctx.fillStyle = '#FF5C35';
  ctx.fill();
  ctx.font = '700 16px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Can you beat this? Try Prep →', W / 2, btnY + 30);
  ctx.textAlign = 'left';

  // ── Watermark ─────────────────────────────────────────────────────────
  ctx.font = '400 12px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(136,136,128,0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('prep.app', W / 2, H - 18);
  ctx.textAlign = 'left';

  return new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png'));
}

export default function ShareCard({ drill, keywords, score, userName, rank }: ShareCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateCardBlob(userName, rank, score, drill.type, keywords).then(blob => {
      if (cancelled) return;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setPreviewUrl(url);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, rank, score, drill.type, keywords.join(',')]);

  // Revoke on unmount
  useEffect(() => {
    return () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, []);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await generateCardBlob(userName, rank, score, drill.type, keywords);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prep-${userName.toLowerCase().replace(/\s/g, '-')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const blob = await generateCardBlob(userName, rank, score, drill.type, keywords);
      const file = new File([blob], 'prep-score.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'I just drilled with Prep',
          text: `Scored ${score}/100 on "${drill.type}". Can you beat it?`,
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prep-score.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas-rendered preview — exactly what gets saved */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border2)' }}>
        {previewUrl ? (
          <img src={previewUrl} alt="Score card preview" className="w-full block" style={{ borderRadius: 16 }} />
        ) : (
          <div className="flex items-center justify-center" style={{ height: 140, background: 'var(--surface2)' }}>
            <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border2)', borderTopColor: 'var(--accent)' }} />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={sharing}
          className="flex-1 font-display cursor-pointer rounded-[100px] flex items-center justify-center gap-2"
          style={{ height: 46, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--muted)', opacity: sharing ? 0.7 : 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {sharing ? 'Sharing...' : 'Challenge a friend'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={downloading}
          className="cursor-pointer rounded-[100px] flex items-center justify-center"
          style={{ width: 46, height: 46, background: 'var(--surface2)', border: '1px solid var(--border)', opacity: downloading ? 0.7 : 1 }}
          aria-label="Download card"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
