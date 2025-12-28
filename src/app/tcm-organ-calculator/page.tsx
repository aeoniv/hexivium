

'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Wand2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganDiagram from "@/components/tcm/organ-diagram";
import DiagnosticPanel from "@/components/tcm/diagnostic-panel";
import { initialOrgans, Organ } from "@/lib/organs";
import HexagramDisplay from "@/components/hexagrams/hexagram-display";
import { hexagrams as allHexagrams } from "@/lib/i-ching-data";
import type { Hexagram } from "@/lib/types";
import TcmAdvancedDiagnostics from "@/components/tcm/tcm-advanced-diagnostics";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { dataAnalysis } from '@/ai/flows/data-analysis-flow';
import { NinePalacesGrid } from '@/components/nine-palaces-grid';
import { Separator } from '@/components/ui/separator';
import { SovereignHexagramsCycle } from '@/components/tcm/sovereign-hexagrams-cycle';
import { sovereignHexagramsData, type SovereignHexagramInfo } from '@/lib/tcm-sovereign-hexagrams';
import { HealingSoundsClassifier } from '@/components/tcm/healing-sounds-classifier';

type Line = "yin" | "yang" | null;

const sovereignHexagramsMap = new Map<number, SovereignHexagramInfo>(sovereignHexagramsData.map(item => [item.hexagramId, item]));

const SovereignInfoDisplay: React.FC<{ info: SovereignHexagramInfo, type: 'Heavenly' | 'Earthly' }> = ({ info, type }) => (
  <Card className="mt-4 border-primary/50 bg-primary/5">
      <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Sovereign Hexagram Activated: {info.concept} ({type})
          </CardTitle>
          <CardDescription>{info.month} - {info.position}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
          <div>
              <h4 className="font-semibold text-primary/90">Liu Yiming:</h4>
              <p className="text-muted-foreground italic">"{info.descriptionLiuYiming}"</p>
          </div>
          <div>
              <h4 className="font-semibold text-primary/90">Wei Boyang:</h4>
              <p className="text-muted-foreground italic">"{info.descriptionWeiBoyang}"</p>
          </div>
          <div>
              <h4 className="font-semibold text-primary/90">Relative Meridian Channel:</h4>
              <p className="text-muted-foreground">{info.meridian}</p>
          </div>
          <div>
              <h4 className="font-semibold text-primary/90">Notes:</h4>
              <p className="text-muted-foreground">{info.notes}</p>
          </div>
      </CardContent>
  </Card>
);


