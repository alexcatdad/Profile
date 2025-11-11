import type { Metadata } from 'next';
import '../globals.css';
import { ThemeScript } from '@/components/ThemeScript';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Professional Profile',
    description: 'Professional developer profile and CV showcasing experience, projects, and skills',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Profile',
    },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
      { media: '(prefers-color-scheme: dark)', color: '#60A5FA' },
    ],
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased bg-background text-foreground">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
