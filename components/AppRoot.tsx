'use client';

import { useEffect, useState } from 'react';
import { isOnboardingComplete } from '@/lib/storage';
import IntroSlides from '@/components/onboarding/IntroSlides';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import HomeScreen from '@/components/home/HomeScreen';

type Screen = 'loading' | 'intro' | 'onboarding' | 'home';

export default function AppRoot() {
  const [screen, setScreen] = useState<Screen>('loading');

  useEffect(() => {
    const onboarded = isOnboardingComplete();
    if (onboarded) {
      setScreen('home');
      return;
    }
    const introSeen = localStorage.getItem('prep_intro_seen') === 'true';
    setScreen(introSeen ? 'onboarding' : 'intro');
  }, []);

  if (screen === 'loading') return null;

  return (
    <div className="mobile-shell">
      {screen === 'intro' && (
        <IntroSlides onComplete={() => setScreen('onboarding')} />
      )}
      {screen === 'onboarding' && (
        <OnboardingFlow onComplete={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <HomeScreen />
      )}
    </div>
  );
}
