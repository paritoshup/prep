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
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#080F1E');
  bg.addColorStop(1, '#0D1E3A');
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.fillStyle = bg;
  ctx.fill();

  // Border
  roundRect(ctx, 1, 1, W - 2, H - 2, 31);
  ctx.strokeStyle = 'rgba(79,110,247,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── App label (top-left) ──────────────────────────────────────────────
  ctx.font = '500 13px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(122,139,173,0.7)';
  ctx.letterSpacing = '0.08em';
  ctx.fillText('PREP · INTERVIEW FITNESS', PAD, 52);
  ctx.letterSpacing = '0';

  // ── Rank pill (top-right) ─────────────────────────────────────────────
  const rankText = rank.toUpperCase();
  ctx.font = '600 12px -apple-system, system-ui, sans-serif';
  const rankW = ctx.measureText(rankText).width + 24;
  const rankX = W - PAD - rankW;
  roundRect(ctx, rankX, 34, rankW, 28, 14);
  ctx.fillStyle = 'rgba(245,158,11,0.12)';
  ctx.fill();
  roundRect(ctx, rankX, 34, rankW, 28, 14);
  ctx.strokeStyle = 'rgba(245,158,11,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#F59E0B';
  ctx.fillText(rankText, rankX + 12, 52);

  // ── User name ─────────────────────────────────────────────────────────
  // Truncate if too long
  ctx.font = 'bold 40px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#F0F4FF';
  let displayName = userName;
  while (ctx.measureText(displayName).width > W - PAD * 2 - rankW - 24 && displayName.length > 4) {
    displayName = displayName.slice(0, -1);
  }
  if (displayName !== userName) displayName += '…';
  ctx.fillText(displayName, PAD, 110);

  // ── Divider ───────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, 130);
  ctx.lineTo(W - PAD, 130);
  ctx.stroke();

  // ── Score section ─────────────────────────────────────────────────────
  const scoreColor = score >= 80 ? '#4ADE80' : score >= 60 ? '#F6B84B' : score > 0 ? '#FB7185' : '#7A8BAD';

  // Score number — large
  ctx.font = 'bold 72px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = scoreColor;
  const scoreStr = `${score}`;
  ctx.fillText(scoreStr, PAD, 218);

  // "/100" — smaller, muted, baseline-aligned
  const scoreNumW = ctx.measureText(scoreStr).width;
  ctx.font = '400 22px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(122,139,173,0.6)';
  ctx.fillText('/100', PAD + scoreNumW + 6, 218);

  // "SCORE" label beneath
  ctx.font = '500 11px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(122,139,173,0.5)';
  ctx.letterSpacing = '0.1em';
  ctx.fillText('SCORE', PAD, 238);
  ctx.letterSpacing = '0';

  // ── Drill type (right side of score row) ──────────────────────────────
  ctx.font = '500 11px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(122,139,173,0.5)';
  ctx.letterSpacing = '0.1em';
  ctx.textAlign = 'right';
  ctx.fillText('DRILL TYPE', W - PAD, 158);
  ctx.letterSpacing = '0';
  ctx.font = '700 16px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7B96FF';
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
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fill();
      roundRect(ctx, kx, ky, pw, 28, 14);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#B8C8E8';
      ctx.fillText(kw, kx + 10, ky + 19);
      kx += pw + 8;
    }
  }

  // ── CTA button ────────────────────────────────────────────────────────
  const btnY = H - 88;
  roundRect(ctx, PAD, btnY, W - PAD * 2, 48, 24);
  const ctaBg = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  ctaBg.addColorStop(0, '#4F6EF7');
  ctaBg.addColorStop(1, '#6B84FF');
  ctx.fillStyle = ctaBg;
  ctx.fill();
  ctx.font = '700 16px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Can you beat this? Try Prep →', W / 2, btnY + 30);
  ctx.textAlign = 'left';

  // ── Watermark ─────────────────────────────────────────────────────────
  ctx.font = '400 12px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(74,90,122,0.6)';
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
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(79,110,247,0.25)' }}>
        {previewUrl ? (
          <img src={previewUrl} alt="Score card preview" className="w-full block" style={{ borderRadius: 16 }} />
        ) : (
          <div className="flex items-center justify-center" style={{ height: 140, background: 'rgba(15,32,64,0.7)' }}>
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(79,110,247,0.4)', borderTopColor: 'transparent' }} />
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
          style={{ height: 46, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 600, color: '#B8C8E8', opacity: sharing ? 0.7 : 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8C8E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', opacity: downloading ? 0.7 : 1 }}
          aria-label="Download card"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F0F4FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
