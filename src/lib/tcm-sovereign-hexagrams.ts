
import { hexagramMap } from '@/lib/data-provider';
import type { Hexagram } from '@/lib/types';

export interface SovereignHexagramInfo {
    hexagramId: number;
    concept: string;
    symbol: string;
    month: string;
    position: string;
    descriptionLiuYiming: string;
    descriptionWeiBoyang: string;
    meridian: string;
    notes: string;
}

export const sovereignHexagramsData: SovereignHexagramInfo[] = [
    {
        hexagramId: 24,
        concept: "Return",
        symbol: "䷗",
        month: "11th (Winter Solstice)",
        position: "#1 (Dawn begins)",
        descriptionLiuYiming: "One yang arises; start of yang energy increase.",
        descriptionWeiBoyang: "At the new moon's light lies Return. The Yang breath begins to spread through, Going out and coming in without error.",
        meridian: "Gallbladder (Foot Shaoyang)",
        notes: "Gallbladder meridian (yang, Wood element) initiates yang’s return, active at 11 PM–1 AM, resonating with winter solstice’s spark of yang. Supports decision-making and courage, aligning with yang’s emergence."
    },
    {
        hexagramId: 19,
        concept: "Overseeing",
        symbol: "䷒",
        month: "12th",
        position: "#2",
        descriptionLiuYiming: "Second yang arises.",
        descriptionWeiBoyang: "At Overseeing, the furnace issues strips of light, Opening the way for proper radiance. Radiance and shine gradually advance.",
        meridian: "Liver (Foot Jueyin)",
        notes: "Liver meridian (yin, Wood element) supports Gallbladder, active at 1–3 AM. Governs smooth qi flow, aligning with yang’s growing radiance in late winter."
    },
    {
        hexagramId: 11,
        concept: "Tranquility",
        symbol: "䷊",
        month: "1st",
        position: "#3",
        descriptionLiuYiming: "Third yang arises.",
        descriptionWeiBoyang: "Looking upward, it forms Tranquility. The firm and the yielding both come to hold sway. As Yin and Yang conjoin, The small departs, the great approaches.",
        meridian: "Large Intestine (Hand Yangming)",
        notes: "Large Intestine meridian (yang, Metal element) aligns with early spring (1st month), active at 5–7 AM. Promotes release of stagnation, reflecting yin-yang balance and tranquility."
    },
    {
        hexagramId: 34,
        concept: "Great Strength/Power",
        symbol: "䷡",
        month: "2nd",
        position: "#4",
        descriptionLiuYiming: "Fourth yang arises.",
        descriptionWeiBoyang: "Gradually comes the turn of Great Strength. Boldly standing at the gate to dawn.",
        meridian: "Lung (Hand Taiyin)",
        notes: "Lung meridian (yin, Metal element), active at 3–5 AM, supports Large Intestine. Governs qi and breath, resonating with bold yang strength at spring’s gate."
    },
    {
        hexagramId: 43,
        concept: "Parting",
        symbol: "䷪",
        month: "3rd",
        position: "#5",
        descriptionLiuYiming: "Fifth yang arises.",
        descriptionWeiBoyang: "At Parting the time has come for Yin to move into retreat, For Yang has risen and has come to the force.",
        meridian: "Stomach (Foot Yangming)",
        notes: "Stomach meridian (yang, Earth element), active at 7–9 AM, aligns with late spring. Supports digestion and grounding, reflecting yin’s retreat as yang peaks."
    },
    {
        hexagramId: 1,
        concept: "Heaven",
        symbol: "䷀",
        month: "4th",
        position: "#6 (Dawn peak)",
        descriptionLiuYiming: "Sixth yang arises; pure yang complete.",
        descriptionWeiBoyang: "Heaven is strong, flourishing, and bright, And lays itself over the four neighbourhoods.",
        meridian: "Spleen (Foot Taiyin)",
        notes: "Spleen meridian (yin, Earth element), active at 9–11 AM, complements Stomach. Governs transformation and nourishment, embodying pure yang’s flourishing in summer."
    },
    {
        hexagramId: 44,
        concept: "Meeting",
        symbol: "䷫",
        month: "5th",
        position: "#7 (Dusk begins)",
        descriptionLiuYiming: "One yin arises; yang damaged.",
        descriptionWeiBoyang: "At Meeting a new epoch comes to pass: for the first time there is hoarfrost underfoot.",
        meridian: "Heart (Hand Shaoyin)",
        notes: "Heart meridian (yin, Fire element), active at 11 AM–1 PM, aligns with early summer. Governs spirit and consciousness, reflecting yin’s subtle rise and yang’s damage."
    },
    {
        hexagramId: 33,
        concept: "Withdrawal",
        symbol: "䷠",
        month: "6th",
        position: "#8",
        descriptionLiuYiming: "Second yin arises.",
        descriptionWeiBoyang: "At Withdrawal it leaves its worldly place, gathering its essence to store it up.",
        meridian: "Small Intestine (Hand Taiyang)",
        notes: "Small Intestine meridian (yang, Fire element), active at 1–3 PM, supports Heart. Separates pure from impure, aligning with essence withdrawal in midsummer."
    },
    {
        hexagramId: 12,
        concept: "Obstruction",
        symbol: "䷋",
        month: "7th",
        position: "#9",
        descriptionLiuYiming: "Third yin arises.",
        descriptionWeiBoyang: "At Obstruction there are stagnation and blockade, and no new buds are generated. Yin stretches and Yang bends.",
        meridian: "Bladder (Foot Taiyang)",
        notes: "Bladder meridian (yang, Water element), active at 3–5 PM, aligns with late summer. Governs water metabolism, reflecting yin’s stretching and stagnation."
    },
    {
        hexagramId: 20,
        concept: "Observation/Observing",
        symbol: "䷓",
        month: "8th",
        position: "#10",
        descriptionLiuYiming: "Fourth yin arises.",
        descriptionWeiBoyang: "Observation, with its equity and its balance, examines the temper of autumn's middle month.",
        meridian: "Kidney (Foot Shaoyin)",
        notes: "Kidney meridian (yin, Water element), active at 5–7 PM, supports Bladder. Stores essence, resonating with autumn’s balanced observation and yin’s growth."
    },
    {
        hexagramId: 23,
        concept: "Stripping Away",
        symbol: "䷖",
        month: "9th",
        position: "#11",
        descriptionLiuYiming: "Fifth yin arises.",
        descriptionWeiBoyang: "Stripping Away tears its limbs and trunk, Extinguishing its form. The vital Breath is drained, The Supreme spirit is forgotten and is lost.",
        meridian: "Pericardium (Hand Jueyin)",
        notes: "Pericardium meridian (yin, Fire element), active at 7–9 PM, protects Heart. Aligns with late autumn’s loss of spirit and draining of yang."
    },
    {
        hexagramId: 2,
        concept: "Earth",
        symbol: "䷁",
        month: "10th",
        position: "#12 (Dusk ends)",
        descriptionLiuYiming: "Sixth yin arises; pure yin.",
        descriptionWeiBoyang: "The course comes to an end and turns around, Returning to its origin in Earth. Ever complying with the patterns of the Earth, She receives heaven in herself, allowing it to unfold.",
        meridian: "Triple Heater (Hand Shaoyang)",
        notes: "Triple Heater meridian (yang, Fire element), active at 9–11 PM, regulates qi flow across all organs, embodying Earth’s receptive yin and cycle’s return."
    }
];

export const sovereignHexagramsWithData = sovereignHexagramsData.map(item => {
    const hexagram = hexagramMap.get(item.hexagramId);
    return { ...item, hexagram };
}).filter(item => item.hexagram) as (SovereignHexagramInfo & { hexagram: Hexagram })[];
