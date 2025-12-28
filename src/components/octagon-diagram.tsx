
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { Trigram } from '@/lib/types';
import { trigrams as allTrigrams } from '@/lib/i-ching-data';
import { TrigramIcon } from './trigram-icon';

interface OctagonDiagramProps {
  radius: number;
  className?: string;
  itemSize?: number;
  activeTrigram: Trigram | null;
  onTrigramClick: (trigram: Trigram | null) => void;
}

const trigrams = [
  allTrigrams.find(t => t.name === 'Heaven')!,
  allTrigrams.find(t => t.name === 'Wind')!,
  allTrigrams.find(t => t.name === 'Water')!,
  allTrigrams.find(t => t.name === 'Mountain')!,
  allTrigrams.find(t => t.name === 'Earth')!,
  allTrigrams.find(t => t.name === 'Thunder')!,
  allTrigrams.find(t => t.name === 'Fire')!,
  allTrigrams.find(t => t.name === 'Lake')!,
].filter(Boolean);

export function OctagonDiagram({
  radius,
  className,
  itemSize = 2.5,
  activeTrigram,
  onTrigramClick,
}: OctagonDiagramProps) {
  const points = 8;
  const angleStep = (2 * Math.PI) / points;
  const starRadiusInRem = radius;
  const containerSize = starRadiusInRem * 2;
  const rotationOffset = Math.PI / 8; // 22.5 degrees

  const vertices = trigrams.map((_, index) => {
    const angle = angleStep * index - Math.PI / 2 + rotationOffset;
    const x = starRadiusInRem + starRadiusInRem * Math.cos(angle);
    const y = starRadiusInRem + starRadiusInRem * Math.sin(angle);
    return { x, y };
  });

  const handleClick = (trigramName: string) => {
    const clickedTrigram = trigrams.find(t => t.name === trigramName);
    if (!clickedTrigram) return;
    onTrigramClick(activeTrigram?.name === trigramName ? null : clickedTrigram);
  };

  const getPathData = (indices: number[]) => {
    return indices.map((i, idx) => {
      const point = vertices[i];
      return `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
  };

  // Outer octagon path
  const octagonPathData = getPathData([0, 1, 2, 3, 4, 5, 6, 7]);
  // Inner octagram path (star)
  const octagramPathData = getPathData([0, 3, 6, 1, 4, 7, 2, 5]);

  return (
    <div
      className={cn('relative', className)}
      style={{ width: `${containerSize}rem`, height: `${containerSize}rem` }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${containerSize} ${containerSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={octagonPathData}
          stroke="hsl(var(--border))"
          strokeWidth="0.05"
          fill="none"
        />
        <path
          d={octagramPathData}
          stroke="hsl(var(--border))"
          strokeWidth="0.05"
          fill="none"
        />
      </svg>
      {vertices.map((pos, index) => {
        const trigram = trigrams[index];
        const isActive = activeTrigram?.name === trigram.name;
        
        return (
         <TooltipProvider key={trigram.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pos.x}rem`,
                    top: `${pos.y}rem`,
                    width: `${itemSize}rem`,
                    height: `${itemSize}rem`,
                  }}
                  onClick={() => handleClick(trigram.name)}
                >
                  <TrigramIcon
                    binary={trigram.binary}
                    className={cn(
                      "w-full h-full text-foreground/80 hover:text-primary transition-all duration-300",
                      isActive && "text-primary scale-125 drop-shadow-[0_0_5px_hsl(var(--primary))]"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{trigram.name} ({trigram.chineseName})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  );
}
