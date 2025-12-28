
import {
  DoorOpen,
  Waypoints,
  Grid3x3,
  BrickWall,
  type LucideIcon
} from 'lucide-react';

export interface StructureData {
  name: string;
  icon: LucideIcon;
  purpose: string;
}

export const structures: StructureData[] = [
  {
    name: 'Door',
    icon: DoorOpen,
    purpose: 'Represents new opportunities and transitions. Can be opened or closed based on progress.',
  },
  {
    name: 'Stairs',
    icon: Waypoints,
    purpose: 'Represents step-by-step progress towards a larger goal.',
  },
  {
    name: 'Floor',
    icon: Grid3x3,
    purpose: 'The foundational surface of your space. Can change texture or color.',
  },
  {
    name: 'Wall',
    icon: BrickWall,
    purpose: 'Represents boundaries, protection, and the structure of your space.',
  }
];
