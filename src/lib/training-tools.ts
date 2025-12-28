import {
  Dumbbell,
  Weight as Kettlebell,
  MoveHorizontal,
  Move as MoveIcon,
  Repeat,
  Footprints,
  Watch,
  RectangleHorizontal,
  RotateCw,
  Orbit,
  StretchHorizontal,
  type LucideIcon,
} from 'lucide-react';

export interface TrainingToolData {
  name: string;
  icon: LucideIcon;
  purpose: string;
  category: 'Weight Training' | 'Cardio & Endurance' | 'Flexibility & Recovery';
}

export const trainingTools: TrainingToolData[] = [
  // Weight Training
  {
    name: 'Dumbbell',
    icon: Dumbbell,
    purpose: 'Represents strength training. Size or weight can increase with progress.',
    category: 'Weight Training',
  },
  {
    name: 'Kettlebell',
    icon: Kettlebell,
    purpose: 'Represents functional fitness or explosive movements. Can animate a swing on completion.',
    category: 'Weight Training',
  },
  {
    name: 'Resistance Band',
    icon: MoveHorizontal,
    purpose: 'A band that gets "tighter" or more vibrant with each use, symbolizing growing strength.',
    category: 'Weight Training',
  },
  {
    name: 'Barbell',
    icon: MoveIcon,
    purpose: 'Represents serious strength training. Plates can be added for hitting new personal records.',
    category: 'Weight Training',
  },
  // Cardio & Endurance
  {
    name: 'Jump Rope',
    icon: Repeat,
    purpose: 'A classic cardio tool. Can animate to build a streak and signify improved agility.',
    category: 'Cardio & Endurance',
  },
  {
    name: 'Running Shoe',
    icon: Footprints,
    purpose: 'Represents tracking running or walking habits. Could change color or earn "miles".',
    category: 'Cardio & Endurance',
  },
  {
    name: 'Smartwatch',
    icon: Watch,
    purpose: 'Represents tracking activities with fitness wearables, with a progress ring filling up.',
    category: 'Cardio & Endurance',
  },
  {
    name: 'Treadmill',
    icon: RectangleHorizontal,
    purpose: 'For gym-focused cardio, representing mileage or time goals.',
    category: 'Cardio & Endurance',
  },
  // Flexibility & Recovery
  {
    name: 'Yoga Mat',
    icon: RectangleHorizontal,
    purpose: 'Unrolls for a session and rolls up when complete, storing a record of the streak.',
    category: 'Flexibility & Recovery',
  },
  {
    name: 'Foam Roller',
    icon: RotateCw,
    purpose: 'Represents muscle recovery or stretching with a satisfying rolling animation.',
    category: 'Flexibility & Recovery',
  },
  {
    name: 'Massage Ball',
    icon: Orbit,
    purpose: 'Represents targeted myofascial release, showing the area of focus.',
    category: 'Flexibility & Recovery',
  },
  {
    name: 'Stretch Strap',
    icon: StretchHorizontal,
    purpose: 'Visualizes improved flexibility by showing a gradual increase in range of motion.',
    category: 'Flexibility & Recovery',
  },
];
