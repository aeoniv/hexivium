
import {
  Wheat,
  Sprout,
  CircleDot,
  Square,
  Bean,
  Pyramid as Pumpkin,
  Webhook as Ginger,
  GitCommitHorizontal as SweetPotato,
  Circle as Walnut,
  Leaf,
  Grape,
  type LucideIcon,
} from 'lucide-react';

export interface ObjectData {
  name: string;
  icon: LucideIcon;
  purpose: string;
  category: 'Neutral Foods' | 'Warming (Yang) Foods' | 'Cooling (Yin) Foods';
}

export const objects: ObjectData[] = [
  // Neutral foods
  {
    name: 'Rice',
    icon: Wheat,
    purpose: 'A foundational food for building Qi and harmonizing the digestive system.',
    category: 'Neutral Foods'
  },
  {
    name: 'Carrots',
    icon: Sprout,
    purpose: 'Strengthens the Spleen and benefits the eyes.',
    category: 'Neutral Foods'
  },
  {
    name: 'Mushrooms',
    icon: CircleDot,
    purpose: 'Boosts immunity and resolves dampness.',
    category: 'Neutral Foods'
  },
  {
    name: 'Tofu',
    icon: Square,
    purpose: 'Clears heat and moisturizes dryness.',
    category: 'Neutral Foods'
  },
  {
    name: 'Adzuki Beans',
    icon: Bean,
    purpose: 'Promotes urination and reduces swelling.',
    category: 'Neutral Foods'
  },
  {
    name: 'Pumpkin Seeds',
    icon: Pumpkin,
    purpose: 'Rich in Zinc, supports prostate health and benefits the Kidneys.',
    category: 'Neutral Foods'
  },
  // Warming (yang) foods
  {
    name: 'Ginger',
    icon: Ginger,
    purpose: 'Warms the stomach, disperses cold, and aids digestion.',
    category: 'Warming (Yang) Foods'
  },
  {
    name: 'Sweet Potatoes',
    icon: SweetPotato,
    purpose: 'Tonifies Qi and Blood, and strengthens the Spleen.',
    category: 'Warming (Yang) Foods'
  },
  {
    name: 'Walnuts',
    icon: Walnut,
    purpose: 'Strengthens the Kidneys and nourishes the brain.',
    category: 'Warming (Yang) Foods'
  },
  // Cooling (yin) foods
  {
    name: 'Leafy Greens',
    icon: Leaf,
    purpose: 'Clears heat, detoxifies, and benefits the Liver.',
    category: 'Cooling (Yin) Foods'
  },
  {
    name: 'Mung Beans',
    icon: Bean,
    purpose: 'Clears summer-heat and resolves toxicity.',
    category: 'Cooling (Yin) Foods'
  },
  {
    name: 'Goji Berries',
    icon: Grape,
    purpose: 'Nourishes the Liver and Kidneys, and brightens the eyes.',
    category: 'Cooling (Yin) Foods'
  },
];
