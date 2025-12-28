
'use client';
// NOTE: Function param names in the AgentState interface are documentation-only and
// used by the implementation below; suppress unused var warnings locally.

import { create } from 'zustand';
import type { Trigram } from '@/lib/types';
import { createHexGrid, Cube, cubeAdd, cubeDirections } from '@/lib/grid-utils';
import { trigrams as allTrigrams } from '@/lib/i-ching-data';
import { type Environment } from '@/lib/environments';
import { type ObjectData } from '@/lib/objects';
import { type TrainingToolData } from '@/lib/training-tools';
import { type FurnitureData } from '@/lib/furniture';
import { type KungFuWeaponData } from '@/lib/kung-fu-weapons';
import { type StructureData } from '@/lib/structures';
import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { getDocWithRetry } from '@/lib/firestore-utils';
import type { User } from 'firebase/auth';

export type BackgroundView = '2d' | '3d' | '4d';

type AgentCube = {
  q: number;
  r: number;
};

export type TrigramHex = {
  trigram: Trigram;
  hex: AgentCube;
}

type SpiralMapData = {
    [index: number]: {
        gate: number;
        source?: 'aspect' | 'intermediate';
    }
}

// Store state & actions
// Converted to interface with method signatures to avoid overzealous unused var linting on function type properties.
interface AgentState {
  position: { x: number; y: number };
  isCasting: boolean;
  isEntered: boolean;
  isPlayerMode: boolean;
  isAutoMode: boolean;
  isFalling: boolean;
  isRespawning: boolean;
  clickCount: number;
  actorHex: AgentCube;
  highlightedHexes: AgentCube[];
  movementQueue: { directionIndex: number }[];
  isProcessingMoves: boolean;
  currentHexagram: { name: string; symbol: string } | null;
  nextHexagram: { name: string; symbol: string } | null;
  trigramHexes: TrigramHex[];
  selectedHex: AgentCube | null;
  placedEnvironments: { [key: string]: Environment };
  placedObjects: { [key: string]: ObjectData | TrainingToolData | KungFuWeaponData };
  placedFurniture: { [key: string]: FurnitureData };
  placedStructures: { [key: string]: StructureData };
  spiralMapData: SpiralMapData;
  qi: number;
  jing: number;
  consultingInterval: number;
  aspectGateVisitedInInterval: boolean;
  visitedAspectGates: Set<number>;
  gameStartedAt: number | null;
  backgroundView: BackgroundView;
  listeningUserChoice: boolean;
  selectedCircle: number | null;
  hasLoadedInitialData: boolean;
  setPosition(newPosition: { x: number; y: number }): void;
  setIsCasting(casting: boolean): void;
  setIsEntered(isEntered: boolean): void;
  setIsPlayerMode(isPlayerMode: boolean): void;
  toggleAutoMode: () => void; // used inline
  setClickCount(count: number): void;
  setActorHex(hex: AgentCube): void;
  setHighlightedHexes(hexes: AgentCube[]): void;
  setMovementQueue(queue: { directionIndex: number }[]): void;
  processNextMove: () => void;
  processAllMoves: () => void;
  handleEndOfReading: () => void;
  decreaseJing: () => void;
  chargeQi: () => void;
  setCurrentHexagram(hexagram: { name: string; symbol: string } | null): void;
  setNextHexagram(hexagram: { name: string; symbol: string } | null): void;
  setTrigramHexes(trigramHexes: TrigramHex[]): void;
  castTrigrams: () => void;
  setSelectedHex(hex: AgentCube | null): void;
  placeEnvironment(hex: AgentCube, environment: Environment): void;
  placeObject(hex: AgentCube, object: ObjectData | TrainingToolData | KungFuWeaponData): void;
  placeFurniture(hex: AgentCube, furniture: FurnitureData): void;
  placeStructure(hex: AgentCube, structure: StructureData): void;
  loadSpiralMapData(db: Firestore, user: User): Promise<void>;
  resetCastingState: () => void;
  updateShenOnClick(db: Firestore, user: User | null): void;
  startGameClock(db: Firestore, user: User | null): Promise<void>;
  loadGameClock(db: Firestore, user: User): Promise<void>;
  setBackgroundView(view: BackgroundView): void;
  setListeningUserChoice(isListening: boolean): void;
  setSelectedCircle(index: number | null): void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  position: { x: 0, y: 0 },
  isCasting: false,
  isEntered: false,
  isPlayerMode: false,
  isAutoMode: false,
  isFalling: false,
  isRespawning: false,
  clickCount: 0,
  actorHex: { q: 0, r: 0 },
  highlightedHexes: [],
  movementQueue: [],
  isProcessingMoves: false,
  currentHexagram: null,
  nextHexagram: null,
  trigramHexes: [],
  selectedHex: null,
  placedEnvironments: {},
  placedObjects: {},
  placedFurniture: {},
  placedStructures: {},
  spiralMapData: {},
  qi: 3,
  jing: 3,
  consultingInterval: 6,
  aspectGateVisitedInInterval: false,
  visitedAspectGates: new Set(),
  gameStartedAt: null,
  backgroundView: '2d',
  listeningUserChoice: false,
  selectedCircle: null,
  hasLoadedInitialData: false,
  setPosition: (newPosition) => set({ position: newPosition }),
  setIsCasting: (casting) => set({ isCasting: casting }),
  setIsEntered: (isEntered) => set({ isEntered: isEntered }),
  setIsPlayerMode: (isPlayerMode) => set({ isPlayerMode: isPlayerMode }),
  toggleAutoMode: () => set((state) => ({ isAutoMode: !state.isAutoMode, isEntered: !state.isAutoMode ? state.isEntered : true })),
  setClickCount: (count) => set({ clickCount: count }),
  setActorHex: (hex) => set({ actorHex: hex }),
  setHighlightedHexes: (hexes) => set({ highlightedHexes: hexes }),
  setMovementQueue: (queue) => {
    set({ movementQueue: queue, aspectGateVisitedInInterval: false });
  },
  processNextMove: () => {
    const { movementQueue, actorHex, spiralMapData, visitedAspectGates } = get();
    if (movementQueue.length === 0) return;

    const nextMove = movementQueue[0];
    
    const direction = cubeDirections[nextMove.directionIndex];
    if (!direction) return;

    const newActorHex = cubeAdd(new Cube(actorHex.q, actorHex.r, -actorHex.q - actorHex.r), direction);
    
    const grid = createHexGrid(5);
    const movedToHex = grid.find(h => h.q === newActorHex.q && h.r === newActorHex.r);

    if (!movedToHex) {
        // Player moved off the grid
        get().decreaseJing();
        set({ isFalling: true });
        setTimeout(() => {
            set({ 
                isFalling: false, 
                actorHex: { q: 0, r: 0 },
                isRespawning: true,
                movementQueue: [] 
            });
            setTimeout(() => set({ isRespawning: false }), 500); // Respawn animation
        }, 500); // Falling animation
        get().handleEndOfReading(); // Process end of turn penalties/rewards
        return;
    }

    let wasAspectGateVisited = get().aspectGateVisitedInInterval;
    const spiralData = movedToHex?.index !== undefined ? spiralMapData[movedToHex.index] : undefined;
    if (spiralData?.source === 'aspect') {
      wasAspectGateVisited = true;
      const newVisitedGates = new Set(visitedAspectGates);
      newVisitedGates.add(spiralData.gate);
      set({ visitedAspectGates: newVisitedGates });
    }

    // New logic to update highlighted hexes
    const newQueue = movementQueue.slice(1);
    const newHighlightedHexes: AgentCube[] = [];
    let currentPathPos = new Cube(newActorHex.q, newActorHex.r, -newActorHex.q - newActorHex.r);
    newQueue.forEach(move => {
        const dir = cubeDirections[move.directionIndex];
        if (dir) {
            const nextStep = cubeAdd(currentPathPos, dir);
            newHighlightedHexes.push({ q: nextStep.q, r: nextStep.r });
            currentPathPos = nextStep;
        }
    });

    set({
      actorHex: { q: newActorHex.q, r: newActorHex.r },
      movementQueue: newQueue,
      highlightedHexes: newHighlightedHexes,
      aspectGateVisitedInInterval: wasAspectGateVisited,
    });

    if (newQueue.length === 0) {
      get().handleEndOfReading();
    }
  },
  processAllMoves: () => {
    const { movementQueue, processNextMove } = get();
    if (movementQueue.length === 0 || get().isProcessingMoves) return;
  
    set({ isProcessingMoves: true });
  
    const processQueue = () => {
      if (get().movementQueue.length > 0) {
        processNextMove();
        setTimeout(processQueue, 500); // 500ms delay between moves
      } else {
        set({ isProcessingMoves: false });
      }
    };
  
    processQueue();
  },
  handleEndOfReading: () => {
    const { isAutoMode, aspectGateVisitedInInterval, qi, consultingInterval, actorHex, spiralMapData, visitedAspectGates } = get();
    
    const wasAspectGate = aspectGateVisitedInInterval;
    
    if (wasAspectGate) {
      set({ 
        qi: Math.min(3, qi + 1),
        selectedHex: actorHex,
      });
    } else {
      const newInterval = consultingInterval - 1;
      if (newInterval <= 0) {
        const newQi = Math.max(0, qi - 1);
        set({ qi: newQi, consultingInterval: 6 });
        if (newQi === 0) {
          get().decreaseJing();
        }
      } else {
        set({ consultingInterval: newInterval });
      }
    }

    // Check if all aspect gates have been visited
    const allAspectGates = new Set(Object.values(spiralMapData).filter(d => d.source === 'aspect').map(d => d.gate));
    if (allAspectGates.size > 0 && Array.from(allAspectGates).every(gate => visitedAspectGates.has(gate))) {
        set(state => ({
            jing: Math.min(3, state.jing + 1),
            visitedAspectGates: new Set(), // Reset for the next full cycle
        }));
    }

    if (isAutoMode) {
      if (wasAspectGate) {
        setTimeout(() => {
          set({ selectedHex: null });
          get().resetCastingState();
        }, 4000);
      } else {
        get().resetCastingState();
      }
    }
  },
  decreaseJing: () => {
    set(state => ({ jing: Math.max(0, state.jing - 1) }));
  },
  chargeQi: () => {
    set(state => ({ qi: Math.min(3, state.qi + 1) }));
  },
  setCurrentHexagram: (hexagram) => set({ currentHexagram: hexagram }),
  setNextHexagram: (hexagram) => set({ nextHexagram: hexagram }),
  setTrigramHexes: (trigramHexes) => set({ trigramHexes }),
  castTrigrams: () => {
    const grid = createHexGrid(5);
    const newTrigramHexes: TrigramHex[] = [];
    const availableHexes = grid.filter(h => h.q !== 0 || h.r !== 0); // Exclude center
    const trigramList = allTrigrams;
    
    for (let i = 0; i < 8; i++) {
      if (availableHexes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableHexes.length);
        const hex = availableHexes.splice(randomIndex, 1)[0];
        newTrigramHexes.push({ trigram: trigramList[i], hex: { q: hex.q, r: hex.r } });
      }
    }
    set({ trigramHexes: newTrigramHexes });
  },
  setSelectedHex: (hex) => set({ selectedHex: hex }),
  placeEnvironment: (hex, environment) => {
    const key = `${hex.q},${hex.r}`;
    set((state) => {
        const newPlacedEnvironments = { ...state.placedEnvironments, [key]: environment };
        const newPlacedObjects = { ...state.placedObjects };
        const newPlacedFurniture = { ...state.placedFurniture };
        const newPlacedStructures = { ...state.placedStructures };

        delete newPlacedObjects[key];
        delete newPlacedFurniture[key];
        delete newPlacedStructures[key];

        return {
            placedEnvironments: newPlacedEnvironments,
            placedObjects: newPlacedObjects,
            placedFurniture: newPlacedFurniture,
            placedStructures: newPlacedStructures,
        };
    });
  },
  placeObject: (hex, object) => {
    const key = `${hex.q},${hex.r}`;
    set((state) => {
        const newPlacedObjects = { ...state.placedObjects, [key]: object };
        const newPlacedEnvironments = { ...state.placedEnvironments };
        const newPlacedFurniture = { ...state.placedFurniture };
        const newPlacedStructures = { ...state.placedStructures };
        
        delete newPlacedEnvironments[key];
        delete newPlacedFurniture[key];
        delete newPlacedStructures[key];

        return {
            placedObjects: newPlacedObjects,
            placedEnvironments: newPlacedEnvironments,
            placedFurniture: newPlacedFurniture,
            placedStructures: newPlacedStructures,
        };
    });
  },
  placeFurniture: (hex, furniture) => {
    const key = `${hex.q},${hex.r}`;
    set((state) => {
        const newPlacedFurniture = { ...state.placedFurniture, [key]: furniture };
        const newPlacedEnvironments = { ...state.placedEnvironments };
        const newPlacedObjects = { ...state.placedObjects };
        const newPlacedStructures = { ...state.placedStructures };

        delete newPlacedEnvironments[key];
        delete newPlacedObjects[key];
        delete newPlacedStructures[key];
        
        return {
            placedFurniture: newPlacedFurniture,
            placedEnvironments: newPlacedEnvironments,
            placedObjects: newPlacedObjects,
            placedStructures: newPlacedStructures,
        };
    });
  },
  placeStructure: (hex, structure) => {
    const key = `${hex.q},${hex.r}`;
    set((state) => {
        const newPlacedStructures = { ...state.placedStructures, [key]: structure };
        const newPlacedEnvironments = { ...state.placedEnvironments };
        const newPlacedObjects = { ...state.placedObjects };
        const newPlacedFurniture = { ...state.placedFurniture };

        delete newPlacedEnvironments[key];
        delete newPlacedObjects[key];
        delete newPlacedFurniture[key];

        return {
            placedStructures: newPlacedStructures,
            placedEnvironments: newPlacedEnvironments,
            placedObjects: newPlacedObjects,
            placedFurniture: newPlacedFurniture,
        };
    });
  },
  loadSpiralMapData: async (db: Firestore, user: User) => {
    if (!user || get().hasLoadedInitialData) {
      return;
    }
    set({ hasLoadedInitialData: true });

    try {
      const profileRef = doc(db, 'users', user.uid, 'profiles', 'm3_profile1');
  const docSnap = await getDocWithRetry(profileRef, { retries: 2 });

      if (!docSnap.exists()) {
        console.warn("Profile 'm3_profile1' not found. Grid will be unpopulated.");
        set({ spiralMapData: {} });
        return;
      }

      const data = docSnap.data();
      let spiralMap: any[] | undefined;

      if (data.activated_body_json) {
          try {
              const parsedBody = JSON.parse(data.activated_body_json);
              const profileData = parsedBody.activated_body_profile1 || parsedBody.activated_body || parsedBody;
              spiralMap = profileData?.hex_spiral_map;
          } catch (e) {
              console.error("Failed to parse profile data.", e);
              throw new Error("Failed to parse profile data.");
          }
      }

      if (!spiralMap || !Array.isArray(spiralMap)) {
        console.warn("'hex_spiral_map' not found in profile 'm3_profile1'. Grid will be unpopulated.");
        set({ spiralMapData: {} });
        return;
      }
      
      const newSpiralMapData: SpiralMapData = {};
      spiralMap.forEach(item => {
          if (typeof item.index === 'number' && typeof item.gate === 'number') {
              newSpiralMapData[item.index] = { 
                  gate: item.gate,
                  source: item.source,
              };
          }
      });

      set({ spiralMapData: newSpiralMapData });

    } catch (error) {
       console.error("Error loading spiral map data from Firestore:", error);
       // We don't rethrow here to avoid crashing the app on a non-critical data load failure.
    }
  },
  resetCastingState: () => set({
    isCasting: false,
    isEntered: false,
    clickCount: 0,
    highlightedHexes: [],
    movementQueue: [],
    currentHexagram: null,
    nextHexagram: null,
    listeningUserChoice: false,
    selectedCircle: null,
  }),
  updateShenOnClick: (db: Firestore, user: User | null) => {
     get().startGameClock(db, user);
  },
  startGameClock: async (db: Firestore, user: User | null) => {
    const newStartTime = Date.now();
    set({ gameStartedAt: newStartTime });
    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { gameStartedAt: newStartTime });
      } catch (error) {
        console.error("Failed to save game start time to Firestore:", error);
      }
    }
  },
  loadGameClock: async (db: Firestore, user: User) => {
    if (!user || !db) return;
    try {
        const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDocWithRetry(userRef, { retries: 2 });
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.gameStartedAt) {
                set({ gameStartedAt: data.gameStartedAt });
            }
        }
    } catch (error) {
        console.error("Failed to load game start time from Firestore:", error);
    }
  },
  setBackgroundView: (view: BackgroundView) => set({ backgroundView: view }),
  setListeningUserChoice: (isListening: boolean) => set({ listeningUserChoice: isListening }),
  setSelectedCircle: (index: number | null) => set({ selectedCircle: index }),
}));
