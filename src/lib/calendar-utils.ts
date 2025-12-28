
import { addDays, addHours, addYears, getUnixTime } from 'date-fns';
import { hexagrams } from './i-ching-data';
import type { CalendarDay, Hexagram, Sequence, ChineseCalendarData } from './types';
import { getSunEclipticLongitude, getHexagramAndLineForLongitude } from './rave-wheel-utils';

const hexagramMap = new Map<number, Hexagram>(hexagrams.map(h => [h.id, h]));

function calculateLineChange(binary1: string, binary2: string): number {
  if (binary1.length !== 6 || binary2.length !== 6) return 0;
  let diff = 0;
  for (let i = 0; i < 6; i++) {
    if (binary1[i] !== binary2[i]) {
      diff++;
    }
  }
  return (diff / 6) * 100;
}

export function generateCalendarDays(
  startDate: Date, 
  activeSequence: Sequence, 
  chineseCalendarData: ChineseCalendarData | null
): CalendarDay[] {
  const { key, hexagramIds, unit, duration } = activeSequence;
  const days: CalendarDay[] = [];
  let previousHexagram: Hexagram | null = null;
  
  const incrementPerHexagram = duration ? duration / hexagramIds.length : 1;

  if (key === 'raveWheel' || key === 'sunCycle') {
    const year = startDate.getFullYear();
    const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = addDays(startDate, i);
      const sunLongitude = getSunEclipticLongitude(currentDate);
      const { hexagram } = getHexagramAndLineForLongitude(sunLongitude);
      
      if (hexagram) {
         const dayData: CalendarDay = {
            day: i + 1,
            date: currentDate,
            hexagramId: hexagram.id,
            hexagram,
            isAnchor: false,
            lineChangePercentage: previousHexagram ? calculateLineChange(previousHexagram.binary, hexagram.binary) : 0,
        };
        days.push(dayData);
        previousHexagram = hexagram;
      }
    }
    return days;
  }

  // Fallback to original logic for other sequences
  (hexagramIds as readonly number[]).forEach((id, index) => {
    let currentDate: Date;

    if (unit === 'hours') {
      const hourOffset = index * incrementPerHexagram;
      currentDate = addHours(startDate, hourOffset);
    } else if (unit === 'years') {
      currentDate = addYears(startDate, index);
    } else { // days
      const dayOffset = index * incrementPerHexagram;
      currentDate = addDays(startDate, dayOffset);
    }

    const hexagram = hexagramMap.get(id);

    if (hexagram) {
      const lineChangePercentage = previousHexagram
        ? calculateLineChange(previousHexagram.binary, hexagram.binary)
        : 0;
      
      const dayData: CalendarDay = {
        day: index + 1,
        date: currentDate,
        hexagramId: id,
        hexagram,
        isAnchor: false,
        lineChangePercentage,
      };

      days.push(dayData);

      previousHexagram = hexagram;
    }
  });

  return days;
}


// Astronomical calculations needed for some calendar sequences
function toJulian(date: Date): number {
    return getUnixTime(date) / 86400 + 2440587.5;
}

function getSunLongitude(julianDay: number): number {
    const d = julianDay - 2451545.0;
    const g = (357.529 + 0.98560028 * d) % 360;
    const q = (280.459 + 0.98564736 * d) % 360;
    const l = q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
    return (l + 360) % 360;
}

function getMoonLongitude(julianDay: number): number {
    const d = julianDay - 2451543.5;
    const l = (218.316 + 13.176396 * d) % 360; // Mean longitude
    const m = (134.963 + 13.064993 * d) % 360; // Mean anomaly
    const longitude = l + 6.289 * Math.sin(m * Math.PI / 180) - 1.274 * Math.sin((m - 2 * (l - 270.387)) * Math.PI / 180) + 0.658 * Math.sin((2 * (l - 270.387)) * Math.PI / 180);
    return (longitude + 360) % 360;
}

async function findFirstNewMoon(startDate: Date): Promise<Date | null> {
    let currentDate = startDate;
    for (let i = 0; i < 30 * 24; i++) { // Search for ~30 days
        const jd = toJulian(currentDate);
        const sunPos = getSunLongitude(jd);
        const moonPos = getMoonLongitude(jd);
        let angleDiff = (moonPos - sunPos + 360) % 360;
        
        if (angleDiff < 1 || angleDiff > 359) {
            return currentDate;
        }
        currentDate = addHours(currentDate, 1);
    }
    return null;
}

export async function findSecondNewMoon(winterSolsticeDate: Date): Promise<Date> {
    const firstNewMoon = await findFirstNewMoon(winterSolsticeDate);
    if (!firstNewMoon) {
        // Fallback to a reasonable default if calculation fails
        return addDays(new Date(winterSolsticeDate.getFullYear() + 1, 1, 1), 29);
    }
    const secondNewMoon = await findFirstNewMoon(addDays(firstNewMoon, 1));
     if (!secondNewMoon) {
        return addDays(firstNewMoon, 29.5);
    }
    return secondNewMoon;
}
