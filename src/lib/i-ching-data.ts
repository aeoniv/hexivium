import { type Hexagram, type Sequence, type Trigram } from './types';

export const hexagrams: Hexagram[] = [
    { id: 1, number: "1", name: 'Force', chineseName: '乾', binary: '111111', trigrams: { upper: 'Heaven', lower: 'Heaven' }, description: 'Heaven above and Heaven below: Heaven in constant motion.', hexagramSymbol: '䷀' },
    { id: 2, number: "2", name: 'Field', chineseName: '坤', binary: '000000', trigrams: { upper: 'Earth', lower: 'Earth' }, description: 'Earth above and Earth below: The Earth contains and sustains.', hexagramSymbol: '䷁' },
    { id: 3, number: "3", name: 'Sprouting', chineseName: '屯', binary: '100010', trigrams: { upper: 'Water', lower: 'Thunder' }, description: 'Thunder from the Deep: Carefully weave order out of confusion.', hexagramSymbol: '䷂' },
    { id: 4, number: "4", name: 'Enveloping', chineseName: '蒙', binary: '010001', trigrams: { upper: 'Mountain', lower: 'Water' }, description: 'A fresh Spring at the foot of the Mountain.', hexagramSymbol: '䷃' },
    { id: 5, number: "5", name: 'Attending', chineseName: '需', binary: '111010', trigrams: { upper: 'Water', lower: 'Heaven' }, description: 'Deep Waters in the Heavens: Thunderclouds approaching, but no rain yet.', hexagramSymbol: '䷄' },
    { id: 6, number: "6", name: 'Arguing', chineseName: '訟', binary: '010111', trigrams: { upper: 'Heaven', lower: 'Water' }, description: 'The high Heavens over a yawning Deep chasm.', hexagramSymbol: '䷅' },
    { id: 7, number: "7", name: 'Leading', chineseName: '師', binary: '010000', trigrams: { upper: 'Earth', lower: 'Water' }, description: 'Deep Water beneath the Earth\'s surface: Untapped resources.', hexagramSymbol: '䷆' },
    { id: 8, number: "8", name: 'Grouping', chineseName: '比', binary: '000010', trigrams: { upper: 'Water', lower: 'Earth' }, description: 'Deep waters on the face of the Earth: Surface Waters flow together.', hexagramSymbol: '䷇' },
    { id: 9, number: "9", name: 'Small Accumulating', chineseName: '小畜', binary: '111011', trigrams: { upper: 'Wind', lower: 'Heaven' }, description: 'Winds of change high in the Heavens.', hexagramSymbol: '䷈' },
    { id: 10, number: "10", name: 'Treading', chineseName: '履', binary: '110111', trigrams: { upper: 'Heaven', lower: 'Lake' }, description: 'Heaven shines down on the Marsh which reflects it back imperfectly.', hexagramSymbol: '䷉' },
    { id: 11, number: "11", name: 'Pervading', chineseName: '泰', binary: '111000', trigrams: { upper: 'Earth', lower: 'Heaven' }, description: 'Heaven and Earth embrace, giving birth to Peace.', hexagramSymbol: '䷊' },
    { id: 12, number: "12", name: 'Obstruction', chineseName: '否', binary: '000111', trigrams: { upper: 'Heaven', lower: 'Earth' }, description: 'Heaven and Earth move away from each other.', hexagramSymbol: '䷋' },
    { id: 13, number: "13", name: 'Concording People', chineseName: '同人', binary: '101111', trigrams: { upper: 'Heaven', lower: 'Fire' }, description: 'Heaven reflects the Flame of clarity.', hexagramSymbol: '䷌' },
    { id: 14, number: "14", name: 'Great Possessing', chineseName: '大有', binary: '111101', trigrams: { upper: 'Fire', lower: 'Heaven' }, description: 'The Fire of clarity illuminates the Heavens to those below.', hexagramSymbol: '䷍' },
    { id: 15, number: "15", name: 'Humbling', chineseName: '謙', binary: '001000', trigrams: { upper: 'Earth', lower: 'Mountain' }, description: 'The Mountain does not overshadow the Plain surrounding it.', hexagramSymbol: '䷎' },
    { id: 16, number: "16", name: 'Providing-For', chineseName: '豫', binary: '000100', trigrams: { upper: 'Thunder', lower: 'Earth' }, description: 'Thunder comes resounding out of the Earth.', hexagramSymbol: '䷏' },
    { id: 17, number: "17", name: 'Following', chineseName: '隨', binary: '100110', trigrams: { upper: 'Lake', lower: 'Thunder' }, description: 'Thunder beneath the Lake\'s surface.', hexagramSymbol: '䷐' },
    { id: 18, number: "18", name: 'Corrupting', chineseName: '蠱', binary: '011001', trigrams: { upper: 'Mountain', lower: 'Wind' }, description: 'Winds sweep through the Mountain valley.', hexagramSymbol: '䷑' },
    { id: 19, number: "19", name: 'Nearing', chineseName: '臨', binary: '110000', trigrams: { upper: 'Earth', lower: 'Lake' }, description: 'The rich, loamy Earth on the banks of the Marsh.', hexagramSymbol: '䷒' },
    { id: 20, number: "20", name: 'Viewing', chineseName: '觀', binary: '000011', trigrams: { upper: 'Wind', lower: 'Earth' }, description: 'The gentle Wind roams the Earth.', hexagramSymbol: '䷓' },
    { id: 21, number: "21", name: 'Gnawing Bite', chineseName: '噬嗑', binary: '100101', trigrams: { upper: 'Fire', lower: 'Thunder' }, description: 'The merciless, searing judgement of Lightning.', hexagramSymbol: '䷔' },
    { id: 22, number: "22", name: 'Adorning', chineseName: '賁', binary: '101001', trigrams: { upper: 'Mountain', lower: 'Fire' }, description: 'Fire illuminates the base of the Mountain.', hexagramSymbol: '䷕' },
    { id: 23, number: "23", name: 'Stripping', chineseName: '剝', binary: '000001', trigrams: { upper: 'Mountain', lower: 'Earth' }, description: 'The weight of the Mountain presses down upon a weak foundation.', hexagramSymbol: '䷖' },
    { id: 24, number: "24", name: 'Returning', chineseName: '復', binary: '100000', trigrams: { upper: 'Earth', lower: 'Thunder' }, description: 'Thunder regenerates deep within Earth\'s womb.', hexagramSymbol: '䷗' },
    { id: 25, number: "25", name: 'Without Embroiling', chineseName: '無妄', binary: '100111', trigrams: { upper: 'Heaven', lower: 'Thunder' }, description: 'Thunder rolls beneath Heaven, as is its nature.', hexagramSymbol: '䷘' },
    { id: 26, number: "26", name: 'Great Accumulating', chineseName: '大畜', binary: '111001', trigrams: { upper: 'Mountain', lower: 'Heaven' }, description: 'Heaven\'s motherlode waits within the Mountain.', hexagramSymbol: '䷙' },
    { id: 27, number: "27", name: 'Swallowing', chineseName: '頤', binary: '100001', trigrams: { upper: 'Mountain', lower: 'Thunder' }, description: 'Beneath the immobile Mountain the arousing Thunder stirs.', hexagramSymbol: '䷚' },
    { id: 28, number: "28", name: 'Great Exceeding', chineseName: '大過', binary: '011110', trigrams: { upper: 'Lake', lower: 'Wind' }, description: 'The Flood rises above the tallest Tree.', hexagramSymbol: '䷛' },
    { id: 29, number: "29", name: 'Gorge', chineseName: '坎', binary: '010010', trigrams: { upper: 'Water', lower: 'Water' }, description: 'Water follows Water, spilling over any cliff.', hexagramSymbol: '䷜' },
    { id: 30, number: "30", name: 'Radiance', chineseName: '離', binary: '101101', trigrams: { upper: 'Fire', lower: 'Fire' }, description: 'Fire sparks more Flames.', hexagramSymbol: '䷝' },
    { id: 31, number: "31", name: 'Conjoining', chineseName: '咸', binary: '001110', trigrams: { upper: 'Lake', lower: 'Mountain' }, description: 'The joyous Lake is cradled by the tranquil Mountain.', hexagramSymbol: '䷞' },
    { id: 32, number: "32", name: 'Persevering', chineseName: '恆', binary: '011100', trigrams: { upper: 'Thunder', lower: 'Wind' }, description: 'Arousing Thunder and penetrating Wind, close companions in any storm.', hexagramSymbol: '䷟' },
    { id: 33, number: "33", name: 'Retiring', chineseName: '遯', binary: '001111', trigrams: { upper: 'Heaven', lower: 'Mountain' }, description: 'The tranquil Mountain towers overhead, yet remains this side of Heaven.', hexagramSymbol: '䷠' },
    { id: 34, number: "34", name: 'Great Invigorating', chineseName: '大壯', binary: '111100', trigrams: { upper: 'Thunder', lower: 'Heaven' }, description: 'Thunder fills the Heavens with its awful roar.', hexagramSymbol: '䷡' },
    { id: 35, number: "35", name: 'Prospering', chineseName: '晉', binary: '000101', trigrams: { upper: 'Fire', lower: 'Earth' }, description: 'The Sun shines down upon the Earth.', hexagramSymbol: '䷢' },
    { id: 36, number: "36", name: 'Brightness Hiding', chineseName: '明夷', binary: '101000', trigrams: { upper: 'Earth', lower: 'Fire' }, description: 'Warmth and Light are swallowed by deep Darkness.', hexagramSymbol: '䷣' },
    { id: 37, number: "37", name: 'Dwelling People', chineseName: '家人', binary: '101011', trigrams: { upper: 'Wind', lower: 'Fire' }, description: 'Warming Air Currents rise and spread from the Hearthfire.', hexagramSymbol: '䷤' },
    { id: 38, number: "38", name: 'Polarising', chineseName: '睽', binary: '110101', trigrams: { upper: 'Fire', lower: 'Lake' }, description: 'Fire distances itself from its nemesis, the Lake.', hexagramSymbol: '䷥' },
    { id: 39, number: "39", name: 'Limping', chineseName: '蹇', binary: '001010', trigrams: { upper: 'Water', lower: 'Mountain' }, description: 'Ominous roiling in the Crater Lake atop the Volcano.', hexagramSymbol: '䷦' },
    { id: 40, number: "40", name: 'Taking-Apart', chineseName: '解', binary: '010100', trigrams: { upper: 'Thunder', lower: 'Water' }, description: 'A Thunderous Cloudburst shatters the oppressive humidity.', hexagramSymbol: '䷧' },
    { id: 41, number: "41", name: 'Diminishing', chineseName: '損', binary: '110001', trigrams: { upper: 'Mountain', lower: 'Lake' }, description: 'The stoic Mountain drains its excess waters to the Lake below.', hexagramSymbol: '䷨' },
    { id: 42, number: "42", name: 'Augmenting', chineseName: '益', binary: '100011', trigrams: { upper: 'Wind', lower: 'Thunder' }, description: 'Whirlwinds and Thunder: When the Superior Person encounters saintly behavior, she adopts it.', hexagramSymbol: '䷩' },
    { id: 43, number: "43", name: 'Parting', chineseName: '夬', binary: '111110', trigrams: { upper: 'Lake', lower: 'Heaven' }, description: 'A Deluge from Heaven.', hexagramSymbol: '䷪' },
    { id: 44, number: "44", name: 'Coupling', chineseName: '姤', binary: '011111', trigrams: { upper: 'Heaven', lower: 'Wind' }, description: 'A playful Zephyr dances and delights beneath indulgent Heaven.', hexagramSymbol: '䷫' },
    { id: 45, number: "45", name: 'Clustering', chineseName: '萃', binary: '000110', trigrams: { upper: 'Lake', lower: 'Earth' }, description: 'The Lake rises by welcoming and receiving Earth\'s waters.', hexagramSymbol: '䷬' },
    { id: 46, number: "46", name: 'Ascending', chineseName: '升', binary: '011000', trigrams: { upper: 'Earth', lower: 'Wind' }, description: 'Beneath the Soil, the Seedling pushes upward toward the light.', hexagramSymbol: '䷭' },
    { id: 47, number: "47", name: 'Confining', chineseName: '困', binary: '010110', trigrams: { upper: 'Lake', lower: 'Water' }, description: 'A Dead Sea, its Waters spent eons ago.', hexagramSymbol: '䷮' },
    { id: 48, number: "48", name: 'Welling', chineseName: '井', binary: '011010', trigrams: { upper: 'Water', lower: 'Wind' }, description: 'Deep Waters Penetrated and drawn to the surface.', hexagramSymbol: '䷯' },
    { id: 49, number: "49", name: 'Skinning', chineseName: '革', binary: '101110', trigrams: { upper: 'Lake', lower: 'Fire' }, description: 'Fire ignites within the Lake, defying conditions.', hexagramSymbol: '䷰' },
    { id: 50, number: "50", name: 'Holding', chineseName: '鼎', binary: '011101', trigrams: { upper: 'Fire', lower: 'Wind' }, description: 'Fire rises hot and bright from the Wood beneath the sacrificial caldron.', hexagramSymbol: '䷱' },
    { id: 51, number: "51", name: 'Shake', chineseName: '震', binary: '100100', trigrams: { upper: 'Thunder', lower: 'Thunder' }, description: 'Thunder echoes upon Thunder, commanding reverence.', hexagramSymbol: '䷲' },
    { id: 52, number: "52", name: 'Bound', chineseName: '艮', binary: '001001', trigrams: { upper: 'Mountain', lower: 'Mountain' }, description: 'Above this Mountain\'s summit another more majestic rises.', hexagramSymbol: '䷳' },
    { id: 53, number: "53", name: 'Infiltrating', chineseName: '漸', binary: '001011', trigrams: { upper: 'Wind', lower: 'Mountain' }, description: 'The gnarled Pine grows tenaciously off the Cliff face.', hexagramSymbol: '䷴' },
    { id: 54, number: "54", name: 'Converting The Maiden', chineseName: '歸妹', binary: '110100', trigrams: { upper: 'Thunder', lower: 'Lake' }, description: 'The Thunderstorm inseminates the swelling Lake.', hexagramSymbol: '䷵' },
    { id: 55, number: "55", name: 'Abounding', chineseName: '豐', binary: '101100', trigrams: { upper: 'Thunder', lower: 'Fire' }, description: 'Thunder and Lightning from the dark heart of the storm.', hexagramSymbol: '䷶' },
    { id: 56, number: "56", name: 'Sojourning', chineseName: '旅', binary: '001101', trigrams: { upper: 'Fire', lower: 'Mountain' }, description: 'Fire on the Mountain, catastrophic to man, a passing annoyance.', hexagramSymbol: '䷷' },
    { id: 57, number: "57", name: 'Ground', chineseName: '巽', binary: '011011', trigrams: { upper: 'Wind', lower: 'Wind' }, description: 'Wind follows upon wind, wandering the earth.', hexagramSymbol: '䷸' },
    { id: 58, number: "58", name: 'Open', chineseName: '兌', binary: '110110', trigrams: { upper: 'Lake', lower: 'Lake' }, description: 'The joyous Lake spans on and on to the horizon.', hexagramSymbol: '䷹' },
    { id: 59, number: "59", name: 'Dispersing', chineseName: '渙', binary: '010011', trigrams: { upper: 'Wind', lower: 'Water' }, description: 'Wind carries the Mists aloft.', hexagramSymbol: '䷺' },
    { id: 60, number: "60", name: 'Articulating', chineseName: '節', binary: '110010', trigrams: { upper: 'Water', lower: 'Lake' }, description: 'Waters difficult to keep within the Lake\'s banks.', hexagramSymbol: '䷻' },
    { id: 61, number: "61", name: 'Centre Confirming', chineseName: '中孚', binary: '110011', trigrams: { upper: 'Wind', lower: 'Lake' }, description: 'The gentle Wind ripples the Lake\'s surface.', hexagramSymbol: '䷼' },
    { id: 62, number: "62", name: 'Small Exceeding', chineseName: '小過', binary: '001100', trigrams: { upper: 'Thunder', lower: 'Mountain' }, description: 'Thunder high on the Mountain, active passivity.', hexagramSymbol: '䷽' },
    { id: 63, number: "63", name: 'Already Fording', chineseName: '既濟', binary: '101010', trigrams: { upper: 'Water', lower: 'Fire' }, description: 'Boiling Water over open Flame.', hexagramSymbol: '䷾' },
    { id: 64, number: "64", name: 'Not-Yet Fording', chineseName: '未濟', binary: '010101', trigrams: { upper: 'Fire', lower: 'Water' }, description: 'Fire ascends above the Water.', hexagramSymbol: '䷿' }
];

