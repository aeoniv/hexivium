
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HexagramDisplay from "@/components/hexagrams/hexagram-display";
import { hexagrams, theBookOfLines, trigramMap as allTrigramMap } from "@/lib/data-provider";
import type { Hexagram } from "@/lib/types";
import { Button } from '../ui/button';
import { RefreshCcw, Wand2, Zap, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TrigramIcon } from '../trigram-icon';
import { getTcmAnalysis } from '@/ai/flows/tcm-analysis-flow';
import { Skeleton } from '../ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

const bookOfLinesData = theBookOfLines;
const allHexagrams = hexagrams;
const trigramMap = allTrigramMap;

interface TcmAdvancedDiagnosticsProps {
  celestialHexagram: Hexagram;
  terrestrialHexagram: Hexagram;
}

const pulseSigns: {yang: string, yin: string}[] = [
  { yin: "Weak", yang: "Strong" }, // Line 1: LV/LI
  { yin: "Deep", yang: "Surface" }, // Line 2: HT/BL
  { yin: "Flat", yang: "Swollen" }, // Line 3: PC/GB
  { yin: "Slow", yang: "Quick" }, // Line 4: SP/SI
  { yin: "Flabby", yang: "Energetic" }, // Line 5: LU/TB
  { yin: "Empty", yang: "Full" }, // Line 6: KD/ST
];

function hexagramToPulse(hexagram: Hexagram, isYin: boolean): { line: number, type: 'Yang' | 'Yin', pulse: string, role: 'Exaltation' | 'Detriment' }[] {
    // The binary string is line 1 to 6 (left to right)
    return hexagram.binary.split('').map((bit, index) => {
        const lineNum = index + 1;
        const isYangLine = bit === '1';
        
        // In a Yin hexagram, Yin lines are exaltation. In a Yang hexagram, Yang lines are exaltation.
        const role = (isYin && !isYangLine) || (!isYin && isYangLine) ? 'Exaltation' : 'Detriment';
        const pulse = isYangLine ? pulseSigns[lineNum-1].yang : pulseSigns[lineNum-1].yin;

        return {
            line: lineNum,
            type: isYangLine ? 'Yang' : 'Yin',
            pulse: pulse,
            role: role
        };
    });
}


function areOpposites(trigram1Binary: string, trigram2Binary: string): boolean {
  if (trigram1Binary.length !== trigram2Binary.length) return false;
  for (let i = 0; i < trigram1Binary.length; i++) {
    if (trigram1Binary[i] === trigram2Binary[i]) {
      return false;
    }
  }
  return true;
}

function hammingDistance(str1: string, str2: string): number {
    if (str1.length !== str2.length) {
        return -1; // Or throw an error
    }
    let distance = 0;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            distance++;
        }
    }
    return distance;
}

