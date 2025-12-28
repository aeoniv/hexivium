
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { HexagramIcon } from './hexagram-icon';
import type { Hexagram } from '@/lib/types';
import { LiveClock } from './live-clock';
import { hexagramMap } from '@/lib/data-provider';


interface CurrentLineDisplayProps {
  sunHexagramId: number | null;
  sunActiveLine: number | null;
}

export function CurrentLineDisplay({ sunHexagramId, sunActiveLine }: CurrentLineDisplayProps) {
  const activeHexagram = sunHexagramId ? hexagramMap.get(sunHexagramId) : null;
  if (!activeHexagram) return null;

  return (
    <Card className="w-full shadow-none bg-transparent border-none mt-4">
      <CardHeader className="p-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Sun Cycle</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4 p-2">
        <div className="w-16">
          <HexagramIcon 
            binary={activeHexagram.binary} 
            activeLine={sunActiveLine}
            className="w-full h-full" 
            lineClassName="h-2"
          />
        </div>
        <div className="flex-1 space-y-1">
           <p className="text-sm text-muted-foreground">
            Highlighted Sun Cycle:
          </p>
          <p className="font-bold text-primary">
            {activeHexagram.id}: {activeHexagram.name}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-xs text-muted-foreground font-mono p-2">
        <LiveClock />
      </CardFooter>
    </Card>
  );
}
