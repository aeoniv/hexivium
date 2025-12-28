

'use client';

import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Trigram, Hexagram, Mode, HighlightMode, AutoSequenceName } from '@/lib/types';
import { TrigramIcon } from './trigram-icon';
import { HexagramIcon } from './hexagram-icon';
import { Sun } from 'lucide-react';

interface InteractiveCircularLayoutProps {
  items: (Trigram | Hexagram)[];
  radius: number;
  label?: string;
  itemSize?: number;
  className?: string;
  isTrigram?: boolean;
  startAngle?: number;
  sweepAngle?: number;
  orientation?: 'inward' | 'outward' | 'vertical';
  activeHexagramId?: number | null;
  onHexagramClick?: (id: number) => void;
  lastClickedHexagramId?: number | null;
  secondaryActiveHexagramId?: number | null;
  showSunIcon?: boolean;
  mode?: Mode;
  highlightMode?: HighlightMode;
  autoSequenceName?: AutoSequenceName;
  itemRotation?: number;
  activeLine?: number | null;
}

interface PositionedItem {
  item: Trigram | Hexagram;
  x: number;
  y: number;
  rotation: number;
}

export function InteractiveCircularLayout({
  items,
  radius,
  label,
  itemSize = 2.5,
  className,
  isTrigram = false,
  startAngle = 0,
  sweepAngle = 360,
  orientation = 'inward',
  activeHexagramId,
  onHexagramClick,
  lastClickedHexagramId,
  secondaryActiveHexagramId,
  showSunIcon = false,
  mode,
  highlightMode = 'single',
  autoSequenceName,
  itemRotation = 0,
  activeLine,
}: InteractiveCircularLayoutProps) {
  const [positionedItems, setPositionedItems] = useState<PositionedItem[]>([]);
  const [activatedHexIds, setActivatedHexIds] = useState<number[]>([]);

  useEffect(() => {
    if (activeHexagramId) {
      if (highlightMode === 'single') {
        setActivatedHexIds([activeHexagramId]);
      } else {
        setActivatedHexIds(prev => [activeHexagramId, ...prev.filter(id => id !== activeHexagramId)].slice(0, 12)); // Keep trail length reasonable
      }
    } else if (highlightMode === 'single') {
        setActivatedHexIds([]);
    }
  }, [activeHexagramId, highlightMode]);
  
  // Reset trail when mode changes
  useEffect(() => {
    setActivatedHexIds([]);
  }, [mode, autoSequenceName, highlightMode]);


  useEffect(() => {
    const calculatePositions = () => {
      const numItems = items.length;
      const angleStep = (sweepAngle * (Math.PI / 180)) / (sweepAngle === 360 ? numItems : numItems > 1 ? numItems - 1 : 1);
      const startRad = startAngle * (Math.PI / 180) - (Math.PI / 2);

      return items.map((item, index) => {
        const angle = startRad + angleStep * index;
        const x = radius + radius * Math.cos(angle) - itemSize / 2;
        const y = radius + radius * Math.sin(angle) - itemSize / 2;
        let rotation = angle * (180 / Math.PI) + 90; 
        
        if (orientation === 'outward') {
          rotation += 180;
        } else if (orientation === 'vertical') {
            rotation = 0;
        }

        return { item, x, y, rotation };
      });
    };
    setPositionedItems(calculatePositions());
  }, [items, radius, itemSize, startAngle, sweepAngle, orientation]);


  const handleClick = (id: number) => {
    if (onHexagramClick) {
      onHexagramClick(id);
    }
  };
  
  if (positionedItems.length === 0) {
    return (
      <div
        className={cn("relative flex items-center justify-center rounded-full border-dashed", className, sweepAngle === 360 && "border")}
        style={{ width: `${radius * 2}rem`, height: `${radius * 2}rem` }}
      />
    );
  }

  return (
    <div
      className={cn("relative flex items-center justify-center rounded-full border-dashed", className, sweepAngle === 360 && "border")}
      style={{ width: `${radius * 2}rem`, height: `${radius * 2}rem` }}
    >
      {positionedItems.map(({ item, x, y, rotation }) => {
        const isLastClicked = !isTrigram && (item as Hexagram).id === lastClickedHexagramId;
        const isSecondaryActive = !isTrigram && (item as Hexagram).id === secondaryActiveHexagramId;
        
        const activatedIndex = activatedHexIds.indexOf(item.id);
        const isActivated = activatedIndex !== -1;
        const isHeadOfTrail = activatedIndex === 0;

        const iconContainerStyle = {
            left: `${x}rem`,
            top: `${y}rem`,
            width: `${itemSize}rem`,
            height: `${itemSize}rem`,
            transform: `rotate(${rotation}deg)`,
        };

        const iconStyle = {
            transform: `rotate(${itemRotation}deg)`,
        };

        return (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                      "absolute cursor-pointer transition-all duration-300 flex items-center justify-center"
                  )}
                  style={iconContainerStyle}
                  onClick={() => handleClick(item.id)}
                >
                   {isSecondaryActive && showSunIcon && (
                     <div className="absolute inset-[-4px] rounded-full border-2 border-orange-500 animate-pulse" />
                  )}
                   {isTrigram ? (
                       <TrigramIcon
                          binary={(item as Trigram).binary}
                          className={cn(
                            "w-full h-full text-foreground/80 hover:text-primary transition-all",
                          )}
                          style={iconStyle}
                        />
                    ) : (
                      <HexagramIcon
                          binary={(item as Hexagram).binary}
                          activeLine={isHeadOfTrail ? activeLine : null}
                          className={cn(
                            "w-full h-full text-foreground/80 hover:text-primary transition-all",
                            isHeadOfTrail && "text-primary scale-125",
                            !isHeadOfTrail && isActivated && "text-trail scale-110 opacity-70",
                            isLastClicked && "text-destructive scale-125",
                            isSecondaryActive && !showSunIcon && "text-amber-500 scale-110"
                          )}
                          style={iconStyle}
                        />
                    )
                  }
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.id}: {item.name}</p>
                <p className="text-muted-foreground">{item.chineseName}</p>
                {isSecondaryActive && showSunIcon && <p className="text-orange-500 font-semibold flex items-center gap-1"><Sun className="w-3 h-3" /> Current Rave Wheel</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
