
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

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});


export const metadata: Metadata = {
  title: 'Hexivium',
  description: 'A calendar system based on I Ching hexagrams and Neidan alchemy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-body antialiased">
        <ThemeProvider>
          <FirebaseClientProvider>
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
          </FirebaseClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
