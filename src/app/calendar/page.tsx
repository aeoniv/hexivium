
'use client';

import { useEffect, useState } from 'react';
import { CalendarPageContent } from '@/components/calendar-page-content';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return <CalendarPageContent />;
}
