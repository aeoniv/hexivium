
import {
  Club,
  Sword,
  Swords,
  Rocket,
  Zap,
  GitCommitHorizontal,
  Scissors,
  Anchor,
  Shovel,
  Waypoints,
  Target,
  Torus,
  type LucideIcon
} from 'lucide-react';

export interface KungFuWeaponData {
  name: string;
  icon: LucideIcon;
  purpose: string;
  category: 'Kung Fu Weapons';
}

export const kungFuWeapons: KungFuWeaponData[] = [
  {
    name: 'Staff (Gun)',
    icon: Club,
    purpose: 'Represents fundamental, disciplined practice. Tracks a core daily habit.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Broadsword (Dao)',
    icon: Sword,
    purpose: 'Represents powerful, decisive action. Tracks a high-impact habit.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Straight Sword (Jian)',
    icon: Swords,
    purpose: 'Symbolizes grace and precision. Tracks habits that require finesse.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Spear (Qiang)',
    icon: Rocket, // Proxy icon
    purpose: 'Represents versatility. Tracks multi-faceted habits or projects.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Chain Whip (Bian)',
    icon: Zap, // Proxy icon
    purpose: 'Represents speed and power. Tracks flexible habits requiring timing.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Nunchaku (Er Jie Gun)',
    icon: GitCommitHorizontal, // Proxy icon
    purpose: 'Tracks advanced habits requiring dexterity and coordination.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Butterfly Swords (Hu Die Dao)',
    icon: Scissors, // Proxy icon
    purpose: 'Symbolize adaptability. Tracks paired habits or personal protection.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Hook Swords (Gou)',
    icon: Anchor, // Proxy icon
    purpose: 'Tracks habits focused on removing bad habits or negative thoughts.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Monk\'s Spade (Yue Ya Chan)',
    icon: Shovel,
    purpose: 'Represents balanced effort. Tracks habits involving work and reflection.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Three-Section Staff (San Jie Gun)',
    icon: Waypoints, // Proxy icon
    purpose: 'Tracks hybrid habits with chained components.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Rope Dart (Sheng Biao)',
    icon: Target, // Proxy icon
    purpose: 'Represents long-term goals requiring consistent focus.',
    category: 'Kung Fu Weapons',
  },
  {
    name: 'Tiger Fork (Hu Cha)',
    icon: Torus, // Proxy icon - representing a trident shape
    purpose: 'Represents habits focused on building physical strength or assertiveness.',
    category: 'Kung Fu Weapons',
  },
];
