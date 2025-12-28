
'use client';

import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Trigram } from '@/lib/types';
import { TrigramIcon } from './trigram-icon';

interface TrigramSelectorProps {
  items: Trigram[];
  radius: number;
  itemSize?: number;
  className?: string;
  orientation?: 'inward' | 'outward';
  selectedTrigram: Trigram | null;
  onSelectTrigram: (trigram: Trigram | null) => void;
  label?: string;
}

interface PositionedItem {
  item: Trigram;
  x: number;
  y: number;
  rotation: number;
}

export function TrigramSelector({
  items,
  radius,
  itemSize = 2.5,
  className,
  orientation = 'inward',
  selectedTrigram,
  onSelectTrigram,
  label,
}: TrigramSelectorProps) {
  const [positionedItems, setPositionedItems] = useState<PositionedItem[]>([]);

  useEffect(() => {
    const calculatePositions = () => {
      const numItems = items.length;
      const angleStep = (2 * Math.PI) / numItems;
      const startRad = -Math.PI / 2;

      return items.map((item, index) => {
        const angle = startRad + angleStep * index;
        const x = radius + radius * Math.cos(angle) - itemSize / 2;
        const y = radius + radius * Math.sin(angle) - itemSize / 2;
        let rotation = angle * (180 / Math.PI) + 90;

        if (orientation === 'outward') {
          rotation += 180;
        }

        return { item, x, y, rotation };
      });
    };
    setPositionedItems(calculatePositions());
  }, [items, radius, itemSize, orientation]);

  const handleClick = (item: Trigram) => {
    if (selectedTrigram?.id === item.id) {
      onSelectTrigram(null);
    } else {
      onSelectTrigram(item);
    }
  };

  return (
    <div
      className={cn("relative flex items-center justify-center rounded-full border-dashed", className)}
      style={{ width: `${radius * 2}rem`, height: `${radius * 2}rem` }}
    >
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      {positionedItems.map(({ item, x, y, rotation }) => {
        const isActive = selectedTrigram?.id === item.id;
        return (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute cursor-pointer transition-transform duration-300 flex items-center justify-center"
                  style={{
                    left: `${x}rem`,
                    top: `${y}rem`,
                    width: `${itemSize}rem`,
                    height: `${itemSize}rem`,
                    transform: `rotate(${rotation}deg)`
                  }}
                  onClick={() => handleClick(item)}
                >
                  <TrigramIcon
                    binary={item.binary}
                    className={cn(
                      "w-full h-full text-foreground/80 hover:text-primary transition-all",
                      isActive && "text-primary scale-125 drop-shadow-[0_0_5px_hsl(var(--primary))]"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.id}: {item.name}</p>
                <p className="text-muted-foreground">{item.chineseName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
