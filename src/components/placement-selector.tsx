
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAgentStore } from '@/hooks/use-agent-store';
import { environments, type Environment } from '@/lib/environments';
import { objects, type ObjectData } from '@/lib/objects';
import { furniture, type FurnitureData } from '@/lib/furniture';
import { trainingTools, type TrainingToolData } from '@/lib/training-tools';
import { kungFuWeapons, type KungFuWeaponData } from '@/lib/kung-fu-weapons';
import { structures, type StructureData } from '@/lib/structures';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

export function PlacementSelector() {
  const {
    selectedHex,
    setSelectedHex,
    placeEnvironment,
    placeObject,
    placeFurniture,
    placeStructure,
  } = useAgentStore();
  
  const dialogRef = React.useRef<HTMLDivElement>(null);
  
  useOnClickOutside(dialogRef, () => {
    if (selectedHex) {
      setSelectedHex(null);
    }
  });


  const handleSelection = (callback: () => void) => {
    callback();
    setSelectedHex(null);
  }

  const handleEnvironmentSelect = (environment: Environment) => {
    if (selectedHex) {
      handleSelection(() => placeEnvironment(selectedHex, environment));
    }
  };
  
  const handleObjectSelect = (object: ObjectData | TrainingToolData | KungFuWeaponData) => {
    if (selectedHex) {
      handleSelection(() => placeObject(selectedHex, object));
    }
  };

  const handleFurnitureSelect = (item: FurnitureData) => {
    if (selectedHex) {
      handleSelection(() => placeFurniture(selectedHex, item));
    }
  };

  const handleStructureSelect = (item: StructureData) => {
    if (selectedHex) {
      handleSelection(() => placeStructure(selectedHex, item));
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedHex(null);
    }
  };
  
  const objectCategories = Array.from(new Set(objects.map(o => o.category)));
  const trainingToolCategories = ['Weight Training', 'Cardio & Endurance', 'Flexibility & Recovery'];


  return (
    <Dialog open={!!selectedHex} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className="sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>Inventory</DialogTitle>
          <DialogDescription>
            Choose an environment, object, or piece of furniture to place on the selected hexagon.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">1. Environment</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {environments.map((env) => {
                    const Icon = env.icon;
                    return (
                    <Button
                        key={env.name}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                        onClick={() => handleEnvironmentSelect(env)}
                    >
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="leading-tight">{env.name}</span>
                    </Button>
                    );
                })}
                </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Food (Diet)</h3>
              {objectCategories.map(category => (
                  <div key={category} className="mb-4">
                      <h4 className="text-md font-medium mb-2 text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {objects.filter(o => o.category === category).map((obj) => {
                          const Icon = obj.icon;
                          return (
                          <Button
                              key={obj.name}
                              variant="outline"
                              className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                              onClick={() => handleObjectSelect(obj)}
                          >
                              <Icon className="w-6 h-6 text-primary" />
                              <span className="leading-tight">{obj.name}</span>
                          </Button>
                          );
                      })}
                      </div>
                  </div>
              ))}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Training Tools (Awareness)</h3>
              {trainingToolCategories.map(category => (
                  <div key={category} className="mb-4">
                      <h4 className="text-md font-medium mb-2 text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {trainingTools.filter(o => o.category === category).map((obj) => {
                          const Icon = obj.icon;
                          return (
                          <Button
                              key={obj.name}
                              variant="outline"
                              className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                              onClick={() => handleObjectSelect(obj)}
                          >
                              <Icon className="w-6 h-6 text-primary" />
                              <span className="leading-tight">{obj.name}</span>
                          </Button>
                          );
                      })}
                      </div>
                  </div>
              ))}
            </div>

            <Separator />

             <div>
                <h3 className="text-lg font-semibold mb-2">4. Martial Arts</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {kungFuWeapons.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Button
                        key={item.name}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                        onClick={() => handleObjectSelect(item)}
                    >
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="leading-tight">{item.name}</span>
                    </Button>
                    );
                })}
                </div>
            </div>

            <Separator />

             <div>
                <h3 className="text-lg font-semibold mb-2">5. Perspective (Motivation)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {furniture.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Button
                        key={item.name}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                        onClick={() => handleFurnitureSelect(item)}
                    >
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="leading-tight">{item.name}</span>
                    </Button>
                    );
                })}
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-lg font-semibold mb-2">6. Structure</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {structures.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Button
                        key={item.name}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 p-2 text-center text-xs"
                        onClick={() => handleStructureSelect(item)}
                    >
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="leading-tight">{item.name}</span>
                    </Button>
                    );
                })}
                </div>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
