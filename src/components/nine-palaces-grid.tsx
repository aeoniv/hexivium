'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ninePalacesData, type PalaceData } from '@/lib/nine-palaces-data';
import { cn } from '@/lib/utils';
import { trigrams as allTrigrams } from '@/lib/i-ching-data';

const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

const palaceMap = new Map<number, PalaceData>(ninePalacesData.map(p => [p.star, p]));

// Create a mapping from the name used in hexagram data (e.g., "Water") to the name used in palace data (e.g., "Kan")
const trigramNameToPalaceNameMap = new Map<string, string>(allTrigrams.map(t => [t.name, t.chineseName]));


interface NinePalacesGridProps {
  celestialLowerTrigramName?: string;
  terrestrialLowerTrigramName?: string;
}

export function NinePalacesGrid({ celestialLowerTrigramName, terrestrialLowerTrigramName }: NinePalacesGridProps) {
  const [selectedPalace, setSelectedPalace] = useState<PalaceData | null>(null);

  const gridItems = palaceOrder.map(starNum => palaceMap.get(starNum)).filter(Boolean) as PalaceData[];
  
  const celestialPalaceTrigramName = celestialLowerTrigramName ? trigramNameToPalaceNameMap.get(celestialLowerTrigramName) : null;
  const terrestrialPalaceTrigramName = terrestrialLowerTrigramName ? trigramNameToPalaceNameMap.get(terrestrialLowerTrigramName) : null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
        {gridItems.map((palace) => {
          const isCelestial = palace.trigramName === celestialPalaceTrigramName;
          const isTerrestrial = palace.trigramName === terrestrialPalaceTrigramName;

          return (
            <Button
              key={palace.star}
              variant="outline"
              className={cn(
                "aspect-square h-20 md:h-24 flex flex-col items-center justify-center p-2 transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:scale-105",
                isCelestial && "bg-primary/20 text-primary border-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
                isTerrestrial && "bg-destructive/20 text-destructive border-destructive ring-2 ring-destructive ring-offset-2 ring-offset-background"
              )}
              onClick={() => setSelectedPalace(palace)}
            >
              <span className="text-3xl md:text-4xl font-bold font-mono">{palace.star}</span>
              {palace.trigramSymbol && <span className={cn("text-lg md:text-xl font-mono", isCelestial || isTerrestrial ? 'text-current' : 'text-muted-foreground')}>{palace.trigramSymbol}</span>}
            </Button>
          );
        })}
      </div>

      <Dialog open={!!selectedPalace} onOpenChange={(isOpen) => !isOpen && setSelectedPalace(null)}>
        <DialogContent className="max-w-lg">
          {selectedPalace && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <span className="text-4xl font-mono font-bold text-primary">{selectedPalace.star}</span>
                  <div>
                    <span>{selectedPalace.trigramName !== 'None' ? `${selectedPalace.trigramName} ${selectedPalace.trigramSymbol}` : 'Central Palace'}</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Element: {selectedPalace.element} | Direction: {selectedPalace.direction}
                    </p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Person: {selectedPalace.person}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4 text-sm">
                <p><span className='font-semibold'>Body Parts:</span> {selectedPalace.bodyPart}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-500">Timely / Positive Nature</h4>
                  <p className="text-muted-foreground">{selectedPalace.positiveNature}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-destructive">Untimely / Negative Nature</h4>
                  <p className="text-muted-foreground">{selectedPalace.negativeNature}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
