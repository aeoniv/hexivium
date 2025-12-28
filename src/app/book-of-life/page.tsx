
import { BookOfLifeView } from '@/components/book-of-life-view';
import { JourneysHeader } from '@/components/journeys-header';

export default function BookOfLifePage() {
    return (
        <main className="p-4 md:p-8 flex flex-col items-center">
            <JourneysHeader />
            <BookOfLifeView />
        </main>
    );
}
