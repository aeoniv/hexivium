
"use client";

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import type { CalendarDay, SequenceName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { HexagramIcon } from './hexagram-icon';
import { H5PContent } from './h5p-content';

interface CalendarDayCardProps {
  day: CalendarDay;
  onClick: () => void;
  isToday: boolean;
  dateFormat: string;
  activeLine: number | null;
  activeSequenceKey: SequenceName;
}

const HexagramLine: React.FC<{ type: 'yin' | 'yang'; isActive?: boolean }> = ({ type, isActive }) => {
  const squareStyle = cn(
    'h-4 w-4 transition-all duration-300 rounded-sm',
    isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'opacity-70'
  );

  if (type === 'yang') {
    return <div className={cn(squareStyle, 'bg-foreground')} />;
  }
  return (
    <div className={cn(squareStyle, 'bg-transparent border-2 border-foreground')} />
  );
};


export function CalendarDayCard({ day, onClick, isToday, dateFormat, activeLine, activeSequenceKey }: CalendarDayCardProps) {
  const lines = day.hexagram.binary.split('');
  const showH5P = activeSequenceKey === 'raveWheel';

  return (
    <Card
      className={cn(
        'w-full max-w-lg mx-auto transition-all duration-300 cursor-pointer overflow-hidden',
        isToday ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
      )}
      onClick={onClick}
    >
      {showH5P && (
        <div className="bg-muted">
          <H5PContent embedUrl="https://helixium.h5p.com/content/1292716558248918928/embed" resizerUrl="https://helixium.h5p.com/js/h5p-resizer.js" />
        </div>
      )}
      
      <header className="flex items-center gap-3 p-3">
        <HexagramIcon 
          binary={day.hexagram.binary} 
          activeLine={isToday ? activeLine : null}
          className="w-10 h-10 text-foreground/90"
        />
        <div>
            <p className="font-bold text-sm leading-tight">{day.hexagram.id}: {day.hexagram.name}</p>
            <p className="text-xs text-muted-foreground">{format(day.date, dateFormat)}</p>
        </div>
      </header>
      
      <footer className="px-3 pb-3 space-y-2">
        <div className="flex items-center justify-around">
            {lines.map((line, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-1 rounded-md">
                 <HexagramLine type={line === '1' ? 'yang' : 'yin'} isActive={isToday && activeLine === index} />
              </div>
            ))}
        </div>
      </footer>
    </Card>
  );
}
