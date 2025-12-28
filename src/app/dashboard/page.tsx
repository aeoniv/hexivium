
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Bot,
  Shapes,
  Milestone,
  Book,
  Grid3x3,
  BrainCircuit,
  FileJson,
  Calendar,
  Orbit,
  UserCheck,
  Compass,
} from 'lucide-react';

const navItems = [
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/iching', label: 'I-Ching', icon: FileJson },
  { href: '/journeys', label: 'Hero\'s Journey', icon: Milestone },
  { href: '/canvas-chatbot', label: 'Bot', icon: Bot },
  { href: '/tcm-organ-calculator', label: 'TCM', icon: BrainCircuit },
  { href: '/human-design', label: 'Human Design', icon: UserCheck },
  { href: '/book-of-life', label: 'Book of Life', icon: Book },
  { href: '/huo-hou-tu', label: 'Huo Hou Tu', icon: Shapes },
  { href: '/luopan', label: 'Luopan', icon: Compass },
];

export default function DashboardPage() {

  return (
    <main className="container mx-auto p-4 md:p-8">
       <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Navigate through the cosmic energies.</p>
      </header>
      
      <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-xl mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <Link href={item.href} key={item.href} className="transform transition-transform duration-300 hover:scale-105">
              <Card className="h-full w-full bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/50 transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 aspect-square">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 mb-2 sm:mb-3 text-primary" />
                  <span className="text-xs sm:text-sm font-semibold text-center text-foreground">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
