
'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from '@/contexts/calendar-context';
import type { SequenceName } from '@/lib/types';
import { sequences } from '@/lib/i-ching-data';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from './ui/separator';
import { Label } from './ui/label';

export function CalendarSettings() {
  const {
    startDate,
    setStartDate,
    activeSequenceKey,
    setActiveSequenceKey,
  } = useCalendar();
  
  const isDatePickerDisabled = activeSequenceKey === 'lunisolarCycle';

  if (!startDate || !setStartDate || !activeSequenceKey || !setActiveSequenceKey) {
    return null; // Or a loading state
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
        <Separator />
        <div>
            <Label>Start Date</Label>
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isDatePickerDisabled}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, 'PPP')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus disabled={isDatePickerDisabled} />
            </PopoverContent>
            </Popover>
        </div>
        <div>
            <Label>Sequence</Label>
            <Select value={activeSequenceKey} onValueChange={(value) => setActiveSequenceKey(value as SequenceName)}>
            <SelectTrigger>
                <SelectValue placeholder="Select a sequence" />
            </SelectTrigger>
            <SelectContent>
                {sequences.map(seq => (
                <SelectItem key={seq.key} value={seq.key}>{seq.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
    </div>
  );
}
