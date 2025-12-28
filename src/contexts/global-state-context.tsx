
'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { sequences, binaryPulses, hexagrams } from '@/lib/i-ching-data';
import type { Hexagram, Mode, AutoSequenceName, HighlightMode } from '@/lib/types';
import { getSunEclipticLongitude, getHexagramAndLineForLongitude } from '@/lib/rave-wheel-utils';

const allHexagrams = hexagrams;
const hexagramMap = new Map<number, Hexagram>(allHexagrams.map(h => [h.id, h]));

type GlobalState = {
  activeHexagram: Hexagram | null;
  setActiveHexagram: React.Dispatch<React.SetStateAction<Hexagram | null>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  transitionTime: number;
  setTransitionTime: React.Dispatch<React.SetStateAction<number>>;
  autoSequenceName: AutoSequenceName;
  setAutoSequenceName: React.Dispatch<React.SetStateAction<AutoSequenceName>>;
  sunHexagramId: number | null;
  setSunHexagramId: React.Dispatch<React.SetStateAction<number | null>>;
  sunActiveLine: number | null;
  setSunActiveLine: React.Dispatch<React.SetStateAction<number | null>>;
  highlightMode: HighlightMode;
  setHighlightMode: React.Dispatch<React.SetStateAction<HighlightMode>>;
};


const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [activeHexagram, setActiveHexagram] = useState<Hexagram | null>(allHexagrams[0]);
  const [mode, setMode] = useState<Mode>('manual');
  const [transitionTime, setTransitionTime] = useState(2000);
  const [autoSequenceName, setAutoSequenceName] = useState<AutoSequenceName>('binaryPulses');
  const [sunHexagramId, setSunHexagramId] = useState<number | null>(null);
  const [sunActiveLine, setSunActiveLine] = useState<number | null>(null);
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('single');

  const updateHighlights = useCallback(() => {
    const now = new Date();
    const sunLongitude = getSunEclipticLongitude(now);
    const { hexagram, line } = getHexagramAndLineForLongitude(sunLongitude);
    
    if (hexagram) {
      setSunHexagramId(hexagram.id);
      setSunActiveLine(line);
    } else {
      setSunHexagramId(null);
      setSunActiveLine(null);
    }
  }, []);

  useEffect(() => {
    updateHighlights();
    const highlightInterval = setInterval(updateHighlights, 60000); 
    return () => clearInterval(highlightInterval);
  }, [updateHighlights]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const cleanup = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    if (mode === 'automatic') {
      let autoIndex = 0;
      const sequenceToUse = autoSequenceName === 'binaryPulses' ? binaryPulses : sequences.find(s => s.key === 'body')?.hexagramIds || binaryPulses;
       intervalId = setInterval(() => {
        const hexagramId = sequenceToUse[autoIndex];
        const hexagram = hexagramMap.get(hexagramId);
        if (hexagram) {
          setActiveHexagram(hexagram);
        }
        autoIndex = (autoIndex + 1) % sequenceToUse.length;
       }, transitionTime);
    }

    return cleanup;
  }, [mode, transitionTime, autoSequenceName]);

  const value: GlobalState = {
    activeHexagram, setActiveHexagram,
    mode, setMode,
    transitionTime, setTransitionTime,
    autoSequenceName, setAutoSequenceName,
    sunHexagramId, setSunHexagramId,
    sunActiveLine, setSunActiveLine,
    highlightMode, setHighlightMode,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobal(): GlobalState {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalStateProvider');
  }
  return context;
}
