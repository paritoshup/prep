'use client';

import { useEffect, useState } from 'react';
import { isOnboardingComplete } from '@/lib/storage';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import HomeScreen from '@/components/home/HomeScreen';

export default function AppRoot() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    setOnboarded(isOnboardingComplete());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!onboarded) {
    return (
      <div className="mobile-shell">
        <OnboardingFlow onComplete={() => setOnboarded(true)} />
      </div>
    );
  }

  return (
    <div className="mobile-shell">
      <HomeScreen />
    </div>
  );
}
