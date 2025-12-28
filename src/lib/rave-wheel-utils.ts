
import { raveWheelHexagramIds } from './i-ching-data';
import { hexagramMap } from './data-provider';
import type { Hexagram } from './types';

// The Rave calendar starts with Gate 41 at ~2 degrees Aquarius.
// In the tropical zodiac, Aquarius starts at 300 degrees.
const RAVE_WHEEL_START_DEGREE = 302.1; 
const DEGREES_PER_HEXAGRAM = 360 / 64;
const DEGREES_PER_LINE = DEGREES_PER_HEXAGRAM / 6;

// Create a mapping of hexagrams to their starting degree in the zodiac
const RAVE_WHEEL_ZODIAC_MAPPING = new Map<number, number>();
raveWheelHexagramIds.forEach((id, index) => {
    const startDegree = (RAVE_WHEEL_START_DEGREE + index * DEGREES_PER_HEXAGRAM) % 360;
    RAVE_WHEEL_ZODIAC_MAPPING.set(id, startDegree);
});

/**
 * Calculates the approximate ecliptic longitude of the sun for a given date.
 * This is a simplified model but sufficient for this application's purpose.
 * @param date The date for which to calculate the sun's longitude.
 * @returns The sun's ecliptic longitude in degrees.
 */
export function getSunEclipticLongitude(date: Date): number {
    const julianDay = (date.getTime() / 86400000) + 2440587.5;
    const d = julianDay - 2451545.0; // Days since J2000.0 (January 1, 2000, 12:00 UTC)

    // These are simplified orbital elements for the Sun (actually Earth's orbit)
    const meanAnomaly = (357.529 + 0.98560028 * d) % 360;
    const meanLongitude = (280.459 + 0.98564736 * d) % 360;
    
    // Equation of Center (simplified)
    const eclipticLongitude = meanLongitude + 1.915 * Math.sin(meanAnomaly * Math.PI / 180) + 0.020 * Math.sin(2 * meanAnomaly * Math.PI / 180);

    return (eclipticLongitude + 360) % 360;
}

/**
 * Determines the active hexagram and line for a given ecliptic longitude.
 * @param longitude The sun's ecliptic longitude in degrees.
 * @returns An object containing the active hexagram and line number (0-5).
 */
export function getHexagramAndLineForLongitude(longitude: number): { hexagram: Hexagram | undefined, line: number | null } {
    let activeHexagram: Hexagram | undefined;
    let activeLine: number | null = null;
    let found = false;

    for (const [id, startDegree] of RAVE_WHEEL_ZODIAC_MAPPING.entries()) {
        const endDegree = (startDegree + DEGREES_PER_HEXAGRAM) % 360;
        let inRange = false;
        
        if (startDegree < endDegree) { // Normal case, does not cross 0° Aries
            inRange = longitude >= startDegree && longitude < endDegree;
        } else { // Wraps around 0° Aries (e.g., Pisces to Aries)
            inRange = longitude >= startDegree || longitude < endDegree;
        }

        if (inRange) {
            activeHexagram = hexagramMap.get(id);
            // Calculate how far into the hexagram's arc the sun is
            const progressIntoHexagram = (longitude - startDegree + 360) % 360;
            activeLine = Math.floor(progressIntoHexagram / DEGREES_PER_LINE);
            found = true;
            break;
        }
    }
    
    // If not found (which can happen at the exact 0/360 boundary), assign to the last hexagram.
    if (!found) {
        const lastHexagramId = raveWheelHexagramIds[raveWheelHexagramIds.length - 1];
        activeHexagram = hexagramMap.get(lastHexagramId);
        activeLine = 5;
    }

    return { hexagram: activeHexagram, line: activeLine };
}
