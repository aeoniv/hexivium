
'use server';

import { getUnixTime, addHours, startOfDay, getYear, getMonth, set } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TROPICAL_ZODIAC: { [key: string]: [number, number] } = {
    'Aries': [0, 30], 'Taurus': [30, 60], 'Gemini': [60, 90], 'Cancer': [90, 120],
    'Leo': [120, 150], 'Virgo': [150, 180], 'Libra': [180, 210], 'Scorpio': [210, 240],
    'Sagittarius': [240, 270], 'Capricorn': [270, 300], 'Aquarius': [300, 330], 'Pisces': [330, 360]
};

const SOLAR_TERMS: { [key: string]: number } = {
    'Lichun': 315,  // Start of Spring
    'Chunfen': 0,   // Spring Equinox
    'Qingming': 15,
    'Lixia': 45,    // Start of Summer
    'Mangzhong': 75,
    'Xiazhi': 90,   // Summer Solstice
    'Liqiu': 135,   // Start of Autumn
    'Chushu': 150,
    'Qiufen': 180,  // Autumn Equinox
    'Lidong': 225,  // Start of Winter
    'Dongzhi': 270, // Winter Solstice
    'Dahan': 300
};

// Simplified astronomical calculations
function toJulian(date: Date): number {
    return date.getTime() / 86400000 + 2440587.5;
}

function getSunLongitude(julianDay: number): number {
    const d = julianDay - 2451545.0;
    const g = (357.529 + 0.98560028 * d) % 360; // Mean anomaly
    const q = (280.459 + 0.98564736 * d) % 360; // Mean longitude
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

async function findNewMoon(startDate: Date): Promise<Date | null> {
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

async function findSolarTerm(year: number, termDegree: number, timezone: string): Promise<Date | null> {
    let startDate: Date;
    if (termDegree > 330) { // For terms late in the previous year cycle
        startDate = new Date(Date.UTC(year - 1, 11, 15));
    } else {
        const termMonth = Math.floor(termDegree / 30) + 1;
        startDate = new Date(Date.UTC(year, termMonth - 1, 1));
    }

    for (let i = 0; i < 60 * 4; i++) { // Search within ~60 days
        const jd = toJulian(startDate);
        const sunPos = getSunLongitude(jd);
        const diff = Math.abs(sunPos - termDegree);
        if (diff < 0.5 || diff > 359.5) {
             return fromZonedTime(startDate, timezone);
        }
        startDate = addHours(startDate, 6);
    }
    return null;
}


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


export async function getChineseCalendar(year: number, timezone: string): Promise<ChineseCalendarData> {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));

    // Find Lunar Months
    const lunarMonths: LunarMonth[] = [];
    let currentDate = new Date(Date.UTC(year, 0, 1));
    currentDate.setUTCMonth(currentDate.getUTCMonth() - 1); // Start search from Dec of prev year
    
    let monthCount = 1;
    while (currentDate < endDate && monthCount <= 13) {
        const newMoonDate = await findNewMoon(currentDate);
        if (newMoonDate && newMoonDate >= startDate && newMoonDate < endDate) {
            lunarMonths.push({ monthNumber: monthCount, startDate: fromZonedTime(newMoonDate, timezone) });
            monthCount++;
            currentDate = addHours(newMoonDate, 27 * 24);
        } else if (newMoonDate) {
             currentDate = addHours(newMoonDate, 27 * 24);
        } else {
            break; 
        }
    }
    
    // Find Solar Terms
    const solarTerms: SolarTerm[] = [];
    for (const termName in SOLAR_TERMS) {
        const degree = SOLAR_TERMS[termName];
        const termDate = await findSolarTerm(year, degree, timezone);
        if(termDate && getYear(termDate) === year) {
            solarTerms.push({ name: termName, date: termDate, degree });
        }
    }

    solarTerms.sort((a,b) => a.date.getTime() - b.date.getTime());

    return {
        year,
        timezone,
        lunarMonths,
        solarTerms
    };
}

    