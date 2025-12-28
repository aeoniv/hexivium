
'use client';

import { useMemo, useEffect } from 'react';
import { sequences, WINTER_SOLSTICE_2024_UTC } from '@/lib/i-ching-data';
import type { CalendarDay, Sequence } from '@/lib/types';
import { generateCalendarDays, findSecondNewMoon } from '@/lib/calendar-utils';
import { getChineseCalendar } from '@/services/chinese-calendar';
import { useCalendar } from '@/contexts/calendar-context';
import { useGlobal } from '@/contexts/global-state-context';

import { HexagramCalendar } from '@/components/hexagram-calendar';
import { HexagramDetailModal } from '@/components/hexagram-detail-modal';

export function CalendarPageContent() {
  const {
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
    setIsLoadingCalendar
  } = useCalendar();
  const { sunActiveLine } = useGlobal();


  const activeSequence = useMemo(() => {
    return sequences.find(s => s.key === activeSequenceKey) || sequences[0];
  }, [activeSequenceKey]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    let newStartDate = new Date(year, 0, 1);

    const initializeStartDate = async () => {
        if (activeSequenceKey === 'moonCycle') {
            const secondNewMoon = await findSecondNewMoon(WINTER_SOLSTICE_2024_UTC);
            newStartDate = secondNewMoon;
        } else if (activeSequenceKey === 'lunisolarCycle') {
            // The most recent 60-year cycle started on Feb 4, 1984 (Jia-Zi year).
            newStartDate = new Date(1984, 1, 4);
        } else {
             newStartDate = new Date(year, 0, 1);
        }
        setStartDate(newStartDate);
    }

    initializeStartDate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSequenceKey]);
  
  useEffect(() => {
    const year = startDate.getFullYear();
    const shouldLoadCalendar = activeSequenceKey !== 'lunisolarCycle';

    if (shouldLoadCalendar && (!chineseCalendarData || chineseCalendarData.year !== year)) {
        setIsLoadingCalendar(true);
        getChineseCalendar(year, 'UTC').then(data => {
            setChineseCalendarData(data);
            setIsLoadingCalendar(false);
        }).catch(err => {
            console.error("Failed to load Chinese calendar data:", err);
            setIsLoadingCalendar(false);
        });
    } else if (!shouldLoadCalendar) {
        setChineseCalendarData(null);
    }
  }, [startDate, chineseCalendarData, activeSequenceKey, setChineseCalendarData, setIsLoadingCalendar]);


  useEffect(() => {
    const days = generateCalendarDays(startDate, activeSequence, chineseCalendarData);
    setCalendarDays(days);
    if(selectedDay) { // Keep the modal open if a day was selected
        const updatedSelectedDay = days.find(d => d.date.getTime() === selectedDay.date.getTime() && d.hexagramId === selectedDay.hexagramId);
        if (updatedSelectedDay) {
            setSelectedDay(updatedSelectedDay);
        } else {
            setSelectedDay(null);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, activeSequence, chineseCalendarData]);

  const handleDaySelect = (day: CalendarDay) => {
    if (day.event?.isSolarTerm) {
      setActiveSequenceKey('heart');
    } else if (day.event?.isNewMoon) {
      setActiveSequenceKey('gut');
    }
    setSelectedDay(day);
  };


  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <main className="p-4 pt-20 md:p-6 md:pt-24">
        <HexagramCalendar
          calendarDays={calendarDays}
          setSelectedDay={handleDaySelect}
          activeSequence={activeSequence}
          isLoading={isLoadingCalendar}
        />
      </main>

      <HexagramDetailModal
        day={selectedDay}
        onOpenChange={(open) => !open && setSelectedDay(null)}
        activeSequence={activeSequence}
        sunActiveLine={sunActiveLine}
      />
    </div>
  );
}
