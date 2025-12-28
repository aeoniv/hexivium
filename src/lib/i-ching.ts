
import { trigrams, hexagrams as allHexagrams, theBookOfLines, hexagramsData as rawHexagramsData } from './data-provider';
import type { Trigram } from './types';
import { Cube, cubeAdd, cubeDirections } from './grid-utils';

const trigramMap = new Map<string, Trigram>(trigrams.map(t => [t.binary, t]));
const changingLinesDataSet = theBookOfLines;
const hexagramsData = rawHexagramsData;

function getTrigram(binary: string): Trigram | undefined {
    return trigramMap.get(binary);
}


export interface HexagramData {
    number: string;
    title: string;
    hexagram: string;
    description: string;
}

function tossCoins(): number {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
        sum += Math.random() < 0.5 ? 2 : 3; // 2 for tails (yin), 3 for heads (yang)
    }
    return sum;
}

function generateTraditionalHexagram(): number[] {
    const hexagram: number[] = [];
    for (let i = 0; i < 6; i++) {
        hexagram.push(tossCoins());
    }
    return hexagram.reverse();
}

function deriveBinaryHexagrams(middleHexagram: number[]): { earthly: number[], heavenly: number[] } {
    const earthlyHexagram: number[] = [];
    const heavenlyHexagram: number[] = [];
    for (const line of middleHexagram) {
        switch (line) {
            case 9: // changing yang
                earthlyHexagram.push(1);
                heavenlyHexagram.push(0);
                break;
            case 8: // stable yin
                earthlyHexagram.push(0);
                heavenlyHexagram.push(0);
                break;
            case 7: // stable yang
                earthlyHexagram.push(1);
                heavenlyHexagram.push(1);
                break;
            case 6: // changing yin
                earthlyHexagram.push(0);
                heavenlyHexagram.push(1);
                break;
        }
    }
    return { earthly: earthlyHexagram, heavenly: heavenlyHexagram };
}

function getHexagramKey(hexagram: number[]): string {
    return hexagram.join('');
}

function getTrigramsFromHexagram(hexagram: number[]): { lower: Trigram | undefined, upper: Trigram | undefined } {
    if (hexagram.length !== 6) return { lower: undefined, upper: undefined };
    const lowerBinary = hexagram.slice(3, 6).join('');
    const upperBinary = hexagram.slice(0, 3).join('');
    return {
        lower: getTrigram(lowerBinary),
        upper: getTrigram(upperBinary)
    };
}

const lineToDirectionIndexMap: { [key: number]: number } = {
    6: 0, // Line 6 -> N
    5: 5, // Line 5 -> NW
    4: 1, // Line 4 -> NE
    3: 4, // Line 3 -> SW
    2: 2, // Line 2 -> SE
    1: 3, // Line 1 -> S
};


function interpretChangingLines(middleHexagram: number[], earthlyHexagram: number[], heavenlyHexagram: number[]) {
    const earthlyKey = getHexagramKey(earthlyHexagram);
    const heavenlyKey = getHexagramKey(heavenlyHexagram);

    const defaultHexagramData = {
        number: '?',
        title: 'Unknown',
        hexagram: '<?>',
        description: 'This combination does not form a known hexagram.'
    };

    const earthlyHexagramDataFromJSON = (hexagramsData as any)[earthlyKey] || defaultHexagramData;
    const heavenlyHexagramDataFromJSON = (hexagramsData as any)[heavenlyKey] || defaultHexagramData;

    const earthlyHexagramData = { ...allHexagrams.find(h => h.id === parseInt(earthlyHexagramDataFromJSON.number)), ...earthlyHexagramDataFromJSON};
    const heavenlyHexagramData = { ...allHexagrams.find(h => h.id === parseInt(heavenlyHexagramDataFromJSON.number)), ...heavenlyHexagramDataFromJSON};

    const changingLines: string[] = [];
    let lastChangingLineInfo: {hexagramNumber: string, lineNumber: number} | null = null;
    const movementQueue: { directionIndex: number }[] = [];

    middleHexagram.forEach((line, i) => {
        if (line === 6 || line === 9) {
            const lineNumber = i + 1;
            const hexagramForLine = line === 9 ? earthlyHexagramData : heavenlyHexagramData;
            const changeType = line === 9 ? "Outer Change" : "Inner Change";
            
            const hexagramEntry = changingLinesDataSet.hexagrams.find(h => h.number === parseInt(hexagramForLine.number));
            const lineEntry = hexagramEntry?.lines.find(l => l.line_number === lineNumber);
            const lineText = lineEntry?.text || 'No specific wisdom for this line.';

            changingLines.push(`Line ${lineNumber} (${changeType}): ${lineText}`);
            
            lastChangingLineInfo = {
                hexagramNumber: earthlyHexagramData.number,
                lineNumber: lineNumber
            };
            
            const directionIndex = lineToDirectionIndexMap[lineNumber];
            if (directionIndex !== undefined) {
              movementQueue.push({ directionIndex });
            }
        }
    });

    let changingLineCorrespondence = null;
    if(lastChangingLineInfo && changingLinesDataSet?.hexagrams) {
        const hexagramEntry = changingLinesDataSet.hexagrams.find(h => h.number === parseInt(lastChangingLineInfo!.hexagramNumber));
        if (hexagramEntry) {
            const lineEntry = hexagramEntry.lines.find(l => l.line_number === lastChangingLineInfo!.lineNumber);
            if (lineEntry && lineEntry.text) {
                 changingLineCorrespondence = lineEntry.text;
            }
        }
    }

    const earthlyTrigrams = getTrigramsFromHexagram(earthlyHexagram);
    const heavenlyTrigrams = getTrigramsFromHexagram(heavenlyHexagram);

    return {
        middleHexagram,
        earthly: { ...earthlyHexagramData, lowerTrigram: earthlyTrigrams.lower, upperTrigram: earthlyTrigrams.upper },
        heavenly: { ...heavenlyHexagramData, lowerTrigram: heavenlyTrigrams.lower, upperTrigram: heavenlyTrigrams.upper },
        changingLines,
        changingLineCorrespondence,
        movementQueue,
    };
}


export function generateReading() {
    const middleHexagram = generateTraditionalHexagram();
    const { earthly, heavenly } = deriveBinaryHexagrams(middleHexagram);
    return interpretChangingLines(middleHexagram, earthly, heavenly);
}
