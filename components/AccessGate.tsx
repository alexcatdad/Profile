'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { getAccessData } from '@/lib/storage';
import type { Basics } from '@/types/json-resume';
import { AccessModal } from './AccessModal';
import { WelcomeToast } from './WelcomeToast';

interface AccessGateProps {
  dictionary: Dictionary;
  basics?: Basics;
  children: React.ReactNode;
}

export function AccessGate({ dictionary, basics, children }: AccessGateProps) {
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff47c0]" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <AccessModal
        isOpen={true}
        onClose={handleAccessGranted}
        dictionary={dictionary}
        profileName={basics?.name || ''}
        profileTitle={basics?.label || ''}
        headshot={basics?.image || ''}
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
