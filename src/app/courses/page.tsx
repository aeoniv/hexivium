

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import ChatInterface from './chat-interface';

function CoursesLoading() {
  return (
    <div className="space-y-8 p-4 md:p-8 pt-24 w-full">
      <div className="max-w-4xl mx-auto space-y-8 mt-8">
        <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-80" />
              <Skeleton className="h-10 w-48" />
            </div>
        </div>
         <div className="flex flex-row-reverse items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-12 w-64" />
        </div>
         <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-96 w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/courses');
    }
  }, [user, isUserLoading, router]);

  return (
    <>
      <Script src="https://ix384.h5p.com/js/h5p-resizer.js" charset="UTF-8" strategy="afterInteractive" />
      <div className="flex flex-col bg-background h-screen">
        <main className="flex-1 pt-24 pb-8 px-4 md:px-6 flex flex-col h-full overflow-hidden">
            {(isUserLoading || !user) ? <CoursesLoading /> : <ChatInterface />}
        </main>
      </div>
    </>
  );
}
