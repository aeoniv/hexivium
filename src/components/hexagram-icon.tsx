

'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface HexagramIconProps {
  binary: string;
  className?: string;
  lineClassName?: string;
  activeLine?: number | null; // 0-5 from top
  style?: React.CSSProperties;
}

const HexagramLine: FC<{ type: 'yin' | 'yang'; className?: string, isActive?: boolean }> = ({ type, className, isActive }) => {
  const lineStyle = cn(
    'transition-all duration-300 fill-current',
    isActive ? 'text-primary drop-shadow-[0_0_4px_hsl(var(--primary))] scale-105' : 'text-current',
    className
  );

  if (type === 'yang') {
    return (
        <svg viewBox="0 0 96 12" className={cn('w-full h-2', lineStyle)}>
            <rect x="0" y="0" width="96" height="12" rx="4" />
        </svg>
    );
  }
  return (
    <svg viewBox="0 0 96 12" className={cn('w-full h-2', lineStyle)}>
        <rect x="0" y="0" width="41" height="12" rx="4" />
        <rect x="55" y="0" width="41" height="12" rx="4" />
    </svg>
  );
};

export const HexagramIcon: FC<HexagramIconProps> = ({ binary, className, lineClassName, activeLine, style }) => {
  if (typeof binary !== 'string' || binary.length !== 6) {
    return null; // Or some error state
  }

  // Render lines from top to bottom based on binary string
  const lines = binary.split('');
  
  return (
    <div className={cn('flex flex-col gap-1 w-10', className)} style={style}>
      {lines.map((line, index) => {
        const isActive = activeLine !== null && index === activeLine;

        return (
            <HexagramLine 
                key={index} 
                type={line === '1' ? 'yang' : 'yin'} 
                className={lineClassName}
                isActive={isActive}
            />
        )
      })}
    </div>
  );
};

    
