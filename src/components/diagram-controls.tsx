

'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Mode, AutoSequenceName, HighlightMode } from '@/lib/types';
import { DiagramLegend } from './diagram-legend';
import { Separator } from './ui/separator';
import { MeridianClockLegend } from './meridian-clock-legend';
import { Switch } from '@/components/ui/switch';

interface DiagramControlsProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    transitionTime: number;
    setTransitionTime: (time: number) => void;
    autoSequenceName: AutoSequenceName;
    setAutoSequenceName: (name: AutoSequenceName) => void;
    sunHexagramId: number | null;
    highlightMode: HighlightMode;
    setHighlightMode: (mode: HighlightMode) => void;
}

export function DiagramControls({
    mode,
    setMode,
    transitionTime,
    setTransitionTime,
    autoSequenceName,
    setAutoSequenceName,
    sunHexagramId,
    highlightMode,
    setHighlightMode,
}: DiagramControlsProps) {
    return (
        <div className="p-2 space-y-4">
            <div>
                <Label>Mode</Label>
                <RadioGroup value={mode} onValueChange={(value: Mode) => setMode(value)} className="flex items-center space-x-2 pt-2">
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual" className="text-xs">Manual</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="automatic" id="automatic" />
                        <Label htmlFor="automatic" className="text-xs">Auto</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="highlight-mode">Highlight Trail</Label>
                <Switch
                    id="highlight-mode"
                    checked={highlightMode === 'trail'}
                    onCheckedChange={(checked) => setHighlightMode(checked ? 'trail' : 'single')}
                />
            </div>

            {mode === 'automatic' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                        <Label>Transition Speed: {transitionTime / 1000}s</Label>
                        <Slider
                            min={200}
                            max={5000}
                            step={100}
                            value={[transitionTime]}
                            onValueChange={(value) => setTransitionTime(value[0])}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Sequence</Label>
                        <Select value={autoSequenceName} onValueChange={(value) => setAutoSequenceName(value as AutoSequenceName)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select sequence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="binaryPulses">Binary Pulses</SelectItem>
                                <SelectItem value="bodyPulses">Body Pulses</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            <Separator />
            <DiagramLegend 
                 sunHexagramId={sunHexagramId}
            />
            <Separator />
            <MeridianClockLegend solarActiveHexagramId={sunHexagramId} />
        </div>
    );
}
