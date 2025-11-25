'use client';

import { cn } from '@/lib/utils';

type TabType = 'full' | 'experience' | 'skills' | 'projects' | 'personal';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'full', label: 'Full profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'personal', label: 'Personal' },
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-border bg-secondary/50 p-2 text-sm font-semibold text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={cn(
              'relative flex-1 rounded-xl px-4 py-2 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60',
              isActive
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-apple dark:from-emerald-500 dark:to-emerald-600'
                : 'text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white'
            )}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-emerald-500/80 to-emerald-600/80 shadow-apple dark:from-emerald-500/80 dark:to-emerald-600/80"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
