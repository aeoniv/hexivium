
"use client";

import { useEffect } from "react";
import { P5Canvas } from "@/components/p5-canvas";
import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/hooks/use-agent-store";
import { Wand2, UserCheck, BotMessageSquare } from "lucide-react";
import { PlacementSelector } from "@/components/placement-selector";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { GameStatusMatrix } from "@/components/game-status-matrix";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function IChingPage() {
    const {
        castTrigrams,
        trigramHexes,
        setIsPlayerMode,
        resetCastingState,
        loadSpiralMapData,
        isAutoMode,
        toggleAutoMode,
        hasLoadedInitialData
    } = useAgentStore();
    const { toast } = useToast();
    const auth = useAuth();
    const db = useFirestore();
    const user = useUser(auth);

    useEffect(() => {
        setIsPlayerMode(true);
        // When unmounting, reset agent state
        return () => {
            resetCastingState();
            setIsPlayerMode(false);
        };
    }, [setIsPlayerMode, resetCastingState]);

    useEffect(() => {
        if (user && db && !hasLoadedInitialData) {
            loadSpiralMapData(db, user).catch(error => {
                toast({
                    variant: "destructive",
                    title: "Failed to Load Profile",
                    description: error?.message || "Could not load the profile data from Firestore.",
                });
            });
        }
    }, [user, db, loadSpiralMapData, hasLoadedInitialData, toast]);


    const handleLoadProfile = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to load a profile.",
            });
            return;
        }
        try {
            await loadSpiralMapData(db, user);
            toast({
                title: "Profile Loaded",
                description: "Gate data from your 'm3_profile1' has been loaded onto the grid.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to Load Profile",
                description: error?.message || "Could not load the profile data from Firestore.",
            });
        }
    };

    return (
        <div className="w-screen h-screen relative">
            <P5Canvas />
            <div className="absolute top-4 left-4 z-10">
                <GameStatusMatrix />
            </div>
            <PlacementSelector />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
                {trigramHexes.length === 0 && (
                    <Button onClick={castTrigrams} size="lg">
                        <Wand2 className="mr-2 h-5 w-5" />
                        Cast Trigrams
                    </Button>
                )}
                <Button onClick={handleLoadProfile} size="lg" variant="secondary" disabled={!user}>
                    <UserCheck className="mr-2 h-5 w-5" />
                    Load Profile Gates
                </Button>
            </div>
            <div className="absolute bottom-8 right-8 z-10">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={isAutoMode ? "default" : "outline"}
                                onClick={toggleAutoMode}
                                className="h-14 w-14 rounded-full"
                            >
                                <BotMessageSquare className="h-7 w-7" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle Auto-Play</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
