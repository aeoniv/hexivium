import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HexagramIcon } from './hexagram-icon';
import { cn } from '@/lib/utils';
import type { Hexagram, Trigram } from '@/lib/types';
import { TrigramIcon } from './trigram-icon';

interface CircularHexagramLayoutProps {
  items: (Hexagram | Trigram)[];
  radius: number;
  label?: string;
  itemSize?: number;
  className?: string;
  isTrigram?: boolean;
}

export function CircularHexagramLayout({
  items,
  radius,
  label,
  itemSize = 2.5,
  className,
  isTrigram = false,
}: CircularHexagramLayoutProps) {
  const angleStep = (2 * Math.PI) / items.length;

  return (
    <div
      className={cn("relative flex items-center justify-center rounded-full border border-dashed", className)}
      style={{ width: `${radius * 2}rem`, height: `${radius * 2}rem` }}
    >
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      {items.map((item, index) => {
        const angle = angleStep * index - Math.PI / 2; // Start from top
        const x = radius + radius * Math.cos(angle) - itemSize / 2;
        const y = radius + radius * Math.sin(angle) - itemSize / 2;

        const IconComponent = isTrigram ? TrigramIcon : HexagramIcon;

        return (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute"
                  style={{
                    left: `${x}rem`,
                    top: `${y}rem`,
                    width: `${itemSize}rem`,
                    height: `${itemSize}rem`,
                  }}
                >
                  <IconComponent binary={item.binary} className="w-full h-full text-foreground/80 hover:text-primary transition-colors" />
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