const UnifiedHexagramAnalysis = ({ celestialHexagram, terrestrialHexagram }: { celestialHexagram: Hexagram, terrestrialHexagram: Hexagram }) => {
    const unifiedLines = [];
    const bookOfLinesCelestial = bookOfLinesData.hexagrams.find(h => h.number === celestialHexagram.id);
    const bookOfLinesTerrestrial = bookOfLinesData.hexagrams.find(h => h.number === terrestrialHexagram.id);

    // binary string is line 1 to 6 (left to right)
    for (let i = 0; i < 6; i++) {
        const celestialBit = celestialHexagram.binary[i];
        const terrestrialBit = terrestrialHexagram.binary[i];
        const lineNum = i + 1;
        
        const celestialLineData = bookOfLinesCelestial?.lines.find(l => l.line_number === lineNum);
        const terrestrialLineData = bookOfLinesTerrestrial?.lines.find(l => l.line_number === lineNum);

        let resultState: 6 | 7 | 8 | 9;
        let interpretation = 'No interpretation found.';
        let stateLabel = '';
        let role: 'Exaltation' | 'Detriment' | null = null;

        // Based on the image, Celestial is Yang, Terrestrial is Yin.
        // Changing Yang (9) = Yang moves to Yin (1 -> 0)
        // Stable Yang (7)   = Yang stays Yang (1 -> 1)
        // Stable Yin (8)    = Yin stays Yin (0 -> 0)
        // Changing Yin (6)  = Yin moves to Yang (0 -> 1)

        if (terrestrialBit === '1' && celestialBit === '0') {
            resultState = 9; // Changing Yang (Yin becomes Yang -> not what the image says)
            stateLabel = '9 (Changing Yang)';
            role = 'Exaltation';
             // This seems reversed based on standard interpretation. Let's follow image logic.
            // If Yin (terrestrial) is the base and it becomes Yang (celestial), it's an upward/exalted change.
            interpretation = terrestrialLineData?.statements.exaltation.advice || terrestrialLineData?.text || 'Exaltation statement not found.';

        } else if (terrestrialBit === '1' && celestialBit === '1') {
            resultState = 7; // Stable Yang
            stateLabel = '7 (Stable Yang)';
            interpretation = terrestrialLineData?.text || 'Line text not found for Terrestrial hexagram.';

        } else if (terrestrialBit === '0' && celestialBit === '0') {
            resultState = 8; // Stable Yin
            stateLabel = '8 (Stable Yin)';
            interpretation = terrestrialLineData?.text || 'Line text not found for Terrestrial hexagram.';
        
        } else { // terrestrial '0' and celestial '1'
            resultState = 6; // Changing Yin (Yin becomes Yang)
            stateLabel = '6 (Changing Yin)';
            role = 'Detriment';
            // This is a move from stability to action, potentially disruptive, hence detriment.
            interpretation = terrestrialLineData?.statements.detriment.advice || terrestrialLineData?.text || 'Detriment statement not found.';
        }
        
        unifiedLines.push({ line: lineNum, state: resultState, stateLabel, interpretation, role });
    }
    
    return (
        <div className="text-center space-y-4">
            <h4 className="font-semibold">Unified Hexagram: The Alchemical Result</h4>
            <div className="p-4 border rounded-lg space-y-3 text-sm text-left">
                {unifiedLines.map(line => (
                     <div key={line.line} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                        <p className="font-bold">
                           Line {line.line}: <span className="text-primary font-mono">{line.stateLabel}</span>
                           {line.role && <span className={line.role === 'Exaltation' ? 'text-green-500 ml-2' : 'text-red-500 ml-2'}>({line.role})</span>}
                        </p>
                        <p className="text-muted-foreground italic mt-1">"{line.interpretation}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ComparativeMetrics = ({ celestialHexagram, terrestrialHexagram }: { celestialHexagram: Hexagram, terrestrialHexagram: Hexagram }) => {
    const upperCelestial = trigramMap.get(celestialHexagram.trigrams.upper);
    const lowerCelestial = trigramMap.get(celestialHexagram.trigrams.lower);
    const upperTerrestrial = trigramMap.get(terrestrialHexagram.trigrams.upper);
    const lowerTerrestrial = trigramMap.get(terrestrialHexagram.trigrams.lower);

    if (!upperCelestial || !lowerCelestial || !upperTerrestrial || !lowerTerrestrial) return null;

    const metrics = {
        hamming_hexagram: hammingDistance(celestialHexagram.binary, terrestrialHexagram.binary),
        hamming_upper: hammingDistance(upperCelestial.binary, upperTerrestrial.binary),
        hamming_lower: hammingDistance(lowerCelestial.binary, lowerTerrestrial.binary),
        same_upper_trigram: upperCelestial.binary === upperTerrestrial.binary,
        same_lower_trigram: lowerCelestial.binary === lowerTerrestrial.binary,
        opposite_upper_trigram: areOpposites(upperCelestial.binary, upperTerrestrial.binary),
        opposite_lower_trigram: areOpposites(lowerCelestial.binary, lowerTerrestrial.binary),
        opposite_hexagram: areOpposites(celestialHexagram.binary, terrestrialHexagram.binary),
    };

    const MetricItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <div className="flex justify-between items-center text-sm py-1 border-b border-dashed">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono font-semibold">{value}</span>
        </div>
    );

    return (
        <div className="text-center space-y-4">
            <h4 className="font-semibold">Comparative Analysis</h4>
            <div className="p-4 border rounded-lg text-left">
                <MetricItem label="Hexagram Hamming Distance" value={`${metrics.hamming_hexagram} / 6`} />
                <MetricItem label="Upper Trigram Hamming" value={`${metrics.hamming_upper} / 3`} />
                <MetricItem label="Lower Trigram Hamming" value={`${metrics.hamming_lower} / 3`} />
                <MetricItem label="Identical Upper Trigrams" value={metrics.same_upper_trigram ? 'Yes' : 'No'} />
                <MetricItem label="Identical Lower Trigrams" value={metrics.same_lower_trigram ? 'Yes' : 'No'} />
                <MetricItem label="Opposite Upper Trigrams" value={metrics.opposite_upper_trigram ? 'Yes' : 'No'} />
                <MetricItem label="Opposite Lower Trigrams" value={metrics.opposite_lower_trigram ? 'Yes' : 'No'} />
                <MetricItem label="Opposite Hexagrams" value={metrics.opposite_hexagram ? 'Yes' : 'No'} />
            </div>
        </div>
    )
}

const TcmAdvancedDiagnostics = ({ celestialHexagram, terrestrialHexagram }: TcmAdvancedDiagnosticsProps) => {
    const [heavenlyState, setHeavenlyState] = React.useState<Hexagram>(celestialHexagram);
    const [earthlyState, setEarthlyState] = React.useState<Hexagram>(terrestrialHexagram);
    const [analysis, setAnalysis] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        setHeavenlyState(celestialHexagram);
        setEarthlyState(terrestrialHexagram);
        setAnalysis(null);
    }, [celestialHexagram, terrestrialHexagram]);

    const resetHexagrams = () => {
        setHeavenlyState(celestialHexagram);
        setEarthlyState(terrestrialHexagram);
        setAnalysis(null);
    }
    
    const handleLineChange = (hexagram: Hexagram, lineIndex: number, isHeavenly: boolean) => {
        const binaryArray = hexagram.binary.split('');
        binaryArray[lineIndex] = binaryArray[lineIndex] === '1' ? '0' : '1';
        const newBinaryString = binaryArray.join('');
        const newHexagram = allHexagrams.find(h => h.binary === newBinaryString);

        if (newHexagram) {
            if (isHeavenly) {
                setHeavenlyState(newHexagram);
            } else {
                setEarthlyState(newHexagram);
            }
        }
    };
    
    const handleAiAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const upperHeavenly = trigramMap.get(heavenlyState.trigrams.upper);
            const lowerHeavenly = trigramMap.get(heavenlyState.trigrams.lower);
            const upperEarthly = trigramMap.get(earthlyState.trigrams.upper);
            const lowerEarthly = trigramMap.get(earthlyState.trigrams.lower);

            if (!upperHeavenly || !lowerHeavenly || !upperEarthly || !lowerEarthly) {
                throw new Error("Trigram data missing for analysis.");
            }

            const metrics = {
                hamming_hexagram: hammingDistance(heavenlyState.binary, earthlyState.binary),
                hamming_upper: hammingDistance(upperHeavenly.binary, upperEarthly.binary),
                hamming_lower: hammingDistance(lowerHeavenly.binary, lowerEarthly.binary),
                opposite_hexagram: areOpposites(heavenlyState.binary, earthlyState.binary),
            };

            const bookOfLinesHeavenly = bookOfLinesData.hexagrams.find(h => h.number === heavenlyState.id);
            const bookOfLinesEarthly = bookOfLinesData.hexagrams.find(h => h.number === earthlyState.id);

            const unifiedHexagram = Array.from({ length: 6 }).map((_, i) => {
                const heavenlyBit = heavenlyState.binary[i];
                const earthlyBit = earthlyState.binary[i];
                const lineNum = i + 1;
                
                const heavenlyLineData = bookOfLinesHeavenly?.lines.find(l => l.line_number === lineNum);
                const earthlyLineData = bookOfLinesEarthly?.lines.find(l => l.line_number === lineNum);

                let stateLabel = '';
                let interpretation = 'No interpretation available.';
                let role: 'Exaltation' | 'Detriment' | null = null;
        
                if (earthlyBit === '1' && heavenlyBit === '0') {
                    stateLabel = '9 (Changing Yang)';
                    role = 'Exaltation';
                    interpretation = earthlyLineData?.statements.exaltation.advice || earthlyLineData?.text || 'Exaltation statement not found.';
                } else if (earthlyBit === '1' && heavenlyBit === '1') {
                    stateLabel = '7 (Stable Yang)';
                    interpretation = earthlyLineData?.text || 'Line text not found.';
                } else if (earthlyBit === '0' && heavenlyBit === '0') {
                    stateLabel = '8 (Stable Yin)';
                    interpretation = earthlyLineData?.text || 'Line text not found.';
                } else { // earthly '0' and heavenly '1'
                    stateLabel = '6 (Changing Yin)';
                    role = 'Detriment';
                    interpretation = earthlyLineData?.statements.detriment.advice || earthlyLineData?.text || 'Detriment statement not found.';
                }
                return { line: lineNum, stateLabel, interpretation, role };
            });

            const input = {
                celestialHexagram: { // Heavenly
                    name: heavenlyState.name,
                    number: String(heavenlyState.number),
                    trigrams: heavenlyState.trigrams,
                    pulseBreakdown: hexagramToPulse(heavenlyState, false),
                },
                terrestrialHexagram: { // Earthly
                    name: earthlyState.name,
                    number: String(earthlyState.number),
                    trigrams: earthlyState.trigrams,
                    pulseBreakdown: hexagramToPulse(earthlyState, true),
                },
                unifiedHexagram,
                metrics,
            };

            const result = await getTcmAnalysis(input);
            setAnalysis(result.analysis);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }


  if (!heavenlyState || !earthlyState) {
    return null; // Or a loading state
  }

  const lowerHeavenlyTrigram = trigramMap.get(heavenlyState.trigrams.lower);
  const lowerEarthlyTrigram = trigramMap.get(earthlyState.trigrams.lower);
  const isBlocked = lowerHeavenlyTrigram && lowerEarthlyTrigram && areOpposites(lowerHeavenlyTrigram.binary, lowerEarthlyTrigram.binary);

  const renderHexagramAnalysis = (hexagram: Hexagram, title: string, isEarthly: boolean) => {
    const upperTrigram = trigramMap.get(hexagram.trigrams.upper);
    const lowerTrigram = trigramMap.get(hexagram.trigrams.lower);
    const pulseDescription = hexagramToPulse(hexagram, isEarthly);
    const bookOfLines = bookOfLinesData.hexagrams.find(h => h.number === hexagram.id);

    const upperTrigramLines = (upperTrigram?.binary.split('').map(b => b === '1' ? 'yang' : 'yin') as any) || [];
    const lowerTrigramLines = (lowerTrigram?.binary.split('').map(b => b === '1' ? 'yang' : 'yin') as any) || [];
    
    // Reverse for visual display top-to-bottom
    const hexagramLines = hexagram.binary.split('').reverse().map(b => b === '1' ? 'yang' : 'yin') as any;

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-center">{title}</h4>
            <p className="text-sm text-muted-foreground text-center -mt-3">{hexagram.id}: {hexagram.name}</p>
            <div className="flex justify-center gap-4 items-center">
                 <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-muted-foreground">Upper: {upperTrigram?.name}</p>
                    <HexagramDisplay lines={upperTrigramLines} isTrigram />
                </div>
                 <HexagramDisplay 
                    lines={hexagramLines}
                    onLineClick={(lineIndex) => handleLineChange(hexagram, 5-lineIndex, !isEarthly)} // Reverse index for clicking
                 />
                 <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-muted-foreground">Lower: {lowerTrigram?.name}</p>
                    <HexagramDisplay lines={lowerTrigramLines} isTrigram />
                </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pulse">
                <AccordionTrigger>Pulse Breakdown</AccordionTrigger>
                <AccordionContent>
                    <div className="text-xs space-y-1 p-2 rounded-md">
                        {pulseDescription.map((desc, i) => (
                            <p key={i} className="font-mono">
                                Line {desc.line}: {desc.type} - <span className={desc.role === 'Exaltation' ? 'text-green-500' : 'text-red-500'}>{desc.role}</span> ({desc.pulse})
                            </p>
                        ))}
                    </div>
                </AccordionContent>
              </AccordionItem>
              {bookOfLines && (
                 <AccordionItem value="book-of-lines">
                  <AccordionTrigger>The Book of Lines</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-xs space-y-2 p-2">
                      {bookOfLines.lines.map((line) => {
                        return (
                            <div key={line.line_number} className="border-b pb-2 last:border-0 last:pb-0">
                            <p className="font-bold">{line.line_number}: {line.title}</p>
                            <p className="text-muted-foreground italic">{line.subtitle}</p>
                            <p>{line.text}</p>
                            </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
        </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Advanced Diagnostics</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetHexagrams}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
        </div>
        <CardDescription>Trigram analysis and treatment simulation based on your selections.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderHexagramAnalysis(heavenlyState, "Heavenly Hexagram", false)}
            {renderHexagramAnalysis(earthlyState, "Earthly Hexagram", true)}
        </div>
        <Separator />
        <ComparativeMetrics celestialHexagram={heavenlyState} terrestrialHexagram={earthlyState} />
        <Separator />
         <div className="text-center">
            <h4 className="font-semibold">Blocking Analysis</h4>
            {isBlocked ? (
                 <div className="mt-2 text-destructive p-3 rounded-md border border-destructive/50 bg-destructive/10">
                    <div className="flex items-center justify-center gap-2 font-bold">
                        <Zap className="h-5 w-5" />
                        Energy Blocking Detected!
                    </div>
                    <p className="text-sm mt-2">The lower trigrams are direct opposites, creating a stagnant energy pattern.</p>
                    <div className="flex justify-center items-center gap-8 my-3">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs">Heavenly Lower</p>
                            {lowerHeavenlyTrigram && <TrigramIcon binary={lowerHeavenlyTrigram.binary} className="w-8 h-8"/>}
                            <p className="font-semibold">{lowerHeavenlyTrigram?.name}</p>
                        </div>
                        <p className="font-bold text-2xl">&harr;</p>
                        <div className="flex flex-col items-center gap-1">
                             <p className="text-xs">Earthly Lower</p>
                            {lowerEarthlyTrigram && <TrigramIcon binary={lowerEarthlyTrigram.binary} className="w-8 h-8"/>}
                            <p className="font-semibold">{lowerEarthlyTrigram?.name}</p>
                        </div>
                    </div>
                    <p className="text-sm">This indicates a conflict between internal (Earthly) and external (Heavenly) forces at a fundamental level. Consider reducing the energy to the Dai-Mai (Girdle Vessel) to harmonize this opposition and restore flow.</p>
                </div>
            ) : (
                <p className="text-muted-foreground mt-2">
                    No direct energy blocking detected between the lower trigrams.
                </p>
            )}
        </div>
        <Separator />
        <UnifiedHexagramAnalysis
            celestialHexagram={heavenlyState}
            terrestrialHexagram={earthlyState}
        />
        <Separator />
        <div className="text-center">
            <Button onClick={handleAiAnalysis} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Wand2 className="mr-2 h-4 w-4" />Get AI Analysis</>}
            </Button>
        </div>

        {(isLoading || analysis) && (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>AI Diagnostic Interpretation</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    )}
                </CardContent>
            </Card>
        )}

      </CardContent>
    </Card>
  );
};

export default TcmAdvancedDiagnostics;
