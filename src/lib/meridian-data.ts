
import type { ZodiacInfo } from './types';
import { headSequence } from './i-ching-data';

export const zodiacData: ZodiacInfo[] = [
    // Times are local solar time. Hexagram IDs now map to headSequence
    { hexagramId: headSequence[6], time: '3am-5am', organ: 'Lung', element: 'Metal', channel: 'Taiyin' }, // 44
    { hexagramId: headSequence[7], time: '5am-7am', organ: 'Large Intestine', element: 'Metal', channel: 'Yangming' }, // 13
    { hexagramId: headSequence[8], time: '7am-9am', organ: 'Stomach', element: 'Earth', channel: 'Yangming' }, // 10
    { hexagramId: headSequence[9], time: '9am-11am', organ: 'Spleen', element: 'Earth', channel: 'Taiyin' }, // 9
    { hexagramId: headSequence[10], time: '11am-1pm', organ: 'Heart', element: 'Fire', channel: 'Shaoyin' }, // 14
    { hexagramId: headSequence[11], time: '1pm-3pm', organ: 'Small Intestine', element: 'Fire', channel: 'Taiyang' }, // 43
    { hexagramId: headSequence[0], time: '3pm-5pm', organ: 'Bladder', element: 'Water', channel: 'Taiyang' }, // 23
    { hexagramId: headSequence[1], time: '5pm-7pm', organ: 'Kidney', element: 'Water', channel: 'Shaoyin' }, // 8
    { hexagramId: headSequence[2], time: '7pm-9pm', organ: 'Pericardium', element: 'Fire', channel: 'Jueyin' }, // 16
    { hexagramId: headSequence[3], time: '9pm-11pm', organ: 'Triple Burner', element: 'Fire', channel: 'Shaoyang' }, // 15
    { hexagramId: headSequence[4], time: '11pm-1am', organ: 'Gall Bladder', element: 'Wood', channel: 'Shaoyang' }, // 7
    { hexagramId: headSequence[5], time: '1am-3am', organ: 'Liver', element: 'Wood', channel: 'Jueyin' }, // 24
];

export const zodiacMap = new Map<number, ZodiacInfo>(zodiacData.map(m => [m.hexagramId, m]));