const TCMOrganPolarityCalculator = () => {
  const searchParams = useSearchParams();
  const [organs, setOrgans] = useState<Organ[]>(initialOrgans);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [csvData, setCsvData] = useState('');
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const { toast } = useToast();
    
  // Heavenly Organs Mapping to Hexagram Lines (Bottom to Top)
  const heavenlyOrder = ["LI", "BL", "GB", "SI", "TB", "ST"];
  // Earthly Organs Mapping to Hexagram Lines (Bottom to Top)
  const earthlyOrder = ["LV", "HT", "PC", "SP", "LU", "KD"];

  useEffect(() => {
    const celestialBinary = searchParams.get('celestial');
    const terrestrialBinary = searchParams.get('terrestrial');

    if (celestialBinary && terrestrialBinary) {
      setOrgans(currentOrgans => {
        const newOrgans = [...currentOrgans];
        
        // The celestial hexagram from I-Ching corresponds to Heavenly organs
        heavenlyOrder.forEach((id, index) => {
          const organIndex = newOrgans.findIndex(o => o.id === id);
          if (organIndex !== -1) {
            newOrgans[organIndex].polarity = celestialBinary[index] === '1' ? '+' : '-';
          }
        });

        // The terrestrial hexagram from I-Ching corresponds to Earthly organs
        earthlyOrder.forEach((id, index) => {
            const organIndex = newOrgans.findIndex(o => o.id === id);
            if (organIndex !== -1) {
              newOrgans[organIndex].polarity = terrestrialBinary[index] === '1' ? '+' : '-';
            }
        });

        return newOrgans;
      });
      toast({
          title: "I-Ching Data Loaded",
          description: "Organ polarities have been set based on your recent reading.",
      });
    }
  }, [searchParams, toast]);

  const handleOrganClick = (id: string) => {
    setOrgans(
      organs.map((organ) =>
        organ.id === id
          ? { ...organ, polarity: organ.polarity === "+" ? "-" : "+" }
          : organ
      )
    );
    setLastClickedId(id);
  };
  
  const handlePolarityChange = (id: string, polarity: '+' | '-') => {
    setOrgans(
      organs.map((organ) =>
        organ.id === id ? { ...organ, polarity } : organ
      )
    );
    setLastClickedId(id);
  };

  const getHexagramForGroup = (order: string[]): Hexagram => {
    // Binary string is built from bottom line (index 0) to top line (index 5)
    const lineValues = order.map(id => {
      const organ = organs.find(o => o.id === id);
      return organ ? (organ.polarity === '+' ? '1' : '0') : '0';
    }).join('');

    // The library expects the binary string with line 1 at the leftmost position
    const libraryBinary = lineValues;
    const foundHexagram = allHexagrams.find(h => h.binary === libraryBinary);

    if (foundHexagram) {
      return foundHexagram;
    }
    
    return {
        id: 0,
        number: '?',
        name: "Unknown",
        chineseName: "?",
        binary: libraryBinary,
        trigrams: { upper: "Unknown", lower: "Unknown" },
        description: "This combination does not form a known hexagram.",
        hexagramSymbol: '?'
    };
  }

  const getLinesForGroup = (order: string[]): Line[] => {
      // Order is bottom-to-top, but display is top-to-bottom, so reverse for visual
      return order.map(id => {
          const organ = organs.find(o => o.id === id);
          if (!organ) return null;
          return organ.polarity === '+' ? 'yang' : 'yin';
      }).reverse();
  }

  const heavenlyHexagram = useMemo(() => getHexagramForGroup(heavenlyOrder), [organs]);
  const earthlyHexagram = useMemo(() => getHexagramForGroup(earthlyOrder), [organs]);

  const heavenlyHexagramLines = getLinesForGroup(heavenlyOrder);
  const earthlyHexagramLines = getLinesForGroup(earthlyOrder);
  
  const activeSovereignHeavenly = useMemo(() => sovereignHexagramsMap.get(heavenlyHexagram.id), [heavenlyHexagram]);
  const activeSovereignEarthly = useMemo(() => sovereignHexagramsMap.get(earthlyHexagram.id), [earthlyHexagram]);

  const handleAnalyze = async () => {
    if (!csvData || !question) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both health data (CSV) and a question.',
      });
      return;
    }
    setIsAnalysisLoading(true);
    setAnalysis('');
    try {
      const result = await dataAnalysis({ csvData, question });
      setAnalysis(result.analysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8 pt-16 md:pt-24">
      <div className="w-full max-w-7xl">
        <main className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Organ-Hexagram Correlates</CardTitle>
                <CardDescription>
                  This interactive diagram shows the relationship between organ polarities and their corresponding Heavenly and Earthly hexagrams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center" data-name="tcm-hexagram-display" title="TCM Hexagram Display">
                    <Card className="w-full max-w-xs mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Heavenly</CardTitle>
                        <CardDescription className="text-center">#{heavenlyHexagram.number}: {heavenlyHexagram.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HexagramDisplay lines={heavenlyHexagramLines} />
                    </CardContent>
                    </Card>
                    <div className="w-full max-w-md">
                    <OrganDiagram
                        organs={organs}
                        onOrganClick={handleOrganClick}
                        lastClickedId={lastClickedId}
                    />
                    </div>
                    <Card className="w-full max-w-xs mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Earthly</CardTitle>
                        <CardDescription className="text-center">#{earthlyHexagram.number}: {earthlyHexagram.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HexagramDisplay lines={earthlyHexagramLines} />
                    </CardContent>
                    </Card>
                </div>
              </CardContent>
            </Card>
            <HealingSoundsClassifier organs={organs} onPolarityChange={handlePolarityChange} />
            <Card>
              <CardHeader>
                  <CardTitle>The 12 Sovereign Hexagrams</CardTitle>
                  <CardDescription>This cycle illustrates the rise and fall of Yang and Yin energy throughout the lunar year, correlated with TCM meridians.</CardDescription>
              </CardHeader>
              <CardContent>
                <SovereignHexagramsCycle activeHexagramIds={[heavenlyHexagram.id, earthlyHexagram.id]} />
                 {activeSovereignHeavenly && <SovereignInfoDisplay info={activeSovereignHeavenly} type="Heavenly" />}
                 {activeSovereignEarthly && activeSovereignEarthly.hexagramId !== activeSovereignHeavenly?.hexagramId && <SovereignInfoDisplay info={activeSovereignEarthly} type="Earthly" />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>9 Palaces - Flying Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <NinePalacesGrid 
                  celestialLowerTrigramName={heavenlyHexagram.trigrams.lower}
                  terrestrialLowerTrigramName={earthlyHexagram.trigrams.lower}
                />
              </CardContent>
            </Card>
           
          <div className="space-y-8">
            <DiagnosticPanel organs={organs} onPolarityChange={handlePolarityChange} />
            
            {heavenlyHexagram && earthlyHexagram && (
              <TcmAdvancedDiagnostics 
                celestialHexagram={heavenlyHexagram}
                terrestrialHexagram={earthlyHexagram}
              />
            )}
            
            <Card>
              <CardHeader>
                  <CardTitle>Health Data Analysis</CardTitle>
                  <CardDescription>
                    Correlate your health data with TCM diagnostics. Paste your dataset (e.g., from a health app export) as CSV and ask a question.
                    The organ polarities may be pre-filled if you navigated from an I-Ching reading.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="csv-data">Health Data (CSV)</Label>
                      <Textarea
                          id="csv-data"
                          placeholder="Paste your health data here.&#10;e.g.&#10;date,sleep_hours,heart_rate&#10;2024-01-01,7.5,65&#10;2024-01-02,8,62"
                          value={csvData}
                          onChange={(e) => setCsvData(e.target.value)}
                          className="h-48 font-mono text-xs"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input
                          id="question"
                          placeholder="e.g., Is there a correlation between sleep and heart rate?"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                      />
                  </div>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleAnalyze} disabled={isAnalysisLoading} className="w-full">
                      {isAnalysisLoading ? 'Analyzing...' : <> <Wand2 className="mr-2" /> Analyze Data </>}
                  </Button>
              </CardFooter>
            </Card>

            {(isAnalysisLoading || analysis) && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isAnalysisLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ) : (
                            <p className="text-foreground/90 whitespace-pre-wrap">{analysis}</p>
                        )}
                    </CardContent>
                </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

// Wrap the component that uses searchParams in a Suspense boundary
const TCMOrganPolarityCalculatorPage = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <TCMOrganPolarityCalculator />
  </React.Suspense>
);

export default TCMOrganPolarityCalculatorPage;
