'use client';

import { useButton } from '@react-aria/button';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const updateTheme = useCallback((newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    root.style.colorScheme = newTheme;
    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = stored || (prefersDark ? 'dark' : 'light');
    setTheme(currentTheme);
    updateTheme(currentTheme);
  }, [updateTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  const buttonProps = useButton({
    onPress: toggleTheme,
  }).buttonProps;

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center animate-pulse" />
    );
  }

  return (
    <button
      {...buttonProps}
      type="button"
      className="w-10 h-10 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-border hover:border-primary/50"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </button>
  );
}
