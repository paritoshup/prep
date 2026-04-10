'use client';

import { useState, useEffect } from 'react';
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
  const H = 440;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0A1628');
  bg.addColorStop(0.6, '#0D1E3A');
  bg.addColorStop(1, '#0F2744');
  roundRect(ctx, 0, 0, W, H, 48);
  ctx.fillStyle = bg;
  ctx.fill();

  // Border
  roundRect(ctx, 1.5, 1.5, W - 3, H - 3, 47);
  ctx.strokeStyle = 'rgba(79,110,247,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // App label
  ctx.font = '500 22px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7A8BAD';
  ctx.fillText('PREP · INTERVIEW FITNESS', 48, 70);

  // User name
  ctx.font = 'bold 52px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#F0F4FF';
  ctx.fillText(userName, 48, 136);

  // Rank pill
  const rankText = rank.toUpperCase();
  ctx.font = '600 20px -apple-system, system-ui, sans-serif';
  const rankW = ctx.measureText(rankText).width + 32;
  roundRect(ctx, W - 48 - rankW, 44, rankW, 40, 20);
  ctx.fillStyle = 'rgba(245,158,11,0.15)';
  ctx.fill();
  roundRect(ctx, W - 48 - rankW, 44, rankW, 40, 20);
  ctx.strokeStyle = 'rgba(245,158,11,0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#F59E0B';
  ctx.fillText(rankText, W - 48 - rankW + 16, 71);

  // Score card
  roundRect(ctx, 48, 160, W - 96, 100, 24);
  ctx.fillStyle = 'rgba(79,110,247,0.1)';
  ctx.fill();
  roundRect(ctx, 48, 160, W - 96, 100, 24);
  ctx.strokeStyle = 'rgba(79,110,247,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Score label
  ctx.font = '500 18px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7A8BAD';
  ctx.fillText('DRILL SCORE', 72, 192);

  // Score number
  const scoreColor = score >= 80 ? '#4ADE80' : score >= 60 ? '#F6B84B' : '#FB7185';
  ctx.font = 'bold 64px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = scoreColor;
  ctx.fillText(`${score}`, 72, 248);
  ctx.font = '500 28px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7A8BAD';
  ctx.fillText('/100', 72 + ctx.measureText(`${score}`).width + 6, 248);

  // Drill type
  ctx.font = '600 18px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7A8BAD';
  ctx.textAlign = 'right';
  ctx.fillText('DRILL', W - 72, 192);
  ctx.font = 'bold 20px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#7B96FF';
  ctx.fillText(drillType, W - 72, 218);
  ctx.textAlign = 'left';

  // Keywords
  if (keywords.length > 0) {
    let kx = 48;
    const ky = 292;
    ctx.font = '600 18px -apple-system, system-ui, sans-serif';
    for (const kw of keywords.slice(0, 4)) {
      const tw = ctx.measureText(kw).width;
      const pw = tw + 24;
      if (kx + pw > W - 48) break;
      roundRect(ctx, kx, ky, pw, 36, 18);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fill();
      roundRect(ctx, kx, ky, pw, 36, 18);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#F0F4FF';
      ctx.fillText(kw, kx + 12, ky + 24);
      kx += pw + 10;
    }
  }

  // CTA bar
  roundRect(ctx, 48, 352, W - 96, 52, 26);
  const ctaBg = ctx.createLinearGradient(48, 0, W - 48, 0);
  ctaBg.addColorStop(0, '#4F6EF7');
  ctaBg.addColorStop(1, '#6B84FF');
  ctx.fillStyle = ctaBg;
  ctx.fill();
  ctx.font = 'bold 22px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Can you beat this? Try Prep →', W / 2, 386);
  ctx.textAlign = 'left';

  // Watermark
  ctx.font = '400 16px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#4A5A7A';
  ctx.textAlign = 'center';
  ctx.fillText('prep.app · Interview Fitness', W / 2, 428);
  ctx.textAlign = 'left';

  return new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png'));
}

export default function ShareCard({ drill, keywords, score, userName, rank }: ShareCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string;
    generateCardBlob(userName, rank, score, drill.type, keywords).then(blob => {
      url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    });
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [userName, rank, score, drill.type, keywords]);

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
          className="flex-1 font-display font-bold text-white cursor-pointer rounded-[100px] flex items-center justify-center gap-2"
          style={{ height: 46, background: 'linear-gradient(135deg, #4F6EF7, #6B84FF)', fontSize: 13, fontWeight: 700, opacity: sharing ? 0.7 : 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
