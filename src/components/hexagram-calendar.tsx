
'use client';

import { format } from 'date-fns';
import { useGlobal } from '@/contexts/global-state-context';
import type { CalendarDay, Sequence } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { CalendarDayCard } from './calendar-day-card';

interface HexagramCalendarProps {
  calendarDays: CalendarDay[];
  setSelectedDay: (day: CalendarDay) => void;
  activeSequence: Sequence;
  isLoading: boolean;
}

export function HexagramCalendar({ calendarDays, setSelectedDay, activeSequence, isLoading }: HexagramCalendarProps) {
  const today = new Date();
  const { sunActiveLine } = useGlobal();

  const getCardDateFormat = () => {
    if (activeSequence.unit === 'hours') return 'MMM d, HH:mm';
    if (activeSequence.unit === 'years') return 'yyyy';
    return 'MMM d';
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-2">
                           <Skeleton className="h-8 w-8" />
                           <Skeleton className="h-8 w-8" />
                           <Skeleton className="h-8 w-8" />
                           <Skeleton className="h-8 w-8" />
                           <Skeleton className="h-8 w-8" />
                           <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
  }


  return (
    <div className="flex flex-col gap-2">
      {calendarDays.map(day => {
        const isToday = format(day.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        
        return (
          <CalendarDayCard 
            key={`${day.day}-${day.hexagramId}-${day.date.toISOString()}`}
            day={day}
            onClick={() => setSelectedDay(day)}
            isToday={isToday && activeSequence.unit !== 'years'}
            dateFormat={getCardDateFormat()}
            activeLine={isToday ? sunActiveLine : null}
            activeSequenceKey={activeSequence.key}
          />
        );
      })}
    </div>
  );
}
