'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#FF5C35', '#3B6EF8', '#1A9E5C', '#F5A623', '#C084FC', '#FB7185', '#F2F0EB'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number; rotationSpeed: number;
  color: string;
  w: number; h: number;
  life: number;
}

interface Props {
  active: boolean;
  message?: string;
}

export default function ConfettiCelebration({ active, message }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.38;

    particles.current = Array.from({ length: 90 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      return {
        x: cx + (Math.random() - 0.5) * 80,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 6 + Math.random() * 7,
        h: 10 + Math.random() * 8,
        life: 1,
      };
    });

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      let alive = false;
      for (const p of particles.current) {
        p.vy    += 0.28;
        p.x     += p.vx;
        p.y     += p.vy;
        p.rotation += p.rotationSpeed;
        p.life  -= 0.011;
        if (p.life <= 0) continue;
        alive = true;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      }
      if (alive) rafRef.current = requestAnimationFrame(tick);
      else ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none', zIndex: 300,
          display: active ? 'block' : 'none',
        }}
      />
      <AnimatePresence>
        {active && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 310,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              className="font-display text-center px-8 py-6 rounded-3xl"
              style={{
                background: '#1A1A1A',
                boxShadow: '0 16px 60px rgba(0,0,0,0.25)',
                maxWidth: 300,
              }}
            >
              <p style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Milestone
              </p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
