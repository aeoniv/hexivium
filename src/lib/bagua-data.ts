import {
  Wallet,
  Award,
  Heart,
  Users,
  PlayCircle,
  BrainCircuit,
  Briefcase,
  Plane,
  type LucideIcon,
} from 'lucide-react';

export interface BaguaArea {
  name: string;
  direction: string;
  icon: LucideIcon;
  habitFocus: string;
  feature: string;
}

export const baguaAreas: BaguaArea[] = [
  {
    name: 'Wealth and Abundance',
    direction: 'Southeast',
    icon: Wallet,
    habitFocus: 'Financial habits like saving, investing, and eliminating debt.',
    feature: 'A virtual treasure chest or money tree that fills up as financial habits are logged.',
  },
  {
    name: 'Fame and Reputation',
    direction: 'South',
    icon: Award,
    habitFocus: 'Actions that build public recognition, such as networking, sharing achievements, or building a personal brand.',
    feature: 'A digital trophy case or a spotlight that grows brighter with each success publicly shared or logged.',
  },
  {
    name: 'Love and Partnership',
    direction: 'Southwest',
    icon: Heart,
    habitFocus: 'Habits that nurture relationships, such as date nights, expressing gratitude, or communicating openly with a partner.',
    feature: 'A two-part object, like a pair of intertwined hearts, that visually becomes more complete as relationship habits are maintained.',
  },
  {
    name: 'Family and New Beginnings',
    direction: 'East',
    icon: Users,
    habitFocus: 'Habits related to nurturing family ties or starting a new project. This includes calling a family member, starting a new skill, or beginning a new creative endeavor.',
    feature: 'A visual family tree that expands with each habit related to family connection or a budding seed that sprouts into a tree as a new project progresses.',
  },
  {
    name: 'Children and Completion',
    direction: 'West',
    icon: PlayCircle,
    habitFocus: 'Finishing projects, creative hobbies, or planning for the future. This quadrant also relates to spontaneity and fun.',
    feature: 'A digital hourglass or a "completion jar" that fills up as projects are finished and tasks are checked off.',
  },
  {
    name: 'Knowledge and Self-Cultivation',
    direction: 'Northeast',
    icon: BrainCircuit,
    habitFocus: 'Habits around learning, self-reflection, and personal growth, such as reading, meditating, or studying.',
    feature: 'A virtual library or bookshelf where each completed learning habit adds another book or a journal where entries visually stack up over time.',
  },
  {
    name: 'Career and Life Path',
    direction: 'North',
    icon: Briefcase,
    habitFocus: 'Professional development, networking, and career-advancing tasks.',
    feature: 'A visual path or compass that lights up as career-related habits are logged, guiding the user toward their professional goals.',
  },
  {
    name: 'Helpful People and Travel',
    direction: 'Northwest',
    icon: Plane,
    habitFocus: 'Habits related to connecting with mentors, seeking help, or planning travel.',
    feature: 'A globe that becomes more detailed with each new connection made or travel-related task logged.',
  },
];
