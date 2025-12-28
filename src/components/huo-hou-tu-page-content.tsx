

'use client';

import { HuoHouTuDiagram } from '@/components/huo-hou-tu-diagram';
import { useGlobal } from '@/contexts/global-state-context';

export function HuoHouTuPageContent() {
  const { 
    mode, 
    activeHexagram, 
    sunHexagramId,
    highlightMode, 
    autoSequenceName,
  } = useGlobal();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <main className="flex justify-center items-start p-4 md:p-8 min-h-screen">
          <div className="flex justify-center items-start pt-16">
            <HuoHouTuDiagram
              mode={mode}
              activeHexagram={activeHexagram}
              sunHexagramId={sunHexagramId}
              highlightMode={highlightMode}
              autoSequenceName={autoSequenceName}
            />
          </div>
      </main>
    </div>
  );
}
