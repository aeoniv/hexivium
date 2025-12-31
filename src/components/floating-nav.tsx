
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, Home, BookOpen, Settings } from 'lucide-react';
import DragonflyMantisIcon from './icons/dragonfly-mantis-icon';
import { useTranslation } from '@/context/language-context';
import LanguageSelector from './language-selector';
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
import { BackgroundViewToggle } from './background-view-toggle';
import { QiCharger } from './qi-charger';
import { Label } from './ui/label';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import { AccelerometerVisualizer } from './accelerometer-visualizer';
import { GlobalCameraModal } from './global-camera-modal';
import { CameraProgressButton } from './camera-progress-button';
import { useGlobal } from '@/contexts/global-state-context';
import type { Mode, AutoSequenceName, HighlightMode } from '@/lib/types';


const ADMIN_EMAIL = 'shi.heng.yong.yi@gmail.com';


interface FloatingNavProps {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const pathname = usePathname();
  const isCalendarPage = pathname === '/calendar';
  const isHuoHouTuPage = pathname === '/huo-hou-tu';
  const isIchingPage = pathname === '/iching';
  const isHumanDesignPage = pathname === '/human-design';

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/courses', label: t('courses'), icon: BookOpen },
    { href: '/admin', label: t('admin'), icon: Shield, adminOnly: true },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-40 flex items-center gap-4">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">{t('openMenu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background">
          <SheetHeader className="mb-8 text-left">
            <SheetTitle>
              <Link href="/" className="flex items-center gap-2 font-bold" onClick={closeMenu}>
                <DragonflyMantisIcon className="h-10 w-10 text-primary" />
                <span className="font-headline text-xl">Dragonfly Mantis</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <nav className="flex flex-col gap-4 text-lg font-medium">
              {navLinks.map(link => {
                if (link.adminOnly && !isAdmin) return null;
                const Icon = link.icon;
                return (
                    <Link key={link.href} href={link.href} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors" onClick={closeMenu}>
                      <Icon className="h-6 w-6 text-primary" />
                      <span>{link.label}</span>
                    </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t">
                 <h3 className="px-2 pb-4 text-lg font-medium text-foreground">{t('language')}</h3>
                 <div className="px-2">
                    <LanguageSelector />
                 </div>
            </div>

            <div className="mt-auto pt-6 border-t">
              <UserNav />
            </div>
          </div>
        </SheetContent>
      </Sheet>

        <div className="hidden md:flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border p-1">
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
        </div>
      </div>
    </>
  );
}
