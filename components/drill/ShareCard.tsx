'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Drill } from '@/lib/mockData';

interface ShareCardProps {
  drill: Drill;
  keywords: string[];
  userName: string;
  rank: string;
}

/* ─── The visual card (also rendered to canvas) ──────────────────── */
function CardVisual({
  drill,
  keywords,
  userName,
  rank,
}: ShareCardProps) {
  const score = Math.min(100, 60 + keywords.length * 8);

  return (
    <div
      style={{
        width: 320,
        background: 'linear-gradient(145deg, #0A1628 0%, #0D1E3A 60%, #0F2744 100%)',
        borderRadius: 24,
        padding: 24,
        border: '1px solid rgba(79,110,247,0.3)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 9, color: '#7A8BAD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Prep · Interview Fitness
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F4FF', lineHeight: 1.2 }}>
            {userName}
          </p>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            borderRadius: 100,
            padding: '1px',
          }}
        >
          <div
            style={{
              background: '#080F1E',
              borderRadius: 100,
              padding: '4px 10px',
            }}
          >
            <span style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600 }}>{rank}</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div
        style={{
          background: 'rgba(79,110,247,0.1)',
          border: '1px solid rgba(79,110,247,0.2)',
          borderRadius: 16,
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: 9, color: '#7A8BAD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Drill Score
          </p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
            {score}<span style={{ fontSize: 16, color: '#7A8BAD' }}>/100</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 9, color: '#7A8BAD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Drill
          </p>
          <p style={{ fontSize: 11, color: '#7B96FF', fontWeight: 600, maxWidth: 120, textAlign: 'right', lineHeight: 1.3 }}>
            {drill.type}
          </p>
        </div>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, color: '#7A8BAD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Keywords detected
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {keywords.map((w, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  padding: '4px 10px',
                  fontSize: 11,
                  color: '#F0F4FF',
                  fontWeight: 600,
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4F6EF7, #6B84FF)',
          borderRadius: 100,
          padding: '10px 16px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>
          Can you beat this? Try Prep →
        </p>
      </div>

      {/* Watermark */}
      <p style={{ fontSize: 9, color: '#4A5A7A', textAlign: 'center', marginTop: 12 }}>
        prep.app · Interview Fitness
      </p>
    </div>
  );
}

/* ─── Share Card wrapper ─────────────────────────────────────────── */
export default function ShareCard({ drill, keywords, userName, rank }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `prep-score-${userName.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (!cardRef.current || sharing) return;
    setSharing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'prep-score.png', { type: 'image/png' });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'I just crushed a Prep drill 🎯',
            text: `I scored on the "${drill.type}" drill. Challenge me →`,
          });
        } else {
          // Fallback to download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'prep-score.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Card preview */}
      <div ref={cardRef}>
        <CardVisual drill={drill} keywords={keywords} userName={userName} rank={rank} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-[320px]">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={sharing}
          className="flex-1 font-display font-bold text-white cursor-pointer rounded-[100px] flex items-center justify-center gap-2"
          style={{
            height: 48,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #6B84FF 100%)',
            fontSize: 14,
            fontWeight: 700,
            opacity: sharing ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(79,110,247,0.3)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {sharing ? 'Sharing...' : 'Challenge a friend'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={downloading}
          className="cursor-pointer rounded-[100px] flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: downloading ? 0.7 : 1,
          }}
          aria-label="Download card"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
