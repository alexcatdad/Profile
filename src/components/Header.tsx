'use client';

import { ArrowUpRight, Globe, Mail, MapPin, UserRound } from 'lucide-react';
import type { Basics } from '@/types/json-resume';

interface HeaderProps {
  basics?: Basics;
}

export function Header({ basics }: HeaderProps) {
  if (!basics) return null;

  const location = basics.location
    ? `${basics.location.city || ''}${basics.location.city && basics.location.countryCode ? ', ' : ''}${basics.location.countryCode || ''}`
    : '';

  const contactItems = [
    basics.email && {
      icon: Mail,
      label: basics.email,
      href: `mailto:${basics.email}`,
    },
    location && {
      icon: MapPin,
      label: location,
    },
    basics.url && {
      icon: Globe,
      label: basics.url.replace(/^https?:\/\//, ''),
      href: basics.url,
    },
  ].filter((item): item is { icon: typeof Mail; label: string; href?: string } => Boolean(item));

  const featuredProfile = basics.profiles?.[0];

  return (
    <header className="interactive-card mb-10 rounded-3xl border border-border bg-card/50 p-6 shadow-apple-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {basics.name && (
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl dark:text-white">
              {basics.name}
            </h1>
          )}
          {basics.label && (
            <p className="text-lg font-medium text-emerald-600 dark:text-emerald-300/90 transition-opacity">
              {basics.label}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-zinc-400">
            {location && (
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-foreground dark:bg-white/5 dark:text-zinc-100">
                {location}
              </span>
            )}
            {basics.pronouns && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] text-foreground dark:bg-white/5 dark:text-zinc-100">
                <UserRound className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
                {basics.pronouns}
              </span>
            )}
          </div>
        </div>
        {featuredProfile && (
          <a
            href={featuredProfile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-emerald-500/60 hover:text-emerald-600 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-emerald-400/60 dark:hover:text-emerald-300"
          >
            <span>{featuredProfile.network}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>

      {contactItems.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const sharedProps = {
              className:
                'group flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-200',
            };
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`${sharedProps.className} hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200`}
              >
                <Icon className="h-4 w-4 text-emerald-500 transition group-hover:scale-110 dark:text-emerald-300" />
                <span className="truncate">{item.label}</span>
              </a>
            ) : (
              <div key={item.label} className={sharedProps.className}>
                <Icon className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}
