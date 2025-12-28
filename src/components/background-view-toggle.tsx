
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAgentStore, type BackgroundView } from '@/hooks/use-agent-store';
import { Layers } from 'lucide-react';

export function BackgroundViewToggle() {
  const { setBackgroundView } = useAgentStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Layers className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle background view</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setBackgroundView('2d')}>
          2D
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setBackgroundView('3d')}>
          3D
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setBackgroundView('4d')}>
          4D
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
