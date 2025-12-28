
"use client";

import React, { useState, useEffect, useRef, type CSSProperties } from "react";
import type p5 from 'p5';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, X, MessageSquare, Rocket, MoveRight, Play } from "lucide-react";
import { generateReading } from "@/lib/i-ching";
import { interpretIChingReading } from "@/ai/flows/i-ching-interpreter";
import type { InterpretIChingReadingOutput } from "@/ai/flows/i-ching-interpreter";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAgentStore } from "@/hooks/use-agent-store";
import { trigrams } from '@/lib/i-ching-data';
import type { Trigram } from '@/lib/types';
import { structures, type StructureData } from '@/lib/structures';
import { cubeDirections, cubeToPixel, Cube, cubeAdd } from "@/lib/grid-utils";
import { useAuth, useFirestore } from '@/firebase/client-provider';
import { useUser } from '@/lib/auth';
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

type Reading = ReturnType<typeof generateReading>;

const AGENT_SIZE = 60;
const CASTING_RADIUS = 70;
const NUM_CIRCLES = 6;
const POINTER_OFFSET = 60;
const NEAR_THRESHOLD = 70;

const castingSequence = [0, 1, 2, 3, 4, 5];

export function FloatingAgent() {
  const [isClient, setIsClient] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isNear, setIsNear] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretIChingReadingOutput['interpretation'] | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const { 
      setPosition: setAgentPosition, 
      isCasting, setIsCasting, 
      clickCount, setClickCount, 
      actorHex, 
      setHighlightedHexes, 
      isEntered, setIsEntered, 
      isPlayerMode,
      isAutoMode,
      toggleAutoMode,
      placeStructure, 
      resetCastingState: resetAgentStoreState,
      movementQueue,
      setMovementQueue,
      processNextMove,
      processAllMoves,
      isProcessingMoves,
      updateShenOnClick,
      loadGameClock,
      isFalling,
      isRespawning,
      setSelectedHex,
      listeningUserChoice,
      setListeningUserChoice,
      selectedCircle,
      setSelectedCircle,
      loadSpiralMapData,
  } = useAgentStore();

  const idleTimeoutRef = useRef<NodeJS.Timeout>();
  const longPressTimeoutRef = useRef<NodeJS.Timeout>();
  const agentRef = useRef<HTMLDivElement>(null);
  const readingDialogRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const user = useUser(auth);

  useOnClickOutside(readingDialogRef, () => {
    if (reading) {
      resetCastingState();
    }
  });

  useEffect(() => {
    if (user && db) {
        loadGameClock(db, user);
        loadSpiralMapData(db, user);
    }
  }, [user, db, loadGameClock, loadSpiralMapData]);

  const getHomePosition = () => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    // The menu is 1rem (16px) from the top and right edges.
    // The oracle button is 48x48px (h-12 w-12)
    // The agent is 60x60px
    const menuPadding = 4; // p-1 on the menu container
    const buttonSize = 48;
    const gap = 8; // gap-2 between buttons
    const agentSize = AGENT_SIZE;
    const rightOffset = 16 + menuPadding + (buttonSize / 2) - (agentSize / 2);
    
    return {
      x: window.innerWidth - rightOffset - agentSize,
      y: 16 + menuPadding + (buttonSize / 2) - (agentSize / 2),
    };
  };

  const getCenterPosition = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: (window.innerWidth - AGENT_SIZE) / 2,
      y: (window.innerHeight - AGENT_SIZE) / 2,
    };
  };


  useEffect(() => {
    setIsClient(true);
    const homePos = getHomePosition();
    setPosition(homePos);
    setAgentPosition(homePos);

    const getP5 = async () => {
        const p5 = (await import('p5')).default;
        if (!p5InstanceRef.current) {
            p5InstanceRef.current = new p5(() => {});
            p5InstanceRef.current.remove(); 
        }
    }
    getP5();
  }, [setAgentPosition]);

  const resetCastingState = () => {
    resetAgentStoreState();
    setInterpretation(null);
    setReading(null);
    setIsLoadingAi(false);
    setShowMission(false);
    setShowInterpretation(false);
    setMovementQueue([]);
  };
  
  const handleCastingClick = async () => {
    if (isLoadingAi || reading) return;

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount === 6) {
      try {
        const generatedReading = generateReading();

        if (generatedReading.earthly.id === generatedReading.heavenly.id) {
            setSelectedHex(actorHex);
            resetCastingState();
        } else {
            setReading(generatedReading);
            setMovementQueue(generatedReading.movementQueue);
            setListeningUserChoice(true); // Enter listening state right after reading is generated

            const highlightCubes = generatedReading.movementQueue.map(move => {
              let currentPos = new Cube(actorHex.q, actorHex.r, -actorHex.q - actorHex.r);
              generatedReading.movementQueue.slice(0, generatedReading.movementQueue.indexOf(move) + 1).forEach(m => {
                  currentPos = cubeAdd(currentPos, cubeDirections[m.directionIndex]);
              });
              return { q: currentPos.q, r: currentPos.r };
            });
            setHighlightedHexes(highlightCubes);
        }

      } catch (error) {
        console.error("Error generating reading:", error);
        toast({
          variant: "destructive",
          title: "Casting Error",
          description: "Could not generate a reading at this time. Please try again.",
        });
        resetCastingState();
      }
    }
  };


  const handlePointerDown = () => {
    longPressTimeoutRef.current = setTimeout(() => {
        resetCastingState();
    }, 500);
  };

  const handlePointerUp = () => {
    clearTimeout(longPressTimeoutRef.current);
  };

  const handleClick = () => {
    if (isCasting) {
      handleCastingClick();
    } else {
      if (db) {
        updateShenOnClick(db, user);
      }
      if (!isEntered) {
          setIsEntered(true);
      }
    }
  };

  const handleCircleClick = (index: number) => {
    if (listeningUserChoice) {
      setSelectedCircle(index);
      setListeningUserChoice(false);
    }
  };

  useEffect(() => {
    if (isEntered) {
      const timer = setTimeout(() => {
        setIsCasting(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsCasting(false);
    }
  }, [isEntered, setIsCasting]);

  const getInterpretation = async () => {
    if (!reading || interpretation) {
        setShowInterpretation(true);
        return;
    }; 
    
    setIsLoadingAi(true);
    setShowInterpretation(true);

    try {
        if (!reading.earthly || !reading.heavenly) {
          throw new Error("Reading data is incomplete.");
        }
        
    const result = await interpretIChingReading({
            earthlyHexagramName: reading.earthly.name,
            heavenlyHexagramName: reading.heavenly.name,
            changingLines: reading.changingLines
        });
        setInterpretation(result.interpretation);

    } catch (error) {
        console.error("Error interpreting I Ching reading:", error);
        toast({
          variant: "destructive",
          title: "Oracle is Silent",
          description: "Could not get an interpretation at this time. Please try again.",
        });
        setShowInterpretation(false);
    } finally {
        setIsLoadingAi(false);
    }
  }

  const handleToggleInterpretation = () => {
    if (!showInterpretation) {
        getInterpretation();
    } else {
        setShowInterpretation(false);
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isCasting || isEntered || isPlayerMode) return;

    const agentRect = agentRef.current?.getBoundingClientRect();
    if (!agentRect) return;

    const distance = Math.sqrt(
      Math.pow(e.clientX - (agentRect.left + agentRect.width / 2), 2) +
      Math.pow(e.clientY - (agentRect.top + agentRect.height / 2), 2)
    );

    const newPos = {
      x: e.clientX - AGENT_SIZE / 2 + POINTER_OFFSET,
      y: e.clientY - AGENT_SIZE / 2 + POINTER_OFFSET
    };

    if (distance < NEAR_THRESHOLD) {
      setIsNear(true);
    } else {
      setIsNear(false);
      setIsIdle(false);
      setPosition(newPos);
      setAgentPosition(newPos);
    }

    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      setIsNear(false);
    }, 4000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCasting, isEntered, isPlayerMode]);


  useEffect(() => {
    const handleResize = () => {
      const homePos = getHomePosition();
      if (isIdle) {
        setPosition(homePos);
        setAgentPosition(homePos);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isIdle, setAgentPosition]);


  useEffect(() => {
    const agentPosition = isIdle ? getHomePosition() : position;
    if (isIdle && (position.x !== agentPosition.x || position.y !== agentPosition.y)) {
      setPosition(agentPosition);
      setAgentPosition(agentPosition);
    }
  }, [isIdle, position, setAgentPosition]);

  // Automated 12-second cycle
  useEffect(() => {
    if (!isAutoMode) return;

    // Phase 1: Casting (4 seconds)
    if (isCasting && clickCount < 6) {
      const castInterval = setInterval(() => {
        handleCastingClick();
      }, 4000 / 6); // ~667ms per click
      return () => clearInterval(castInterval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoMode, isCasting, clickCount]);

  useEffect(() => {
    if (!isAutoMode) return;
    
    // Phase 2: Pop-up display and user choice (4 seconds)
    if (reading && listeningUserChoice) {
      const choiceTimeout = setTimeout(() => {
        // If still listening after 4s, proceed automatically
        if (useAgentStore.getState().listeningUserChoice) {
          setListeningUserChoice(false);
        }
      }, 4000);
      return () => clearTimeout(choiceTimeout);
    }
  }, [isAutoMode, reading, listeningUserChoice, setListeningUserChoice]);

  useEffect(() => {
    if (!isAutoMode) return;

    // Phase 3: Movement (4 seconds)
    if (reading && !listeningUserChoice && !isProcessingMoves) {
      const moveTimeout = setTimeout(() => {
        processAllMoves();
      }, 4000); 
      return () => clearTimeout(moveTimeout);
    }
  }, [isAutoMode, reading, listeningUserChoice, isProcessingMoves, processAllMoves]);

  useEffect(() => {
    if (!isAutoMode) return;

    // Phase 4: Reset
    // This triggers after movement is done.
    if (!isCasting && !reading && movementQueue.length === 0 && !isProcessingMoves) {
       const resetTimeout = setTimeout(() => {
         if (isAutoMode) {
            resetCastingState();
            setIsEntered(true); // Trigger next cycle
         }
       }, 100); // A small delay to ensure state updates
       return () => clearTimeout(resetTimeout);
    }
  }, [isAutoMode, isCasting, reading, movementQueue, isProcessingMoves, resetCastingState, setIsEntered]);


  let displayPosition = isIdle ? getHomePosition() : position;

  if (isPlayerMode) {
    if(p5InstanceRef.current) {
        const actorCube = new Cube(actorHex.q, actorHex.r, -actorHex.q - actorHex.r);
        const pixel = cubeToPixel(actorCube, 40, p5InstanceRef.current);
        displayPosition = {
            x: window.innerWidth / 2 + pixel.x - AGENT_SIZE / 2,
            y: window.innerHeight / 2 + pixel.y - AGENT_SIZE / 2
        };
    } else {
        displayPosition = getCenterPosition();
    }
  } else if (isEntered || isCasting || listeningUserChoice) {
      displayPosition = getCenterPosition();
  }

  const isUiOpen = isCasting || isEntered || listeningUserChoice;

  if (!isClient) return null;

  const missionTrigram: Trigram | undefined = reading?.heavenly?.upperTrigram || reading?.heavenly?.lowerTrigram;
  const filledIndices = new Set(castingSequence.slice(0, clickCount));
  
  const visualPositions = [
    { angle: -Math.PI / 2, index: 5 }, // N (Line 6)
    { angle: -Math.PI / 2 - Math.PI / 3, index: 3 }, // NW (Line 5)
    { angle: -Math.PI / 2 + Math.PI / 3, index: 4 }, // NE (Line 4)
    { angle: Math.PI / 2 - Math.PI / 3, index: 2 }, // SW (Line 3)
    { angle: Math.PI / 2 + Math.PI / 3, index: 1 }, // SE (Line 2)
    { angle: Math.PI / 2, index: 0 }, // S (Line 1)
  ];
  
  const agentVariants = {
    initial: { scale: 1 },
    falling: { scale: 0, transition: { duration: 0.5, ease: "easeIn" } },
    respawning: { scale: [1.5, 1], transition: { duration: 0.5, ease: "easeOut" } },
  };

  const getAgentVariant = () => {
    if (isFalling) return "falling";
    if (isRespawning) return "respawning";
    return "initial";
  }


  return (
    <TooltipProvider>
      <motion.div
        ref={agentRef}
        className="fixed top-0 left-0 z-50"
        animate={{
            x: displayPosition.x,
            y: displayPosition.y,
            width: isUiOpen && !isPlayerMode ? AGENT_SIZE * 2 : AGENT_SIZE,
            height: isUiOpen && !isPlayerMode ? AGENT_SIZE * 2 : AGENT_SIZE
        }}
        transition={
            (isEntered || isCasting) && !isPlayerMode ? { type: 'spring', stiffness: 260, damping: 20 } :
            isPlayerMode ? { type: 'spring', stiffness: 260, damping: 20 } : 
            !isUiOpen && (isIdle || isNear) ? { type: 'spring', stiffness: 100, damping: 15 } : { type: 'linear', duration: 0.1 }}
      >
        <AnimatePresence>
          {(isCasting || listeningUserChoice) && (
            <motion.div>
              {visualPositions.map((pos) => {
                const currentAgentSize = (isUiOpen && !isPlayerMode) ? AGENT_SIZE * 2 : AGENT_SIZE;
                const currentRadius = (isUiOpen && !isPlayerMode) ? CASTING_RADIUS * 1.5 : CASTING_RADIUS;

                const x = Math.cos(pos.angle) * currentRadius;
                const y = Math.sin(pos.angle) * currentRadius;

                const isFilled = filledIndices.has(pos.index);
                const isSelected = selectedCircle === pos.index;

                return (
                  <motion.div
                    key={pos.index}
                    className="absolute cursor-pointer"
                    style={{ top: (currentAgentSize / 2) - 12, left: (currentAgentSize / 2) - 12 }}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ x, y, opacity: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0 }}
                    transition={{ duration: 0.2, delay: pos.index * 0.05 }}
                    onClick={() => handleCircleClick(pos.index)}
                  >
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 transition-colors duration-300", 
                        isSelected ? "bg-accent border-accent/80" : 
                        isFilled ? "bg-primary border-primary/80" : "bg-background border-border",
                        listeningUserChoice && "hover:border-accent hover:bg-accent/20"
                    )} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          disabled={isLoadingAi || listeningUserChoice}
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center text-primary bg-background shadow-2xl shadow-primary/20 border-2 border-primary/50",
            "[--yin-yang-bg:hsl(var(--background))]",
            "disabled:cursor-not-allowed"
          )}
          whileHover={!isUiOpen ? { scale: 1.1 } : {}}
          whileTap={!isUiOpen ? { scale: 0.9 } : {}}
          variants={agentVariants}
          animate={getAgentVariant()}
        >
          <Icons.YinYang className="w-full h-full p-2 transition-transform duration-500" />
        </motion.button>
      </motion.div>
      
      <AnimatePresence>
            {reading && (
                 <motion.div
                    ref={readingDialogRef}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-24 right-4 w-[32rem] z-50"
                 >
                    <div className="relative rounded-lg border bg-background p-4 shadow-xl text-sm">
                        
                        <div className="space-y-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={showMission ? 'mission' : 'reading'}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {showMission && missionTrigram ? (
                                        <div className="space-y-2 text-center">
                                            <h3 className="font-bold text-primary text-lg">Your Mission: Mock Action</h3>
                                            <p className="text-muted-foreground">This is a placeholder for a mission description.</p>
                                        </div>
                                    ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="font-bold text-primary">Earthly Hexagram ({reading.earthly.lowerTrigram?.symbol}) to ({reading.earthly.upperTrigram?.symbol})</p>
                                            <p className="text-xs text-muted-foreground">{reading.earthly.name} ({reading.earthly.number})</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Heavenly Hexagram ({reading.heavenly.lowerTrigram?.symbol}) to ({reading.heavenly.upperTrigram?.symbol})</p>
                                            <p className="text-xs text-muted-foreground">{reading.heavenly.name} ({reading.heavenly.number})</p>
                                        </div>
                                        </div>
                                        {showInterpretation && reading.changingLines.length > 0 && (
                                        <div>
                                            <p className="font-bold text-center text-primary">Path of Change</p>
                                            <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                                            {reading.changingLines.map((line, i) => <li key={i}>{line}</li>)}
                                            </ul>
                                        </div>
                                        )}
                                        {showInterpretation && (
                                            isLoadingAi ? (
                                                <div className="flex items-center justify-center gap-2 text-muted-foreground pt-2 border-t mt-3">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>The oracle contemplates...</span>
                                                </div>
                                            ) : interpretation ? (
                                                <p className="text-foreground pt-2 border-t border-border">{interpretation}</p>
                                            ) : null
                                        )}
                                        
                                        {reading.changingLineCorrespondence && (
                                            <p className="text-primary font-semibold italic text-center pt-2 border-t border-border/50">
                                                "{reading.changingLineCorrespondence}"
                                            </p>
                                        )}
                                    </>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex gap-2 pt-2 border-t">
                                {movementQueue.length > 0 && (
                                    <Button size="sm" className="w-full" onClick={processAllMoves} disabled={isProcessingMoves}>
                                        {isProcessingMoves ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                        Execute Journey
                                    </Button>
                                )}
                                <Button size="sm" className="w-full" onClick={handleToggleInterpretation}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {showInterpretation ? 'Hide' : 'Show'} Interpretation
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </TooltipProvider>
  );
}
