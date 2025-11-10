'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 z-50 bg-card border border-border shadow-lg rounded-lg px-6 py-4"
        >
          <p className="text-card-foreground">Welcome back, {name}!</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
