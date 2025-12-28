
'use client';

import { useEffect, useState } from 'react';
import { HuoHouTuPageContent } from '@/components/huo-hou-tu-page-content';
import { Loader2 } from 'lucide-react';

export default function HuoHouTuPage() {
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

    return <HuoHouTuPageContent />;
}
