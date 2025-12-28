'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FivePointedStarProps {
  radius: number;
  className?: string;
  itemSize?: number;
  topActiveElement: string | null;
  bottomActiveElement: string | null;
  onElementClick: (element: string | null) => void;
}

const elements = [
  { name: 'Fire', symbol: '火' },
  { name: 'Earth', symbol: '土' },
  { name: 'Metal', symbol: '金' },
  { name: 'Water', symbol: '水' },
  { name: 'Wood', symbol: '木' },
];

export function FivePointedStar({
  radius,
  className,
  itemSize = 2.5,
  topActiveElement,
  bottomActiveElement,
  onElementClick,
}: FivePointedStarProps) {
  const points = 5;
  const angleStep = (2 * Math.PI) / points;
  const starRadiusInRem = radius;
  const containerSize = starRadiusInRem * 2;

  const vertices = elements.map((_, index) => {
    // Start from top and go clockwise. The first element in the array will be at the top.
    const angle = angleStep * index - Math.PI / 2;

    const buttonX = starRadiusInRem + starRadiusInRem * Math.cos(angle) - itemSize / 2;
    const buttonY = starRadiusInRem + starRadiusInRem * Math.sin(angle) - itemSize / 2;
    
    const centerX = starRadiusInRem + starRadiusInRem * Math.cos(angle);
    const centerY = starRadiusInRem + starRadiusInRem * Math.sin(angle);
    
    return { buttonX, buttonY, centerX, centerY };
  });

  const handleClick = (elementName: string) => {
    onElementClick(topActiveElement === elementName ? null : elementName);
  };

  // Generative cycle (outer pentagon): Wood -> Fire -> Earth -> Metal -> Water -> Wood
  const pentagonPathData = [
    `M ${vertices[4].centerX} ${vertices[4].centerY}`, // Wood
    `L ${vertices[0].centerX} ${vertices[0].centerY}`, // Fire
    `L ${vertices[1].centerX} ${vertices[1].centerY}`, // Earth
    `L ${vertices[2].centerX} ${vertices[2].centerY}`, // Metal
    `L ${vertices[3].centerX} ${vertices[3].centerY}`, // Water
    'Z'
  ].join(' ');
  
  // Overcoming/control cycle (inner pentagram): Wood -> Earth -> Water -> Fire -> Metal -> Wood
  const pentagramPathData = [
    `M ${vertices[4].centerX} ${vertices[4].centerY}`, // Wood
    `L ${vertices[1].centerX} ${vertices[1].centerY}`, // Earth
    `L ${vertices[3].centerX} ${vertices[3].centerY}`, // Water
    `L ${vertices[0].centerX} ${vertices[0].centerY}`, // Fire
    `L ${vertices[2].centerX} ${vertices[2].centerY}`, // Metal
    'Z'
  ].join(' ');

  const getActivePath = () => {
    if (bottomActiveElement && topActiveElement && bottomActiveElement !== topActiveElement) {
      const startIndex = elements.findIndex(el => el.name === bottomActiveElement);
      const endIndex = elements.findIndex(el => el.name === topActiveElement);
      if (startIndex !== -1 && endIndex !== -1) {
        const startPoint = vertices[startIndex];
        const endPoint = vertices[endIndex];
        return `M ${startPoint.centerX} ${startPoint.centerY} L ${endPoint.centerX} ${endPoint.centerY}`;
      }
    }
    return null;
  };

  const activePathData = getActivePath();


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
        <defs>
            <marker
                id="arrowhead"
                markerWidth="5"
                markerHeight="3.5"
                refX="5"
                refY="1.75"
                orient="auto"
            >
                <polygon points="0 0, 5 1.75, 0 3.5" fill="hsl(var(--primary))" />
            </marker>
        </defs>

        <path
          d={pentagonPathData}
          stroke="hsl(var(--border))"
          strokeWidth="0.05"
          fill="none"
        />
        <path
          d={pentagramPathData}
          stroke="hsl(var(--border))"
          strokeWidth="0.05"
          fill="none"
        />
        {activePathData && (
          <path
            d={activePathData}
            stroke="hsl(var(--primary))"
            strokeWidth="0.2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        )}
      </svg>
      {vertices.map((pos, index) => {
        const element = elements[index];
        const isTopActive = topActiveElement === element.name;
        const isBottomActive = bottomActiveElement === element.name;
        
        let variant: 'default' | 'outline' | 'destructive' = 'outline';
        if (isTopActive && isBottomActive) {
            variant = 'default';
        } else if (isTopActive) {
            variant = 'default';
        } else if (isBottomActive) {
            variant = 'destructive';
        }

        return (
         <TooltipProvider key={element.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  size="icon"
                  className={cn(
                    "absolute rounded-full z-10 text-lg font-bold transition-colors",
                     (isTopActive || isBottomActive) && "ring-2 ring-primary-foreground"
                    )}
                  style={{
                    left: `${pos.buttonX}rem`,
                    top: `${pos.buttonY}rem`,
                    width: `${itemSize}rem`,
                    height: `${itemSize}rem`,
                  }}
                  onClick={() => handleClick(element.name)}
                >
                  {element.symbol}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{element.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  );
}
