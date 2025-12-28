
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { zodiacSequence, hexagrams as allHexagrams } from '@/lib/i-ching-data';
import type { Hexagram } from '@/lib/types';
import { cn } from '@/lib/utils';

const hexagramMap = new Map<number, Hexagram>(allHexagrams.map(h => [h.id, h]));

const initialJourneySteps = [
    { id: 'ordinary-world', title: 'The Ordinary World', task: 'Post a "before" photo of the project/workspace.' },
    { id: 'call-to-adventure', title: 'The Call to Adventure', task: 'Post a sunrise photo with your daily goal.' },
    { id: 'refusal-of-call', title: 'Refusal of the Call', task: 'Post a photo/meme of your main obstacle.' },
    { id: 'meeting-mentor', title: 'Meeting the Mentor', task: 'Screenshot the feature they will rely on.' },
    { id: 'crossing-threshold', title: 'Crossing the Threshold', task: 'Screenshot their very first action/click.' },
    { id: 'tests-allies-enemies', title: 'Tests, Allies & Enemies', task: 'Post a mid-day photo with a progress update.' },
    { id: 'inmost-cave', title: 'Approach to the Inmost Cave', task: 'Screenshot the most difficult part of the task.' },
    { id: 'ordeal', title: 'The Ordeal', task: 'Screenshot the final action (e.g., hitting "Send").' },
    { id: 'reward', title: 'The Reward', task: 'Post a photo of the successful outcome/result.' },
    { id: 'road-back', title: 'The Road Back', task: 'Post a sunset photo with a key takeaway.' },
    { id: 'resurrection', title: 'The Resurrection', task: 'Share a "before & after" comparison.' },
    { id: 'return-with-elixir', title: 'Return with the Elixir', task: 'Create a testimonial (photo + quote).' },
];

const journeySteps = initialJourneySteps.map((step, index) => {
    const hexagramId = zodiacSequence[index];
    const hexagram = hexagramMap.get(hexagramId);
    return {
        ...step,
        hexagramId,
        hexagramName: hexagram ? `${hexagram.id}: ${hexagram.name}` : '',
        hexagram: hexagram,
    };
});

type JourneyStep = (typeof journeySteps)[0];

export function GridJourneyView() {
    const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);

    return (
        <>
            <div className="space-y-8 max-w-4xl mx-auto">
                {journeySteps.map((step, index) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex flex-col md:flex-row items-center gap-4 md:gap-8 group",
                            index % 2 !== 0 && "md:flex-row-reverse"
                        )}
                    >
                        <div 
                            className="w-full md:w-1/2 aspect-video relative overflow-hidden rounded-lg cursor-pointer"
                            onClick={() => setSelectedStep(step)}
                        >
                            <Image
                                src={`https://picsum.photos/seed/${step.hexagramId}/600/400`}
                                alt={step.title}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-center font-bold">View Details</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{step.task}</p>
                            <p className="text-xs text-primary font-semibold mt-2">{step.hexagramName}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedStep} onOpenChange={(isOpen) => !isOpen && setSelectedStep(null)}>
                <DialogContent className="max-w-md">
                    {selectedStep && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedStep.title}</DialogTitle>
                                <DialogDescription>{selectedStep.task}</DialogDescription>
                                <p className="text-xs text-primary font-semibold pt-1">{selectedStep.hexagramName}</p>
                            </DialogHeader>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden my-4">
                                <Image
                                    src={`https://picsum.photos/seed/${selectedStep.hexagramId}/600/400`}
                                    alt={selectedStep.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
