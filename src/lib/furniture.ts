
import {
  Bed,
  LampDesk as Desk,
  Library,
  Sofa,
  Lamp,
  RectangleVertical,
  Flower2,
  GalleryVertical,
  Clock,
  Home,
  type LucideIcon,
  Table,
  Trees,
} from 'lucide-react';

export interface FurnitureData {
  name: string;
  icon: LucideIcon;
  purpose: string;
}

export const furniture: FurnitureData[] = [
  {
    name: 'Cozy Blanket',
    icon: Bed,
    purpose: 'A customizable blanket that represents comfort and security in a "Cave."',
  },
  {
    name: 'Bistro Table',
    icon: Table,
    purpose: 'A lively, animated table in the "Market" environment that gets more populated with activity.',
  },
  {
    name: 'Pottery Wheel',
    icon: Bed, 
    purpose: 'A creative object in the "Kitchen" that spins faster with consistent progress.',
  },
  {
    name: 'Hammock',
    icon: Bed,
    purpose: 'A serene piece of furniture in the "Mountain" setting, representing the ease that comes with having a long-term perspective.',
  },
  {
    name: 'Swing',
    icon: Home,
    purpose: 'A communal swing in the "Valley" that you can visualize your accountability partners on.',
  },
  {
    name: 'Adirondack Chair',
    icon: Sofa,
    purpose: 'A calm, balanced chair on the "Shore," perfect for visualizing relaxation.',
  },
  {
    name: 'Study Desk',
    icon: Desk,
    purpose: 'An organized desk that clears up as you complete your daily tasks.',
  },
  {
    name: 'Tapestry',
    icon: GalleryVertical,
    purpose: 'A woven art piece that reveals more of its pattern with each habit completion.',
  },
  {
    name: 'Birdhouse',
    icon: Home,
    purpose: 'A charming object that attracts more birds (a symbol of progress) over time.',
  },
  {
    name: 'Pantry Shelves',
    icon: Library,
    purpose: 'Customizable shelves that fill with "ingredient" objects as you complete habits.',
  },
  {
    name: 'Bench',
    icon: RectangleVertical,
    purpose: 'A simple bench that you can sit on to review your progress.',
  },
  {
    name: 'Treehouse',
    icon: Trees,
    purpose: 'A complex, customizable structure in the "Forest" that grows as you build more habits.',
  },
];
