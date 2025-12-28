
'use client';

import * as React from 'react';
import { sovereignHexagramsWithData } from '@/lib/tcm-sovereign-hexagrams';
import type { SovereignHexagramInfo } from '@/lib/tcm-sovereign-hexagrams';
import { InteractiveCircularLayout } from '@/components/interactive-circular-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Hexagram, Trigram } from '@/lib/types';
import { FivePointedStar } from '../five-pointed-star';
import { trigramMap } from '@/lib/data-provider';

interface SovereignHexagramsCycleProps {
    activeHexagramIds?: (number | null | undefined)[];
}

export function SovereignHexagramsCycle({ activeHexagramIds = [] }: SovereignHexagramsCycleProps) {
  const [selectedHexagram, setSelectedHexagram] = React.useState<(SovereignHexagramInfo & { hexagram: Hexagram }) | null>(null);

  const hexagrams = sovereignHexagramsWithData.map(item => item.hexagram);
  
  const handleHexagramClick = (id: number) => {
    const data = sovereignHexagramsWithData.find(item => item.hexagramId === id);
    setSelectedHexagram(data || null);
  };

  const activeHexagramId = activeHexagramIds.length > 0 ? activeHexagramIds[0] : null;
  const secondaryActiveHexagramId = activeHexagramIds.length > 1 ? activeHexagramIds[1] : null;
  
  const getElementForTrigram = (trigramName: string | undefined): string | null => {
    if (!trigramName) return null;
    switch (trigramName) {
      case 'Heaven':
      case 'Lake':
        return 'Metal';
      case 'Thunder':
      case 'Wind':
        return 'Wood';
      case 'Fire':
        return 'Fire';
      case 'Water':
        return 'Water';
      case 'Earth':
      case 'Mountain':
        return 'Earth';
      default:
        return null;
    }
  };

  const activeHexagram = sovereignHexagramsWithData.find(item => item.hexagramId === activeHexagramId)?.hexagram;
  const secondaryActiveHexagram = sovereignHexagramsWithData.find(item => item.hexagramId === secondaryActiveHexagramId)?.hexagram;

  const topActiveElement = getElementForTrigram(activeHexagram?.trigrams.upper);
  const bottomActiveElement = getElementForTrigram(secondaryActiveHexagram?.trigrams.lower || activeHexagram?.trigrams.lower);


  return (
    <>
      <div className="flex justify-center items-center relative">
        <InteractiveCircularLayout
          items={hexagrams}
          radius={20}
          itemSize={2.5}
          onHexagramClick={handleHexagramClick}
          mode='manual'
          startAngle={-75} // Adjust to start with Return (24) at the bottom
          sweepAngle={360}
          lastClickedHexagramId={selectedHexagram?.hexagramId || null}
          activeHexagramId={activeHexagramId}
          secondaryActiveHexagramId={secondaryActiveHexagramId}
        />
        <div className="absolute">
           <FivePointedStar
            radius={8}
            itemSize={3}
            topActiveElement={topActiveElement}
            bottomActiveElement={bottomActiveElement}
            onElementClick={() => {}}
          />
        </div>
      </div>

      <Dialog open={!!selectedHexagram} onOpenChange={(isOpen) => !isOpen && setSelectedHexagram(null)}>
        <DialogContent className="max-w-xl">
          {selectedHexagram && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <span className="text-4xl font-mono">{selectedHexagram.symbol}</span>
                  <div>
                    <span className="text-2xl font-bold font-headline">
                      {selectedHexagram.hexagramId}: {selectedHexagram.concept}
                    </span>
                    <p className="text-sm text-muted-foreground">{selectedHexagram.month} - {selectedHexagram.position}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                <div>
                  <h4 className="font-semibold text-primary">Liu Yiming's Description</h4>
                  <p className="text-muted-foreground italic mt-1">"{selectedHexagram.descriptionLiuYiming}"</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Wei Boyang's Description (Cycle of the Sun)</h4>
                  <p className="text-muted-foreground italic mt-1">"{selectedHexagram.descriptionWeiBoyang}"</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Relative Meridian Channel</h4>
                  <p className="text-muted-foreground mt-1">{selectedHexagram.meridian}</p>
                </div>
                 <div>
                  <h4 className="font-semibold text-primary">Notes</h4>
                  <p className="text-muted-foreground mt-1">{selectedHexagram.notes}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
