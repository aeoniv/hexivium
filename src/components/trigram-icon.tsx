
'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface TrigramIconProps {
  binary: string;
  className?: string;
  lineClassName?: string;
  style?: React.CSSProperties;
}

const HexagramLine: FC<{ type: 'yin' | 'yang'; className?: string }> = ({ type, className }) => {
  const lineStyle = cn('fill-current', className);

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


export const TrigramIcon: FC<TrigramIconProps> = ({ binary, className, lineClassName, style }) => {
  if (typeof binary !== 'string' || binary.length !== 3) {
    return null; // Or some error state
  }
  
  const lines = binary.split('');

  return (
    <div className={cn('flex flex-col gap-1.5 w-10', className)} style={style}>
      {lines.map((line, index) => (
        <HexagramLine key={index} type={line === '1' ? 'yang' : 'yin'} className={lineClassName} />
      ))}
    </div>
  );
};
