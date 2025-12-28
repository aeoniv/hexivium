
'use client';

import { GridJourneyView } from '@/components/grid-journey-view';
import { JourneysHeader } from '@/components/journeys-header';

export default function ProfilePage() {
    return (
        <main className="container mx-auto max-w-7xl p-4 md:p-8">
            <JourneysHeader />
            <GridJourneyView />
        </main>
    );
}