export const trigrams: Trigram[] = [
  { id: 1, name: "Heaven", chineseName: "乾", binary: "111" },
  { id: 2, name: "Earth", chineseName: "坤", binary: "000" },
  { id: 3, name: "Thunder", chineseName: "震", binary: "100" },
  { id: 4, name: "Water", "chineseName": "坎", "binary": "010" },
  { id: 5, "name": "Mountain", "chineseName": "艮", "binary": "001" },
  { id: 6, name: "Wind", "chineseName": "巽", "binary": "011" },
  { id: 7, name: "Fire", "chineseName": "離", "binary": "101" },
  { id: 8, name: "Lake", "chineseName": "兌", "binary": "110" },
];

export const LUNAR_CYCLE_SECONDS = 29.530588853 * 24 * 60 * 60;
export const FULL_MOON_REFERENCE_UTC = new Date('2024-06-21T01:07:00Z').getTime();
export const SPRING_EQUINOX_2025_UTC = new Date('2025-03-20T09:02:00Z');
export const WINTER_SOLSTICE_2024_UTC = new Date('2024-12-21T09:20:00Z');

export const raveWheelHexagramIds = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60] as const;
export const headSequence = [ 23, 8, 16, 15, 7, 24, 44, 13, 10, 9, 14, 43];
export const zodiacSequence = [1, 43, 34, 11, 19, 24, 2, 23, 20, 12, 33, 44];
export const heartSequence = [31,29,25,23,21,19,17,15,13,11,9,7,5,3,63,61,59,57,55,53,51,49,47,45,43,41,39,37,35,33];
export const gutSequence = [34,26,5,61,38,58,25,37,30,49,33,6,57,50,28,20,45,35,62,39,52,46,40,29,4,19,36,51,3,27];
const lunisolar60YearCycle = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
];
export const bodyPulses = [1, 57, 59, 53, 20, 42, 37, 61, 9, 50, 29, 39, 8, 3, 63, 60, 5, 18, 4, 52, 23, 27, 22, 41, 26, 46, 48, 15, 2, 24, 36, 19, 11, 32, 40, 62, 16, 51, 55, 54, 34, 7, 64, 56, 35, 21, 30, 38, 14, 28, 47, 31, 45, 17, 49, 58, 43, 44, 6, 33, 12, 25, 13, 10];
export const binaryPulses = [
    1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 
    30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 
    2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 
    29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 
];
export const pulse = binaryPulses;

