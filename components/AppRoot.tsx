'use client';

import { useEffect, useState } from 'react';
import { isOnboardingComplete } from '@/lib/storage';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import HomeScreen from '@/components/home/HomeScreen';

function DesktopGate() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-8"
      style={{ background: 'linear-gradient(160deg, #080F1E 0%, #0A1628 50%, #0D1E3A 100%)' }}
    >
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        {/* Phone icon */}
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center"
          style={{ background: 'rgba(79,110,247,0.12)', border: '1px solid rgba(79,110,247,0.2)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B96FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
          </svg>
        </div>

        <div>
          <h1 className="font-display font-bold mb-2" style={{ fontSize: 22, color: '#F0F4FF' }}>
            Prep is built for mobile
          </h1>
          <p className="font-body leading-relaxed" style={{ fontSize: 14, color: '#7A8BAD', lineHeight: 1.7 }}>
            Open this on your phone for the full experience. Then add it to your home screen to use it like an app.
          </p>
        </div>

        <div
          className="rounded-2xl px-5 py-4 w-full text-left"
          style={{ background: 'rgba(15,32,64,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="font-body uppercase tracking-widest mb-3" style={{ fontSize: 9, color: '#7A8BAD', letterSpacing: '0.1em' }}>
            How to install
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: '📱', text: 'iPhone — tap Share → "Add to Home Screen"' },
              { icon: '🤖', text: 'Android — tap menu → "Add to Home Screen"' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <p className="font-body" style={{ fontSize: 12, color: '#B8C8E8', lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-body" style={{ fontSize: 11, color: '#4A5A7A' }}>
          prep — interview fitness for the AI era
        </p>
      </div>
    </div>
  );
}

export default function AppRoot() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setOnboarded(isOnboardingComplete());
    setIsMobile(window.innerWidth <= 480);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!isMobile) return <DesktopGate />;

  if (!onboarded) {
    return <OnboardingFlow onComplete={() => setOnboarded(true)} />;
  }

  return <HomeScreen />;
}
