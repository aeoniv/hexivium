
import type {Metadata} from 'next';
import { Rajdhani } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GlobalLayout } from '@/components/global-layout';
import { CalendarProvider } from '@/contexts/calendar-context';
import { GlobalStateProvider } from '@/contexts/global-state-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import { AgentProvider } from '@/contexts/agent-context';
import ChunkErrorReloader from '@/components/chunk-error-reloader';
import { LanguageProvider } from '@/context/language-context';
import { Analytics } from '@vercel/analytics/react';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const siteTitle = 'Jornada Shaolin de Verão | Acampamento de Kung Fu';
const siteDescription = 'Participe de um acampamento de verão imersivo em Kung Fu, Medicina Chinesa e I-Ching com o mestre Shi Heng Yong Yi em João Pessoa.';
const siteUrl = 'https://shaolin-summer-journey.com';
const siteImage = '/og-image.png';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: ['Kung Fu', 'Shaolin', 'Acampamento de Verão', 'Retiro Espiritual', 'Medicina Chinesa', 'I-Ching', 'Artes Marciais', 'João Pessoa', 'Brasil'],
  authors: [{ name: 'Shi Heng Yong Yi' }],
  creator: 'Shi Heng Yong Yi',
  
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: 'Monge Shaolin em pose de Kung Fu ao nascer do sol.',
      },
    ],
    locale: 'pt_BR',
    siteName: 'Jornada Shaolin de Verão',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
    creator: '@shihengyongyi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${rajdhani.variable} font-body antialiased`}>
        <ThemeProvider>
          <FirebaseClientProvider>
             <LanguageProvider>
              <AgentProvider>
                <GlobalStateProvider>
                  <CalendarProvider>
                    <GlobalLayout>
                      {/* Auto-reload on transient chunk load failures (dev/reload safety) */}
                      <ChunkErrorReloader />
                      {children}
                    </GlobalLayout>
                  </CalendarProvider>
                </GlobalStateProvider>
              </AgentProvider>
            </LanguageProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