export const sequences: Sequence[] = [
  { name: "Rave Wheel", key: 'raveWheel', hexagramIds: raveWheelHexagramIds, unit: 'days', duration: 365.25 },
  { name: "Sun Cycle", key: 'sunCycle', hexagramIds: raveWheelHexagramIds, unit: 'days', duration: 365.25 },
  { name: "Moon Cycle", key: 'moonCycle', hexagramIds: raveWheelHexagramIds, unit: 'days', duration: 384 },
  { name: "Head (1 Day)", key: 'head', hexagramIds: headSequence, unit: 'hours', duration: 24 },
  { name: "Zodiac (1 Year)", key: 'zodiac', hexagramIds: zodiacSequence, unit: 'days', duration: 365.25 },
  { name: "Body (7 Years)", key: 'body', hexagramIds: bodyPulses, unit: 'days', duration: 365.25 * 7 },
  { name: "Heart (1 Month)", key: 'heart', hexagramIds: heartSequence, unit: 'days', duration: 30 },
  { name: "Gut (1 Lunar Month)", key: 'gut', hexagramIds: gutSequence, unit: 'days', duration: 29.53 },
  { name: "Pulse (Daily)", key: 'pulse', hexagramIds: pulse, unit: 'hours', duration: 24 },
  { name: "Lunisolar 60-Year Cycle", key: 'lunisolarCycle', hexagramIds: lunisolar60YearCycle, unit: 'years'},
];

export const anchorHexagramIds = [] as const;

export const celestialEvents: { date: string, type: string, description: string, isSolarTerm: boolean, isNewMoon: boolean }[] = [];
