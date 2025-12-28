
'use client';

import { Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { Hexagram } from '@/lib/types';
import { hexagramMap } from '@/lib/data-provider';

interface DiagramLegendProps {
    sunHexagramId: number | null;
}

const LegendItem = ({ icon, colorClass, label, data }: { icon?: React.ElementType, colorClass: string, label: string, data?: string | null }) => {
    const Icon = icon;
    return (
        <div className="flex items-center gap-2">
            <div className={`relative w-5 h-5 flex items-center justify-center`}>
                {Icon ? (
                    <>
                        <div className={`absolute inset-[-2px] rounded-full border-2 ${colorClass}`} />
                        <Icon className={`w-3 h-3 ${colorClass.replace('border-', 'text-')}`} />
                    </>
                ) : (
                     <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                )}
            </div>
            <div className="flex-1 text-xs text-muted-foreground">
                <span>{label}</span>
                {data && <span className="font-semibold text-foreground ml-1">{data}</span>}
            </div>
        </div>
    );
};


export function DiagramLegend({ sunHexagramId }: DiagramLegendProps) {

    const sunPosHexagram = sunHexagramId ? hexagramMap.get(sunHexagramId) : null;
    
    return (
        <div className="space-y-2">
            <Label>Legend</Label>
            <div className="grid grid-cols-2 gap-3 p-2 rounded-lg border">
                <LegendItem icon={Sun} colorClass="border-orange-500" label="Rave Wheel" data={sunPosHexagram ? `${sunPosHexagram.id}: ${sunPosHexagram.name}` : 'N/A'}/>
                <LegendItem colorClass="bg-destructive" label="Clicked (Manual)" />
            </div>
        </div>
    );
}
