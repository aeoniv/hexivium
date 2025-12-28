
'use client';

import { useState, useMemo, useEffect } from 'react';
import { sequences } from '@/lib/i-ching-data';
import { hexagramMap, trigramMap as allTrigramMap } from '@/lib/data-provider';
import type { Hexagram, SequenceName, Trigram, Mode, HighlightMode, AutoSequenceName } from '@/lib/types';
import { InteractiveCircularLayout } from './interactive-circular-layout';
import { FivePointedStar } from './five-pointed-star';
import { TrigramSelector } from './trigram-selector';
import { OctagonDiagram } from './octagon-diagram';
import { trigrams } from '@/lib/i-ching-data';

const trigramNameMap = allTrigramMap;

function getSequenceHexagrams(key: SequenceName): Hexagram[] {
  const sequence = sequences.find(s => s.key === key);
  if (!sequence) return [];
  return (sequence.hexagramIds as readonly number[]).map(id => hexagramMap.get(id)).filter(Boolean) as Hexagram[];
}

const outerHeadTrigramSequence: Trigram[] = [
  trigramNameMap.get('Fire')!,
  trigramNameMap.get('Earth')!,
  trigramNameMap.get('Lake')!,
  trigramNameMap.get('Heaven')!,
  trigramNameMap.get('Water')!,
  trigramNameMap.get('Mountain')!,
  trigramNameMap.get('Thunder')!,
  trigramNameMap.get('Wind')!,
].filter(Boolean);

const innerHeadTrigramSequence: Trigram[] = [
    trigramNameMap.get('Heaven')!,
    trigramNameMap.get('Wind')!,
    trigramNameMap.get('Water')!,
    trigramNameMap.get('Mountain')!,
    trigramNameMap.get('Earth')!,
    trigramNameMap.get('Thunder')!,
    trigramNameMap.get('Fire')!,
    trigramNameMap.get('Lake')!,
].filter(Boolean);

interface HuoHouTuDiagramProps {
    mode: Mode;
    activeHexagram: Hexagram | null;
    sunHexagramId: number | null;
    highlightMode: HighlightMode;
    autoSequenceName: AutoSequenceName;
}

