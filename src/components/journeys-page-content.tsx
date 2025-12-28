
'use client';

import { HeroJourneyView } from './hero-journey-view';
import { JourneysHeader } from './journeys-header';

export function JourneysPageContent() {
    return (
        <main className="container mx-auto max-w-7xl p-4 md:p-8">
            <JourneysHeader />
            <HeroJourneyView />
        </main>
    );
}
