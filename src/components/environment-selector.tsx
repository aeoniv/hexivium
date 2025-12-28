
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAgentStore } from '@/hooks/use-agent-store';
import { environments, type Environment } from '@/lib/environments';
import { objects, type ObjectData } from '@/lib/objects';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function PlacementSelector() {
  const {
    selectedHex,
    setSelectedHex,
    placeEnvironment,
    placeObject,
  } = useAgentStore();
  const [selectionStage, setSelectionStage] = React.useState<'environment' | 'object'>('environment');

  const handleEnvironmentSelect = (environment: Environment) => {
    if (selectedHex) {
      placeEnvironment(selectedHex, environment);
      setSelectionStage('object');
    }
  };
  
  const handleObjectSelect = (object: ObjectData) => {
    if (selectedHex) {
      placeObject(selectedHex, object);
      setSelectedHex(null); 
      setSelectionStage('environment'); // Reset for next time
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedHex(null);
      setTimeout(() => setSelectionStage('environment'), 200); // Delay reset
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={!!selectedHex} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-xl"
        onPointerDownOutside={(event) => {
          // Prevent closing when interacting just outside to avoid accidental dismiss
          event.preventDefault();
        }}
        onClick={handleDialogClick}
      >
        {selectionStage === 'environment' ? (
          <>
            <DialogHeader>
              <DialogTitle>1. Build Your Environment</DialogTitle>
              <DialogDescription>
                Select an environmental element to place on the hex grid. This choice reflects the energetic foundation of your current space.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <Button
                    key={env.name}
                    variant="outline"
                    className="h-24 flex flex-col gap-2 p-2 text-center"
                    onClick={() => handleEnvironmentSelect(env)}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-xs">{env.name}</span>
                  </Button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>2. Choose Your Object</DialogTitle>
              <DialogDescription>
                Select an object to place within this environment. This represents the tool or focus for your habit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {objects.map((obj) => {
                const Icon = obj.icon;
                return (
                  <Button
                    key={obj.name}
                    variant="outline"
                    className="h-24 flex flex-col gap-2 p-2 text-center"
                    onClick={() => handleObjectSelect(obj)}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-xs">{obj.name}</span>
                  </Button>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