export function HuoHouTuDiagram({ mode, activeHexagram, sunHexagramId, highlightMode, autoSequenceName }: HuoHouTuDiagramProps) {
  const [selectedUpperTrigram, setSelectedUpperTrigram] = useState<Trigram | null>(null);
  const [selectedLowerTrigram, setSelectedLowerTrigram] = useState<Trigram | null>(null);
  const [lastClickedHexagramId, setLastClickedHexagramId] = useState<number | null>(null);
  const [topActiveElement, setTopActiveElement] = useState<string | null>(null);
  const [bottomActiveElement, setBottomActiveElement] = useState<string | null>(null);

  const diagramActiveHexagramId = useMemo(() => {
    if (mode === 'manual') {
        if (selectedUpperTrigram && selectedLowerTrigram) {
            const foundHexagram = Array.from(hexagramMap.values()).find(h => 
                h.trigrams.upper === selectedUpperTrigram.name && 
                h.trigrams.lower === selectedLowerTrigram.name
            );
            return foundHexagram ? foundHexagram.id : null;
        }
        return null;
    }
    return activeHexagram ? activeHexagram.id : null;
  }, [mode, activeHexagram, selectedUpperTrigram, selectedLowerTrigram]);


  useEffect(() => {
    const getElementForTrigram = (trigramName: string | undefined): string | null => {
      if (!trigramName) return null;
      switch (trigramName) {
        case 'Heaven':
        case 'Lake':
          return 'Metal';
        case 'Thunder':
        case 'Wind':
          return 'Wood';
        case 'Fire':
          return 'Fire';
        case 'Water':
          return 'Water';
        case 'Earth':
        case 'Mountain':
          return 'Earth';
        default:
          return null;
      }
    };

    let currentUpperTrigram: Trigram | null = null;
    let currentLowerTrigram: Trigram | null = null;
    
    if (mode === 'manual') {
        currentUpperTrigram = selectedUpperTrigram;
        currentLowerTrigram = selectedLowerTrigram;
    } else if (activeHexagram) {
        currentUpperTrigram = trigramNameMap.get(activeHexagram.trigrams.upper) || null;
        currentLowerTrigram = trigramNameMap.get(activeHexagram.trigrams.lower) || null;
        setSelectedUpperTrigram(currentUpperTrigram);
        setSelectedLowerTrigram(currentLowerTrigram);
    }
    
    setTopActiveElement(getElementForTrigram(currentUpperTrigram?.name));
    setBottomActiveElement(getElementForTrigram(currentLowerTrigram?.name));
      
  }, [activeHexagram, selectedUpperTrigram, selectedLowerTrigram, mode]);


  const headHexagrams = getSequenceHexagrams('head');
  const gutHexagrams = getSequenceHexagrams('gut');
  const heartHexagrams = getSequenceHexagrams('heart');
  const pulseHexagrams = getSequenceHexagrams('pulse');
  const zodiacHexagrams = getSequenceHexagrams('zodiac');
  const bodyHexagrams = getSequenceHexagrams('body');

  const handleUpperSelect = (trigram: Trigram | null) => {
    if (mode === 'manual') setSelectedUpperTrigram(trigram);
  };
  
  const handleLowerSelect = (trigram: Trigram | null) => {
    if (mode === 'manual') setSelectedLowerTrigram(trigram);
  };

  const handleHexagramClick = (id: number) => {
    if (mode === 'manual') {
      setLastClickedHexagramId(id);
      const hexagram = hexagramMap.get(id);
      if(hexagram) {
          setSelectedUpperTrigram(trigramNameMap.get(hexagram.trigrams.upper) || null);
          setSelectedLowerTrigram(trigramNameMap.get(hexagram.trigrams.lower) || null);
      }
    }
  };


  return (
    <div className="relative w-[56rem] h-[80rem] flex flex-col items-center justify-start font-code">
      {/* Top Center */}
      <div className="relative flex flex-col items-center justify-center -mb-24">
        <span className="text-lg font-bold mb-2">Head</span>
        <div className="relative w-[36rem] h-[36rem]">
          <InteractiveCircularLayout
            label="pulse"
            items={pulseHexagrams}
            radius={16}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            itemSize={2}
            orientation="outward"
            activeHexagramId={diagramActiveHexagramId}
            onHexagramClick={handleHexagramClick}
            lastClickedHexagramId={lastClickedHexagramId}
            secondaryActiveHexagramId={sunHexagramId}
            showSunIcon={true} mode={mode}
            highlightMode={highlightMode}
            autoSequenceName={autoSequenceName} />

          <InteractiveCircularLayout
            label="head"
            items={headHexagrams}
            radius={8}
            itemSize={2}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            startAngle={-165}
            sweepAngle={360}
            activeHexagramId={diagramActiveHexagramId}
            onHexagramClick={handleHexagramClick}
            lastClickedHexagramId={lastClickedHexagramId}
            mode={mode}
            highlightMode={highlightMode}
            autoSequenceName={autoSequenceName}
          />
          <TrigramSelector
            items={innerHeadTrigramSequence}
            radius={4}
            itemSize={1.8}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            orientation="outward"
            selectedTrigram={selectedLowerTrigram}
            onSelectTrigram={handleLowerSelect}
            label="Lower"
          />
        </div>
      </div>

      {/* Bottom Center */}
      <div className="relative flex flex-col items-center justify-center mt-4">
        <div className="relative w-[56rem] h-[56rem]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <OctagonDiagram
                  radius={25}
                  itemSize={1}
                  activeTrigram={selectedUpperTrigram}
                  onTrigramClick={handleUpperSelect}
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <FivePointedStar
                    radius={25}
                    itemSize={3}
                    topActiveElement={topActiveElement}
                    bottomActiveElement={bottomActiveElement}
                    onElementClick={() => {}}
                />
            </div>
            
            <InteractiveCircularLayout
                label="gut"
                items={gutHexagrams}
                radius={20}
                startAngle={90}
                sweepAngle={180}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                itemSize={2}
                orientation="outward"
                activeHexagramId={diagramActiveHexagramId}
                onHexagramClick={handleHexagramClick}
                lastClickedHexagramId={lastClickedHexagramId}
                mode={mode}
                highlightMode={highlightMode}
                autoSequenceName={autoSequenceName} />

            <InteractiveCircularLayout
                label="body"
                items={bodyHexagrams}
                radius={16}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                itemSize={2}
                orientation="outward"
                activeHexagramId={diagramActiveHexagramId}
                onHexagramClick={handleHexagramClick}
                lastClickedHexagramId={lastClickedHexagramId}
                secondaryActiveHexagramId={sunHexagramId}
                showSunIcon={true} mode={mode}
                highlightMode={highlightMode}
                autoSequenceName={autoSequenceName} />

            <InteractiveCircularLayout
                label="heart"
                items={heartHexagrams}
                radius={12}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                itemSize={2}
                orientation="outward"
                activeHexagramId={diagramActiveHexagramId}
                onHexagramClick={handleHexagramClick}
                lastClickedHexagramId={lastClickedHexagramId}
                secondaryActiveHexagramId={sunHexagramId}
                showSunIcon={true} mode={mode}
                highlightMode={highlightMode}
                autoSequenceName={autoSequenceName} />
            
            <InteractiveCircularLayout
                label="zodiac"
                items={zodiacHexagrams}
                radius={8}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                itemSize={2}
                orientation="outward"
                activeHexagramId={diagramActiveHexagramId}
                onHexagramClick={handleHexagramClick}
                lastClickedHexagramId={lastClickedHexagramId}
                mode={mode}
                highlightMode={highlightMode}
                autoSequenceName={autoSequenceName}
            />

            <TrigramSelector
                items={outerHeadTrigramSequence}
                radius={4}
                itemSize={1.8}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                orientation="outward"
                selectedTrigram={selectedUpperTrigram}
                onSelectTrigram={handleUpperSelect}
                label="Upper"
            />
        </div>
      </div>
      
       <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5 -z-10"
        style={{ backgroundImage: "url('/huo-hou-tu.jpeg')" }}
      />
    </div>
      
  );
}
