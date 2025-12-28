
import {
  Home,
  Store,
  CookingPot,
  Mountain,
  Users,
  Waves,
  Flower2,
  Trees,
  Library,
  Hammer,
  Sparkles,
  Heart,
  type LucideIcon
} from 'lucide-react';

export interface Environment {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const environments: Environment[] = [
    {
      name: 'Cave',
      icon: Home,
      description: 'A cozy, dark-mode-optimized room with a subtle glow from a reading light.',
    },
    {
      name: 'Market',
      icon: Store,
      description: 'A bustling city square with animated, flowing elements and multiple overlapping activity zones.',
    },
    {
      name: 'Kitchen',
      icon: CookingPot,
      description: 'A warm, inviting space with a communal feel, featuring rustic textures and vibrant, earthy colors.',
    },
    {
      name: 'Mountain',
      icon: Mountain,
      description: 'A panoramic vista with a clean, expansive layout that changes from a sunrise to a night sky.',
    },
    {
      name: 'Valley',
      icon: Users,
      description: 'A lush, green clearing, with natural, soft textures and a focus on intimate, connected design elements.',
    },
    {
      name: 'Shore',
      icon: Waves,
      description: 'A dynamic scene with sand and water elements, transitioning between the tide\'s high and low points.',
    },
    {
      name: 'Garden',
      icon: Flower2,
      description: 'A calm, structured space with flourishing plants representing habit growth.',
    },
    {
      name: 'Forest',
      icon: Trees,
      description: 'A dappled, serene setting that suggests natural, unforced growth over time.',
    },
    {
      name: 'Library',
      icon: Library,
      description: 'An organized, classic environment with a focus on collecting knowledge and progress.',
    },
    {
      name: 'Workshop',
      icon: Hammer,
      description: 'A clean, functional space with tools and projects in progress, emphasizing creation.',
    },
    {
      name: 'Starry Sky',
      icon: Sparkles,
      description: 'An infinite, high-contrast, and reflective space for tracking long-term, big-picture goals.',
    },
    {
      name: 'Cottage',
      icon: Heart,
      description: 'A homely, secure, and comfortable space for gentle, self-care-focused habit tracking.',
    },
];
