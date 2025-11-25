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
    <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-sm font-semibold text-zinc-400">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={cn(
              'relative flex-1 rounded-xl px-4 py-2 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60',
              isActive
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-apple'
                : 'text-zinc-400 hover:text-white'
            )}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
