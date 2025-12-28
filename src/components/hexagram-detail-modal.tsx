

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { CalendarDay, Sequence } from '@/lib/types';
import { AISuggestionCard } from './ai-suggestion-card';
import { format } from 'date-fns';
import { HexagramIcon } from './hexagram-icon';

interface HexagramDetailModalProps {
  day: CalendarDay | null;
  onOpenChange: (open: boolean) => void;
  activeSequence: Sequence;
  sunActiveLine: number | null;
}

export function HexagramDetailModal({ day, onOpenChange, activeSequence, sunActiveLine }: HexagramDetailModalProps) {
  if (!day) return null;

  const dateFormat = activeSequence.unit === 'years' 
    ? 'yyyy' 
    : activeSequence.unit === 'hours' 
      ? 'EEEE, MMMM d, yyyy HH:mm' 
      : 'EEEE, MMMM d, yyyy';

  const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={!!day} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span className="text-2xl font-bold font-headline">
              {day.hexagram.id}: {day.hexagram.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            {format(day.date, dateFormat)}
            </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 py-4">
          <div className="w-20">
            <HexagramIcon
              binary={day.hexagram.binary}
              activeLine={isToday && activeSequence.unit !== 'years' ? sunActiveLine : null}
              className="w-full h-full text-primary"
              lineClassName="h-3"
            />
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold">Trigrams</h4>
              <p className="text-muted-foreground">Upper: {day.hexagram.trigrams.upper}, Lower: {day.hexagram.trigrams.lower}</p>
            </div>
             <div>
              <h4 className="font-semibold">Binary</h4>
              <p className="text-muted-foreground font-code">{day.hexagram.binary}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-foreground/90 leading-relaxed">
            {day.hexagram.description}
          </p>
        </div>
        
        <AISuggestionCard hexagramDescription={day.hexagram.description} />
      </DialogContent>
    </Dialog>
  );
}
