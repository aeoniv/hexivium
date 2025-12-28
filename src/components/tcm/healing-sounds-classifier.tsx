
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Organ } from '@/lib/organs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';


interface HealingSound {
    name: string;
    pinyin: string;
    organ: string;
    organId: string;
    element: string;
    colorClass: string;
    frequencyRange: [number, number];
}

const healingSounds: HealingSound[] = [
    { name: '吹', pinyin: 'Chuī', organ: 'Kidneys', organId: 'KD', element: 'Water', colorClass: 'text-blue-500', frequencyRange: [100, 200] },
    { name: '呼', pinyin: 'Hū', organ: 'Spleen', organId: 'SP', element: 'Earth', colorClass: 'text-yellow-500', frequencyRange: [200, 350] },
    { name: '呵', pinyin: 'Hē', organ: 'Heart', organId: 'HT', element: 'Fire', colorClass: 'text-red-500', frequencyRange: [350, 500] },
    { name: '嘘', pinyin: 'Xū', organ: 'Liver', organId: 'LV', element: 'Wood', colorClass: 'text-green-500', frequencyRange: [500, 700] },
    { name: '呬', pinyin: 'Sī', organ: 'Lungs', organId: 'LU', element: 'Metal', colorClass: 'text-gray-400', frequencyRange: [700, 1500] },
    { name: '嘻', pinyin: 'Xī', organ: 'Triple Burner', organId: 'TB', element: 'Fire', colorClass: 'text-orange-500', frequencyRange: [1500, 4000] },
];

interface HealingSoundsClassifierProps {
  organs: Organ[];
  onPolarityChange: (id: string, polarity: '+' | '-') => void;
}


export function HealingSoundsClassifier({ organs, onPolarityChange }: HealingSoundsClassifierProps) {
    const [activeSound, setActiveSound] = React.useState<HealingSound | null>(null);
    const [isListening, setIsListening] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
    const [lowCut, setLowCut] = React.useState(-50); // dB threshold, -100 to 0
    const [highCut, setHighCut] = React.useState(5000); // Hz
    const { toast } = useToast();

    const audioContextRef = React.useRef<AudioContext | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const animationFrameRef = React.useRef<number>();

    const startListening = React.useCallback(async () => {
        if (isListening || hasPermission === false) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Float32Array(analyser.frequencyBinCount);

            const analyze = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getFloatFrequencyData(dataArray);

                let maxVal = -Infinity;
                let maxIndex = -1;

                // Find dominant frequency within the filter range
                for (let i = 0; i < analyserRef.current.frequencyBinCount; i++) {
                    const freq = i * audioContext.sampleRate / analyserRef.current.fftSize;
                    if (freq > highCut) break; // Stop checking above high-cut frequency

                    if (dataArray[i] > maxVal && dataArray[i] < lowCut) { // Use low-cut as a noise floor
                        maxVal = dataArray[i];
                        maxIndex = i;
                    }
                }
                
                if (maxIndex !== -1) {
                    const dominantFrequency = maxIndex * audioContext.sampleRate / analyserRef.current.fftSize;
                    const detectedSound = healingSounds.find(sound => 
                        dominantFrequency >= sound.frequencyRange[0] && dominantFrequency < sound.frequencyRange[1]
                    );

                    if (detectedSound && detectedSound.name !== activeSound?.name) {
                        setActiveSound(detectedSound);
                        const targetOrgan = organs.find(o => o.id === detectedSound.organId);
                        if (targetOrgan) {
                            onPolarityChange(targetOrgan.id, targetOrgan.polarity === '+' ? '-' : '+');
                             toast({
                                title: `${detectedSound.pinyin} Sound Detected!`,
                                description: `Toggled ${detectedSound.organ} polarity.`,
                            });
                        }
                    } else if (!detectedSound) {
                        setActiveSound(null);
                    }
                } else {
                    setActiveSound(null);
                }

                animationFrameRef.current = requestAnimationFrame(analyze);
            };

            analyze();
            setIsListening(true);
            setHasPermission(true);

        } catch (err) {
            console.error("Microphone access denied:", err);
            setHasPermission(false);
            toast({
                variant: "destructive",
                title: "Microphone Access Denied",
                description: "Please enable microphone permissions to use the Healing Sounds feature.",
            });
        }
    }, [isListening, hasPermission, toast, onPolarityChange, organs, activeSound, lowCut, highCut]);

    const stopListening = React.useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setIsListening(false);
        setActiveSound(null);
    }, []);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    
    React.useEffect(() => {
        return () => stopListening();
    }, [stopListening]);
    
    const hexagonalPositions = [
        { top: '0%', left: '50%', transform: 'translateX(-50%)' }, // Top
        { top: '25%', left: '93.3%', transform: 'translate(-50%, -50%)' }, // Top-right
        { top: '75%', left: '93.3%', transform: 'translate(-50%, -50%)' }, // Bottom-right
        { top: '100%', left: '50%', transform: 'translate(-50%, -100%)' }, // Bottom
        { top: '75%', left: '6.7%', transform: 'translate(-50%, -50%)' }, // Bottom-left
        { top: '25%', left: '6.7%', transform: 'translate(-50%, -50%)' }, // Top-left
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>The Six Healing Sounds (六字訣)</CardTitle>
                <CardDescription>Use your breath and voice to interact with your organ systems. Make one of the six healing sounds to see it detected here.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative w-48 h-52 mb-6">
                    {healingSounds.map((sound, index) => {
                        const isActive = activeSound?.name === sound.name;
                        return (
                             <TooltipProvider key={sound.name}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "absolute w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300",
                                                isActive
                                                    ? 'bg-primary/20 border-primary scale-110 shadow-lg'
                                                    : 'bg-muted/50 border-border'
                                            )}
                                            style={hexagonalPositions[index]}
                                        >
                                            <span className={cn("text-2xl font-bold font-mono", isActive ? sound.colorClass : 'text-muted-foreground')}>
                                                {sound.name}
                                            </span>
                                            <span className={cn("text-xs", isActive ? 'text-primary' : 'text-muted-foreground')}>
                                                {sound.pinyin}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{sound.organ} ({sound.element})</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
                <div className="w-full max-w-sm space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="low-cut" className="text-xs text-muted-foreground">Low-Cut Filter (Volume): {lowCut} dB</Label>
                        <Slider
                            id="low-cut"
                            min={-100}
                            max={0}
                            step={1}
                            value={[lowCut]}
                            onValueChange={(value) => setLowCut(value[0])}
                            disabled={isListening}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="high-cut" className="text-xs text-muted-foreground">High-Cut Filter (Frequency): {highCut} Hz</Label>
                        <Slider
                            id="high-cut"
                            min={1000}
                            max={10000}
                            step={250}
                            value={[highCut]}
                            onValueChange={(value) => setHighCut(value[0])}
                            disabled={isListening}
                        />
                    </div>
                </div>
                 <Button onClick={toggleListening} size="lg" variant={isListening ? "destructive" : "default"}>
                    {isListening ? (
                        <><MicOff className="mr-2 h-4 w-4" /> Stop Listening</>
                    ) : (
                        <><Mic className="mr-2 h-4 w-4" /> Start Listening</>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
