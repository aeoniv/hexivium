
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import Footer from '@/app/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import AdminDashboard from './admin-dashboard';

const ADMIN_EMAIL = 'shi.heng.yong.yi@gmail.com';

function AdminLoading() {
  return (
    <div className="space-y-8 p-4 md:p-8 pt-24">
       <Skeleton className="h-48 w-full" />
       <Skeleton className="h-64 w-full" />
       <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && (!user || user.email !== ADMIN_EMAIL)) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
        return (
          <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1">
              <AdminLoading />
            </main>
            <Footer />
          </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pt-24">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
