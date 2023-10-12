import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import LocalFont from 'next/font/local';
import type { Metadata } from 'next';
import Nav from '@/components/ui/nav';
import Particles from '@/components/particles';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Anime Quiz',
  description: 'Put your anime knowledge to the test!',
  keywords: [
    'Anime',
    'Quiz',
    'Game',
    'Loldle',
    'Loldle Anime Quiz',
    'Loldle',
    'Anime Quiz',
    'Wordle',
    'Anime Game',
    'Quiz Game',
    'Anime Quiz Game',
    'Anime Quiz Game Online',
  ],
  icons: {
    shortcut: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': '-1',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'animequiz.app',
    description: 'Put your anime knowledge to the test!',
    url: 'https://animequiz.app',
    siteName: 'animequiz.app',
    locale: 'en_US',
    type: 'website',
  },
};

const daniel = LocalFont({
  src: '../../public/fonts/daniel.ttf',
  variable: '--font-daniel',
});

const danielBd = LocalFont({
  src: '../../public/fonts/danielbd.ttf',
  variable: '--font-danielbd',
});

const danielBk = LocalFont({
  src: '../../public/fonts/danielbk.ttf',
  variable: '--font-danielbk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={[daniel.variable, danielBd.variable, danielBk.variable].join(
          ' '
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <main className='flex flex-col items-center font-sans py-12 relative overflow-y-auto overflow-x-hidden min-h-screen'>
            <Nav />
            <Particles
              className='absolute inset-0 -z-10 animate-fade-in min-h-screen'
              staticity={100}
            />
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
