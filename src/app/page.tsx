
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Bot,
  Shapes,
  Milestone,
  Book,
  Grid3x3,
  BrainCircuit,
  FileJson,
  UserCheck,
  Calendar,
  Compass,
  Orbit,
} from 'lucide-react';
import Logo from '@/components/icons/logo';
import { HomeCanvas } from '@/components/home-canvas';

const navItems = [
  // The order here is for visual placement in the rhombus
  { href: '/iching', label: 'I-Ching', icon: FileJson },  
  { href: '/book-of-life', label: 'Book of Life', icon: Book },       
  { href: '/human-design', label: 'Human Design', icon: UserCheck },
  { href: '/calendar', label: 'Calendar', icon: Calendar },              
  { href: '/huo-hou-tu', label: 'Huo Hou Tu', icon: Shapes },         
  { href: '/journeys', label: 'Hero\'s Journey', icon: Milestone }, 
  { href: '/luopan', label: 'Luopan', icon: Compass },
  { href: '/canvas-chatbot', label: 'Bot', icon: Bot },
];

export default function Home() {
  const centralItem =   { href: '/tcm-organ-calculator', label: 'Chinese Medicine', icon: BrainCircuit };

  const getRhombusPosition = (index: number) => {
    // Scaled down positions for a smaller rhombus
    const positions = [
      { x: 0, y: -7 },   // Top
      { x: 3.5, y: -3.5 },   // Top-Right
      { x: 7, y: 0 },    // Right
      { x: 3.5, y: 3.5 },    // Bottom-Right
      { x: 0, y: 7 },    // Bottom
      { x: -3.5, y: 3.5 },   // Bottom-Left
      { x: -7, y: 0 },   // Left
      { x: -3.5, y: -3.5 },  // Top-Left
    ];

    const pos = positions[index];
    if (!pos) return {}; // safety check

    return {
      transform: `translate(${pos.x}rem, ${pos.y}rem)`
    };
  };

  const isGoldItem = (label: string) => {
    return ['I-Ching', 'Huo Hou Tu'].includes(label);
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-4 py-16">
      
      {/* Section 1: Title */}
      <div className="flex-shrink-0">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mb-2">
              <Logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground/90 to-primary">
                  Hexivium
              </h1>
          </div>
          <p className="text-lg text-muted-foreground">The Path of Changes. An explanation of the project.</p>
        </div>
      </div>

      {/* Section 2: dodeca-octahedrongeomery (Visual Placeholder) */}
      <div className="relative flex-grow flex items-center justify-center w-full my-8
                      before:absolute before:inset-0 before:z-10
                      before:bg-gradient-to-t before:from-background before:via-transparent before:to-background">
         <HomeCanvas />
      </div>

      {/* Section 3: 9 Buttons */}
      <div className="flex-shrink-0">
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Central Item */}
          <Link href={centralItem.href} className="z-10 transform transition-transform duration-300 hover:scale-105">
              <Card className="h-20 w-20 bg-card/50 backdrop-blur-sm hover:bg-card/80 border-2 border-amber-500/80 transition-all duration-300 rounded-full">
              <CardContent className="flex flex-col items-center justify-center p-2 aspect-square">
                  <centralItem.icon className="h-6 w-6 mb-1 text-amber-500" />
                  <span className="text-[10px] font-semibold text-center text-foreground">{centralItem.label}</span>
              </CardContent>
              </Card>
          </Link>
          
          {/* Surrounding Items */}
          {navItems.map((item, index) => {
            if (!item) return null; // Add a guard for safety
            const Icon = item.icon;
            const positionStyle = getRhombusPosition(index);
            const goldIconClass = isGoldItem(item.label) ? 'text-amber-500' : 'text-primary';
            const goldBorderClass = isGoldItem(item.label) ? 'border-2 border-amber-500/80' : 'hover:border-primary/50';

            
            return (
              <Link href={item.href} key={item.href} className="absolute transform transition-transform duration-300 hover:scale-110" style={positionStyle}>
                <Card className={cn("h-16 w-16 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 rounded-full", goldBorderClass)}>
                  <CardContent className="flex flex-col items-center justify-center p-1 aspect-square">
                    <Icon className={cn("h-5 w-5", goldIconClass)} />
                    <span className="text-[9px] font-semibold text-center text-foreground mt-1">{item.label}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
