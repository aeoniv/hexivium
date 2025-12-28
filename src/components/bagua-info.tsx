
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { baguaAreas } from '@/lib/bagua-data';
import { Label } from './ui/label';
import { Separator } from './ui/separator';


export function BaguaInfo() {
  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <Label>I Ching Grid Areas</Label>
        <p className="text-xs text-muted-foreground pt-1">
            Use these life areas to guide your habit placement on the hex grid.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {baguaAreas.map((area) => {
            const Icon = area.icon;
            return (
              <AccordionItem value={area.name} key={area.name}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{area.name} ({area.direction})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-xs pl-2">
                  <p><strong>Focus:</strong> {area.habitFocus}</p>
                  <p><strong>Feature Idea:</strong> {area.feature}</p>
                </AccordionContent>
              </AccordionItem>
            )
        })}
      </Accordion>
    </div>
  );
}
