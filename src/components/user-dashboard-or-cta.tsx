
'use client';

import AiScheduleGenerator from './ai-schedule-generator';
import EnergyDashboardSection from './energy-dashboard-section';
import ClassScheduleSection from './class-schedule-section';
import EnergyMarketplaceSection from './energy-marketplace-section';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/lib/auth';
import { useAuth } from '@/firebase/client-provider';

function DashboardLoading() {
    return (
      <div className="container mx-auto px-4 md:px-6 space-y-8 py-12 md:py-24">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

export default function UserDashboardOrCTA() {
  const auth = useAuth();
  const user = useUser(auth);

  if (user === undefined) {
    return <DashboardLoading />;
  }

  if (user) {
    return (
      <>
        <EnergyDashboardSection />
        <ClassScheduleSection />
        <EnergyMarketplaceSection />
      </>
    );
  }

  return <AiScheduleGenerator />;
}
