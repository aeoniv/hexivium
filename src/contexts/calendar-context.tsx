
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import type { CalendarDay, ChineseCalendarData, SequenceName } from '@/lib/types';

interface CalendarContextType {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  activeSequenceKey: SequenceName;
  setActiveSequenceKey: Dispatch<SetStateAction<SequenceName>>;
  calendarDays: CalendarDay[];
  setCalendarDays: Dispatch<SetStateAction<CalendarDay[]>>;
  selectedDay: CalendarDay | null;
  setSelectedDay: Dispatch<SetStateAction<CalendarDay | null>>;
  chineseCalendarData: ChineseCalendarData | null;
  setChineseCalendarData: Dispatch<SetStateAction<ChineseCalendarData | null>>;
  isLoadingCalendar: boolean;
  setIsLoadingCalendar: Dispatch<SetStateAction<boolean>>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [activeSequenceKey, setActiveSequenceKey] = useState<SequenceName>('raveWheel');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [chineseCalendarData, setChineseCalendarData] = useState<ChineseCalendarData | null>(null);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  const value = {
    startDate,
    setStartDate,
    activeSequenceKey,
    setActiveSequenceKey,
    calendarDays,
    setCalendarDays,
    selectedDay,
    setSelectedDay,
    chineseCalendarData,
    setChineseCalendarData,
    isLoadingCalendar,
    setIsLoadingCalendar,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
