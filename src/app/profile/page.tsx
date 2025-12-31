
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import Footer from '@/components/footer';
import EnergyDashboardSection from '@/components/energy-dashboard-section';
import ClassScheduleSection from '@/components/class-schedule-section';
import EnergyMarketplaceSection from '@/components/energy-marketplace-section';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';

function ProfileLoading() {
  return (
    <div className="space-y-8 p-4 md:p-8 pt-24">
       <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function WelcomeSection({ displayName }: { displayName: string | null }) {
    const { t } = useTranslation();
    return (
        <section className="py-8 md:py-12 bg-background pt-24">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="bg-secondary border-primary/20">
                    <CardContent className="p-6">
                        <h2 className="font-headline text-3xl md:text-4xl text-foreground">
                           {displayName ? t('welcomeBack', { name: displayName }) : t('welcomeWarrior')}
                        </h2>
                        <p className="mt-2 text-lg text-muted-foreground">
                            {t('welcomeMessage')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}


export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
          <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1">
              <ProfileLoading />
            </main>
            <Footer />
          </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <WelcomeSection displayName={user.displayName} />
        <EnergyDashboardSection />
        <ClassScheduleSection />
        <EnergyMarketplaceSection />
      </main>
      <Footer />
    </div>
  );
}
