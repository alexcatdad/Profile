'use client';

import { useEffect, useState } from 'react';
import { getAccessData } from '@/lib/storage';

export function WelcomeToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const accessData = getAccessData();
    if (accessData?.granted && accessData.name) {
      setName(accessData.name);
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transform-gpu transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-4'
      }`}
    >
      <div className="glass-strong border border-border shadow-lg rounded-lg px-6 py-4">
        <p className="text-card-foreground">Welcome back, {name}!</p>
      </div>
    </div>
  );
}
