
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, Home, Settings, Bot } from 'lucide-react';
import DragonflyMantisIcon from './icons/dragonfly-mantis-icon';
import { useTranslation } from '@/context/language-context';
import LanguageSelector from '@/components/language-selector';
import { Separator } from './ui/separator';
import { CurrentLineDisplay } from './current-line-display';
import { DiagramControls } from './diagram-controls';
import { ScrollArea } from './ui/scroll-area';
import { LiveClock } from './live-clock';
import { CalendarSettings } from './calendar-settings';
import { HumanDesignTransitForm } from './human-design-transit-form';
import { SavedProfiles } from './saved-profiles';
import { UserNav } from './user-nav';
import { BaguaInfo } from './bagua-info';
import { BackgroundViewToggle } from './background-view-toggle';
import { QiCharger } from './qi-charger';
import { Label } from './ui/label';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import { AccelerometerVisualizer } from './accelerometer-visualizer';
import { CameraProgressButton } from './camera-progress-button';
import type { Mode, AutoSequenceName, HighlightMode } from '@/lib/types';
import type { User } from 'firebase/auth';

const ADMIN_EMAIL = 'shi.heng.yong.yi@gmail.com';

interface FloatingNavProps {
  user: User | null;
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


export function FloatingNav({
  user,
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
}: FloatingNavProps) {
  const { t } = useTranslation();
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const pathname = usePathname();
  const isCalendarPage = pathname === '/calendar';
  const isHuoHouTuPage = pathname === '/huo-hou-tu';
  const isIchingPage = pathname === '/iching';
  const isHumanDesignPage = pathname === '/human-design';

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/canvas-chatbot', label: t('courses'), icon: Bot },
    { href: '/admin', label: t('admin'), icon: Shield, adminOnly: true },
  ];
  
  const renderSettingsContent = () => (
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
          
            <div className="px-2">
                <Label>Language</Label>
                <div className="pt-2">
                  <LanguageSelector />
                </div>
            </div>

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
  );

  return (
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border p-1">
          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                          <Link href="/dashboard">
                          <DragonflyMantisIcon className="h-7 w-7 text-primary" />
                          </Link>
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>Dashboard</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>

          <QiCharger />
          <AccelerometerVisualizer />
          <CameraProgressButton 
            onClick={onCameraClick}
            isCapturing={isCapturing}
            progress={captureProgress}
          />
          
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                      <Menu className="h-6 w-6" />
                  </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                      <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <DragonflyMantisIcon className="h-10 w-10 text-primary" />
                            <span className="font-headline text-xl">Dragonfly Mantis</span>
                        </Link>
                      </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="flex-1">
                      <nav className="flex flex-col gap-2 p-4 text-lg font-medium">
                          {navLinks.map(link => {
                              if (link.adminOnly && !isAdmin) return null;
                              const Icon = link.icon;
                              return (
                                  <Link key={link.href} href={link.href} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors">
                                      <Icon className="h-6 w-6 text-primary" />
                                      <span>{link.label}</span>
                                  </Link>
                              )
                          })}
                      </nav>
                      <div className="px-4"><Separator /></div>
                      <div className="p-4">
                          {renderSettingsContent()}
                      </div>
                  </ScrollArea>
              </SheetContent>
          </Sheet>
          
          <UserNav />
        </div>
      </div>
  );
}

