
'use client';

import * as React from 'react';
import { HexagramGlobe } from '@/components/HexagramGlobe';
import { Button } from '@/components/ui/button';
import { Globe, Waypoints, Orbit, CircleDashed, Loader2, Share2, Group } from 'lucide-react';

type ViewMode = 'torus' | 'bodygraph';

export default function HumanDesignPage() {
    const [hasMounted, setHasMounted] = React.useState(false);
    const [cameraIndex, setCameraIndex] = React.useState(0);
    const [isWireframeVisible, setIsWireframeVisible] = React.useState(true);
    const [pathType, setPathType] = React.useState(1); // 0: none, 1: path, 2: tunnel
    const [viewMode, setViewMode] = React.useState<ViewMode>('torus');

    const toggleCamera = () => setCameraIndex((prev) => (prev === 0 ? 1 : 0));
    const toggleWireframe = () => setIsWireframeVisible((prev) => !prev);
    const cyclePathType = () => setPathType((prev) => (prev + 1) % 3);
    const toggleViewMode = () => setViewMode((prev) => (prev === 'torus' ? 'bodygraph' : 'torus'));


    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="relative w-full h-screen overflow-hidden">
            {/* Background Globe */}
            <div className="absolute inset-0 z-0">
                <HexagramGlobe
                    activeCameraIndex={cameraIndex}
                    isWireframeVisible={isWireframeVisible}
                    pathType={pathType}
                    viewMode={viewMode}
                />
            </div>
            
            {/* Header */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center">
                 <h1 className="text-4xl font-bold tracking-tighter text-white drop-shadow-lg">Human Design</h1>
                 <p className="text-white/80 mt-2 drop-shadow-md">Discover your energetic blueprint.</p>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                <Button onClick={toggleViewMode} size="icon" variant="outline" className="rounded-full bg-background/50">
                    {viewMode === 'torus' ? <Group className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                </Button>
                <Button onClick={toggleCamera} size="icon" variant="outline" className="rounded-full bg-background/50">
                    <Globe className="h-5 w-5" />
                </Button>
                <Button onClick={toggleWireframe} size="icon" variant={isWireframeVisible ? "secondary" : "outline"} className="rounded-full bg-background/50">
                    <CircleDashed className="h-5 w-5" />
                </Button>
                <Button onClick={cyclePathType} size="icon" variant="outline" className="rounded-full bg-background/50">
                    {pathType === 0 && <Orbit className="h-5 w-5" />}
                    {pathType === 1 && <Orbit className="h-5 w-5 text-primary" />}
                    {pathType === 2 && <Waypoints className="h-5 w-5 text-primary" />}
                </Button>
            </div>
        </main>
    );
}
