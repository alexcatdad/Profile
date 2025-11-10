'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { getAccessData } from '@/lib/storage';
import type { Profile } from '@/types/content';
import { AccessModal } from './AccessModal';
import { WelcomeToast } from './WelcomeToast';

interface AccessGateProps {
  dictionary: Dictionary;
  profile: Profile;
  children: React.ReactNode;
}

export function AccessGate({ dictionary, profile, children }: AccessGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const accessData = getAccessData();
    if (accessData?.granted) {
      setHasAccess(true);
    }
    setIsChecking(false);
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <AccessModal
        isOpen={true}
        onClose={handleAccessGranted}
        dictionary={dictionary}
        profileName={profile.name}
        profileTitle={profile.title}
        headshot={profile.headshot}
      />
    );
  }

  return (
    <>
      <WelcomeToast />
      {children}
    </>
  );
}
