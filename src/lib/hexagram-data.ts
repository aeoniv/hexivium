
// This file can be expanded with more detailed data for each hexagram
// For now, we're just defining the basic structure and categories.

export interface HexagramNode {
    id: number;
    category: HexagramCategory;
    definition: string;
    character: string;
    description: string;
    binary: string;
}

export type HexagramCategory = 
    | "Heaven" 
    | "Earth" 
    | "Surface" 
    | "North Solar" 
    | "South Solar" 
    | "North Earthly" 
    | "South Earthly" 
    | "North Heavenly" 
    | "South Heavenly"
    | "Center";

export const categoryColors: Record<HexagramCategory, string> = {
    "Heaven": "#0000ff", // Bright Blue
    "Earth": "#4169e1", // Royal Blue
    "Surface": "#00bfff", // Deep Sky Blue
    "North Solar": "#87ceeb", // Sky Blue
    "South Solar": "#add8e6", // Light Blue
    "North Earthly": "#1e90ff", // Dodger Blue
    "South Earthly": "#6495ed", // Cornflower Blue
    "North Heavenly": "#4682b4", // Steel Blue
    "South Heavenly": "#b0c4de", // Light Steel Blue
    "Center": "#ffffff", // White
};

export const hexagrams: HexagramNode[] = [
    { id: 1, category: 'Heaven', definition: 'The Creative', character: '乾', description: 'Represents pure creative energy.', binary: '111111' },
    { id: 2, category: 'Earth', definition: 'The Receptive', character: '坤', description: 'Represents pure receptive energy.', binary: '000000' },
    { id: 3, category: 'South Solar', definition: 'Difficulty at the Beginning', character: '屯', description: 'Sprouting.', binary: '100010' },
    { id: 4, category: 'South Solar', definition: 'Youthful Folly', character: '蒙', description: 'Enveloping, inexperienced.', binary: '010001' },
    { id: 5, category: 'North Solar', definition: 'Waiting (Nourishment)', character: '需', description: 'Attending, uninvolvement.', binary: '111010' },
    { id: 6, category: 'North Solar', definition: 'Conflict', character: '訟', description: 'Arguing, engagement.', binary: '010111' },
    { id: 7, category: 'South Earthly', definition: 'The Army', character: '師', description: 'Leading, teamwork.', binary: '010000' },
    { id: 8, category: 'South Earthly', definition: 'Holding Together (Union)', character: '比', description: 'Grouping.', binary: '000010' },
    { id: 9, category: 'North Earthly', definition: 'Small Taming', character: '小畜', description: 'Accumulating resources.', binary: '111011' },
    { id: 10, category: 'North Earthly', definition: 'Treading (Conduct)', character: '履', description: 'Continuing with alertness.', binary: '110111' },
    { id: 11, category: 'Surface', definition: 'Peace', character: '泰', description: 'Pervading.', binary: '111000' },
    { id: 12, category: 'Surface', definition: 'Standstill (Stagnation)', character: '否', description: 'Obstruction.', binary: '000111' },
    { id: 13, category: 'North Earthly', definition: 'Fellowship with Men', character: '同人', description: 'Concording people.', binary: '101111' },
    { id: 14, category: 'North Earthly', definition: 'Possession in Great Measure', character: '大有', description: 'Great possessing.', binary: '111101' },
    { id: 15, category: 'South Earthly', definition: 'Modesty', character: '謙', description: 'Humbling.', binary: '001000' },
    { id: 16, category: 'South Earthly', definition: 'Enthusiasm', character: '豫', description: 'Providing-for.', binary: '000100' },
    { id: 17, category: 'Surface', definition: 'Following', character: '隨', description: 'Following.', binary: '100110' },
    { id: 18, category: 'Surface', definition: 'Work on what has been spoiled', character: '蠱', description: 'Corrupting.', binary: '011001' },
    { id: 19, category: 'South Solar', definition: 'Approach', character: '臨', description: 'Nearing.', binary: '110000' },
    { id: 20, category: 'South Solar', definition: 'Contemplation (View)', character: '觀', description: 'Viewing.', binary: '000011' },
    { id: 21, category: 'Surface', definition: 'Biting Through', character: '噬嗑', description: 'Deciding.', binary: '100101' },
    { id: 22, category: 'Surface', definition: 'Grace', character: '賁', description: 'Adorning.', binary: '101001' },
    { id: 23, category: 'South Earthly', definition: 'Splitting Apart', character: '剝', description: 'Stripping.', binary: '000001' },
    { id: 24, category: 'South Earthly', definition: 'Return (The Turning Point)', character: '復', description: 'Returning.', binary: '100000' },
    { id: 25, category: 'North Solar', definition: 'Innocence (The Unexpected)', character: '無妄', description: 'Without embroiling.', binary: '100111' },
    { id: 26, category: 'North Solar', definition: 'The Taming Power of the Great', character: '大畜', description: 'Great accumulating.', binary: '111001' },
    { id: 27, category: 'South Solar', definition: 'Corners of the Mouth (Providing Nourishment)', character: '頤', description: 'Swallowing.', binary: '100001' },
    { id: 28, category: 'North Solar', definition: 'Preponderance of the Great', character: '大過', description: 'Great exceeding.', binary: '011110' },
    { id: 29, category: 'South Heavenly', definition: 'The Abysmal (Water)', character: '坎', description: 'Gorge.', binary: '010010' },
    { id: 30, category: 'North Heavenly', definition: 'The Clinging, Fire', character: '離', description: 'Radiance.', binary: '101101' },
    { id: 31, category: 'Surface', definition: 'Influence (Wooing)', character: '咸', description: 'Conjoining.', binary: '001110' },
    { id: 32, category: 'Surface', definition: 'Duration', character: '恆', description: 'Persevering.', binary: '011100' },
    { id: 33, category: 'North Solar', definition: 'Retreat', character: '遯', description: 'Retiring.', binary: '001111' },
    { id: 34, category: 'North Solar', definition: 'The Power of the Great', character: '大壯', description: 'Great invigorating.', binary: '111100' },
    { id: 35, category: 'South Solar', definition: 'Progress', character: '晉', description: 'Prospering.', binary: '000101' },
    { id: 36, category: 'South Solar', definition: 'Darkening of the Light', character: '明夷', description: 'Brightness hiding.', binary: '101000' },
    { id: 37, category: 'North Solar', definition: 'The Family (The Clan)', character: '家人', description: 'Dwelling people.', binary: '101011' },
    { id: 38, category: 'North Solar', definition: 'Opposition', character: '睽', description: 'Polarizing.', binary: '110101' },
    { id: 39, category: 'South Solar', definition: 'Obstruction', character: '蹇', description: 'Limping.', binary: '001010' },
    { id: 40, category: 'South Solar', definition: 'Deliverance', character: '解', description: 'Taking-apart.', binary: '010100' },
    { id: 41, category: 'Surface', definition: 'Decrease', character: '損', description: 'Diminishing.', binary: '110001' },
    { id: 42, category: 'Surface', definition: 'Increase', character: '益', description: 'Augmenting.', binary: '100011' },
    { id: 43, category: 'North Earthly', definition: 'Break-through (Resoluteness)', character: '夬', description: 'Parting.', binary: '111110' },
    { id: 44, category: 'North Earthly', definition: 'Coming to Meet', character: '姤', description: 'Coupling.', binary: '011111' },
    { id: 45, category: 'South Solar', definition: 'Gathering Together (Massing)', character: '萃', description: 'Clustering.', binary: '000110' },
    { id: 46, category: 'South Solar', definition: 'Pushing Upward', character: '升', description: 'Ascending.', binary: '011000' },
    { id: 47, category: 'Surface', definition: 'Oppression (Exhaustion)', character: '困', description: 'Confining.', binary: '010110' },
    { id: 48, category: 'Surface', definition: 'The Well', character: '井', description: 'Welling.', binary: '011010' },
    { id: 49, category: 'North Solar', definition: 'Revolution (Molting)', character: '革', description: 'Skinning.', binary: '101110' },
    { id: 50, category: 'North Solar', definition: 'The Cauldron', character: '鼎', description: 'Holding.', binary: '011101' },
    { id: 51, category: 'South Heavenly', definition: 'The Arousing (Shock, Thunder)', character: '震', description: 'Shake.', binary: '100100' },
    { id: 52, category: 'South Heavenly', definition: 'Keeping Still, Mountain', character: '艮', description: 'Bound.', binary: '001001' },
    { id: 53, category: 'Surface', definition: 'Development (Gradual Progress)', character: '漸', description: 'Infiltrating.', binary: '001011' },
    { id: 54, category: 'Surface', definition: 'The Marrying Maiden', character: '歸妹', description: 'Converting the maiden.', binary: '110100' },
    { id: 55, category: 'Surface', definition: 'Abundance (Fullness)', character: '豐', description: 'Abounding.', binary: '101100' },
    { id: 56, category: 'Surface', definition: 'The Wanderer', character: '旅', description: 'Sojourning.', binary: '001101' },
    { id: 57, category: 'North Heavenly', definition: 'The Gentle (The Penetrating, Wind)', character: '巽', description: 'Ground.', binary: '011011' },
    { id: 58, category: 'North Heavenly', definition: 'The Joyous, Lake', character: '兌', description: 'Open.', binary: '110110' },
    { id: 59, category: 'Surface', definition: 'Dispersion (Dissolution)', character: '渙', description: 'Dispersing.', binary: '010011' },
    { id: 60, category: 'Surface', definition: 'Limitation', character: '節', description: 'Articulating.', binary: '110010' },
    { id: 61, category: 'North Solar', definition: 'Inner Truth', character: '中孚', description: 'Center confirming.', binary: '110011' },
    { id: 62, category: 'South Solar', definition: 'Preponderance of the Small', character: '小過', description: 'Small exceeding.', binary: '001100' },
    { id: 63, category: 'Center', definition: 'After Completion', character: '既濟', description: 'Already fording.', binary: '101010' },
    { id: 64, category: 'Center', definition: 'Before Completion', character: '未濟', description: 'Not-yet fording.', binary: '010101' }
];



    