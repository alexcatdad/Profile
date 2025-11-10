import type { Metadata } from 'next';
import '../globals.css';
import { ThemeScript } from '@/components/ThemeScript';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Professional Profile',
    description: 'Professional developer profile and CV',
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
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
