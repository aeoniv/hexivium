

'use client';

import { Settings, Mic, Vibrate } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sequences, hexagrams as allHexagrams } from '@/lib/i-ching-data';
import type { Mode, AutoSequenceName, Hexagram, HighlightMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from './ui/separator';
import { CurrentLineDisplay } from './current-line-display';
import { DiagramControls } from './diagram-controls';
import { ScrollArea } from './ui/scroll-area';
import { LiveClock } from './live-clock';
import { CalendarSettings } from './calendar-settings';
import { HumanDesignTransitForm } from './human-design-transit-form';
import { SavedProfiles } from './saved-profiles';
import { Icons } from './icons';
import { UserNav } from './user-nav';
import { BaguaInfo } from './bagua-info';
import Logo from './icons/logo';
import { BackgroundViewToggle } from './background-view-toggle';
import { QiCharger } from './qi-charger';
import { Label } from './ui/label';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import { AccelerometerVisualizer } from './accelerometer-visualizer';
import { GlobalCameraModal } from './global-camera-modal';
import { CameraProgressButton } from './camera-progress-button';

interface FloatingMenuProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  transitionTime: number;
  setTransitionTime: (time: number) => void;
  autoSequenceName: AutoSequenceName;
  setAutoSequenceName: (name: AutoSequenceName) => void;
  sunHexagramId: number | null;
  sunActiveLine: number | null;
  highlightMode: HighlightMode;
  setHighlightMode: (mode: HighlightMode) => void;
  onCameraClick: () => void;
  isCapturing: boolean;
  captureProgress: number;
}

export function FloatingMenu({
  mode,
  setMode,
  transitionTime,
  setTransitionTime,
  autoSequenceName,
  setAutoSequenceName,
  sunHexagramId,
  sunActiveLine,
  highlightMode,
  setHighlightMode,
  onCameraClick,
  isCapturing,
  captureProgress,
}: FloatingMenuProps) {
    const pathname = usePathname();
    const isCalendarPage = pathname === '/calendar';
    const isHuoHouTuPage = pathname === '/huo-hou-tu';
    const isIchingPage = pathname === '/iching';
    const isHumanDesignPage = pathname === '/human-design';
   
  return (
    <div className="fixed top-4 right-4 z-20">
      <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border p-1">
        <Link href="/dashboard" className="flex items-center gap-2 p-1 hover:bg-accent rounded-full transition-colors h-12">
            <Logo className="w-10 h-10 text-primary"/>
        </Link>
        <QiCharger />
        <AccelerometerVisualizer />
        <CameraProgressButton 
          onClick={onCameraClick}
          isCapturing={isCapturing}
          progress={captureProgress}
        />
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                    <Settings className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
                <ScrollArea className="h-[70vh] pr-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Settings</h4>
                            <p className="text-sm text-muted-foreground">
                                Configure your views.
                            </p>
                        </div>
                        
                        <div className='space-y-4'>
                            <div className="flex items-center justify-between">
                                <Label>Theme</Label>
                                <ThemeToggle />
                            </div>
                            {isIchingPage && (
                                <>
                                    <div className="flex items-center justify-between">
                                      <Label>Background View</Label>
                                      <BackgroundViewToggle />
                                    </div>
                                    <Separator />
                                </>
                            )}
                             {isHumanDesignPage && (
                                <>
                                    <HumanDesignTransitForm />
                                    <SavedProfiles />
                                    <Separator />
                                </>
                            )}
                            <LiveClock />
                            <Separator />
                           
                            <CurrentLineDisplay 
                                sunHexagramId={sunHexagramId}
                                sunActiveLine={sunActiveLine}
                            />
                            {isCalendarPage && (
                                <CalendarSettings />
                            )}
                            {isHuoHouTuPage && (
                            <div className="animate-in fade-in duration-300">
                                <Separator />
                                <DiagramControls 
                                    mode={mode}
                                    setMode={setMode}
                                    transitionTime={transitionTime}
                                    setTransitionTime={setTransitionTime}
                                    autoSequenceName={autoSequenceName}
                                    setAutoSequenceName={setAutoSequenceName}
                                    sunHexagramId={sunHexagramId}
                                    highlightMode={highlightMode}
                                    setHighlightMode={setHighlightMode}
                                />
                            </div>
                            )}
                            {isIchingPage && (
                                <>
                                    <BaguaInfo />
                                </>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
        <UserNav />
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full [--yin-yang-bg:hsl(var(--card))]">
                        <Icons.YinYang className="w-full h-full" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Oracle</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
