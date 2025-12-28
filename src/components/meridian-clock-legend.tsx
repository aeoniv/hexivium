
'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { zodiacMap } from '@/lib/meridian-data';
import { headSequence } from '@/lib/i-ching-data';
import { hexagramMap } from '@/lib/data-provider';
import { Badge } from './ui/badge';
import { HexagramIcon } from './hexagram-icon';
import type { ZodiacInfo, Hexagram } from '@/lib/types';


interface ZodiacClockLegendProps {
  solarActiveHexagramId: number | null;
}

export function MeridianClockLegend({ solarActiveHexagramId }: ZodiacClockLegendProps) {
  if (solarActiveHexagramId === null) {
    return null;
  }

  // Find which of the headSequence hexagrams corresponds to the current solar time
  const activeHexagramIdInHead = headSequence.find(id => {
    const meridianInfo = zodiacMap.get(id);
    // This is a simplification. A more accurate mapping would be needed
    // if head sequence doesn't align with the 12 meridians.
    // For now, we assume the solarActiveHexagramId can be found in the head sequence for the legend.
    return id === solarActiveHexagramId;
  });
  
  const activeMeridian: ZodiacInfo | undefined = zodiacMap.get(activeHexagramIdInHead ?? -1);
  const activeHexagram: Hexagram | undefined = hexagramMap.get(activeHexagramIdInHead ?? -1);

  if (!activeMeridian || !activeHexagram) {
    return (
      <div className="space-y-2">
        <Label>TCM Clock</Label>
        <Card>
          <CardContent className="p-3 text-sm text-muted-foreground">
            No active TCM period for the Head sequence.
          </CardContent>
        </Card>
      </div>
    );
  }

  const getElementColorClass = (element: string) => {
    switch (element) {
      case 'Wood': return 'text-green-500';
      case 'Fire': return 'text-red-500';
      case 'Earth': return 'text-yellow-500';
      case 'Metal': return 'text-gray-400';
      case 'Water': return 'text-blue-500';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-2">
      <Label>TCM Clock (Head)</Label>
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-4">
            <HexagramIcon binary={activeHexagram.binary} className="w-8 h-8" />
            <div className="flex-1">
              <p className="font-bold text-primary">{activeHexagram.id}: {activeHexagram.name}</p>
              <p className="text-xs text-muted-foreground">{activeMeridian.time}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Organ:</span>
            <span className="font-semibold">{activeMeridian.organ}</span>
          </div>
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Channel:</span>
            <span className="font-semibold">{activeMeridian.channel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Element:</span>
            <span className={`font-semibold ${getElementColorClass(activeMeridian.element)}`}>
              {activeMeridian.element}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
