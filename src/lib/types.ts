

export interface Hexagram {
  id: number;
  number: string;
  name: string;
  chineseName: string;
  binary: string;
  trigrams: {
    upper: string;
    lower: string;
  };
  description: string;
  hexagramSymbol: string;
}

export interface Trigram {
  id: number;
  name: string;
  chineseName: string;
  binary: string;
}

export type SequenceName = 'raveWheel' | 'sunCycle' | 'moonCycle' | 'head' | 'zodiac' | 'body' | 'heart' | 'gut' | 'pulse' | 'lunisolarCycle';

export interface Sequence {
  name: string;
  key: SequenceName;
  hexagramIds: readonly number[] | number[];
  unit: 'days' | 'hours' | 'years';
  duration?: number; // Total duration of the cycle in days
}

export interface CalendarDay {
  day: number;
  date: Date;
  hexagramId: number;
  hexagram: Hexagram;
  isAnchor: boolean;
  event?: CalendarEvent;
  lineChangePercentage: number;
  heavenlyStem?: string;
  earthlyBranch?: string;
}

export interface CalendarEvent {
  type: string;
  description: string;
  isSolarTerm?: boolean;
  isNewMoon?: boolean;
}

export type Mode = 'manual' | 'automatic';
export type AutoSequenceName = 'binaryPulses' | 'bodyPulses';
export type HighlightMode = 'single' | 'trail';


// Chinese Calendar Types
export interface LunarMonth {
    monthNumber: number | string;
    startDate: Date;
}

export interface SolarTerm {
    name: string;
    date: Date;
    degree: number;
}

export interface ChineseCalendarData {
    year: number;
    timezone: string;
    lunarMonths: LunarMonth[];
    solarTerms: SolarTerm[];
}

export interface ZodiacInfo {
    hexagramId: number;
    time: string;
    organ: string;
    element: string;
    channel: 'Taiyin' | 'Yangming' | 'Shaoyin' | 'Taiyang' | 'Jueyin' | 'Shaoyang';
}

    