
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { hexagramMap, binaryHexagramMap, theBookOfLines } from '@/lib/data-provider';
import type { Hexagram } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, BookHeart, Bot, BrainCircuit, Briefcase, Handshake, Heart, Home, LucideIcon, Mountain, Sprout, Target, Wallet, Loader2, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase/client-provider';
import { useUser } from '@/lib/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from '@/hooks/use-debounce';


const bookOfLinesData = theBookOfLines;

interface Page {
    id: number;
    hexagramId: number;
    notes: string;
}

const lifeDomains: { name: string; icon: LucideIcon }[] = [
    { name: 'Vision', icon: Bot },
    { name: 'Mission', icon: Target },
    { name: 'Values', icon: BookHeart },
    { name: 'Health', icon: Heart },
    { name: 'Intellectual', icon: BrainCircuit },
    { name: 'Emotional', icon: Mountain },
    { name: 'Spiritual', icon: Sprout },
    { name: 'Relationship', icon: Handshake },
    { name: 'Family', icon: Home },
    { name: 'Social', icon: Handshake },
    { name: 'Career', icon: Briefcase },
    { name: 'Wealth', icon: Wallet },
];

export function BookOfLifeView() {
    const [pages, setPages] = useState<Page[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'index' | 'reading'>('index');
    const [activeDomain, setActiveDomain] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const auth = useAuth();
    const db = useFirestore();
    const user = useUser(auth);
    const { toast } = useToast();

    const debouncedNotes = useDebounce(pages.length > 0 ? pages[0].notes : '', 1000);

    const savePageOne = useCallback(async (page: Page | null) => {
        if (!user || !page) return;
        try {
            const bookRef = doc(db, "users", user.uid, "bookOfLife", "main");
            await setDoc(bookRef, {
                // Save only the first page in an array
                pages: [page],
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Failed to save Book of Life:", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Your progress could not be saved."
            });
        }
    }, [user, db, toast]);

    useEffect(() => {
        if (pages.length > 0 && !isLoading) {
             savePageOne({ ...pages[0], notes: debouncedNotes });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedNotes, user, isLoading]);


    useEffect(() => {
        const loadBook = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            };

            const bookRef = doc(db, "users", user.uid, "bookOfLife", "main");
            const docSnap = await getDoc(bookRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const savedPages = data.pages || [];
                if (savedPages.length > 0) {
                    setPages(savedPages); // Only loads the saved pages (which should be just page 1)
                    setCurrentPageIndex(0);
                    setViewMode('reading');
                } else {
                     setViewMode('index');
                }
            } else {
                setViewMode('index');
            }
            setIsLoading(false);
        };
        if(user) {
            loadBook();
        } else if (auth === null) { // auth is loaded but user is null
            setIsLoading(false);
        }
    }, [user, auth, db]);

    const loadHumanDesignProfile = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Not Logged In",
                description: "You must be logged in to load a profile.",
            });
            return;
        }
        setIsLoading(true);
        try {
            const profileRef = doc(db, "users", user.uid, "profiles", "m3_profile1");
            const docSnap = await getDoc(profileRef);

            if (!docSnap.exists()) {
                throw new Error("No saved 'm3_profile1' calculation found for your profile. Please generate one first.");
            }

            const data = docSnap.data();
            
            if (!data.activated_body_json) {
                throw new Error("Saved profile data is missing the 'activated_body_json' field.");
            }
            
            const resultData = JSON.parse(data.activated_body_json);
            
            let resultBody = resultData?.activated_body?.activated_body_profile1 || resultData?.activated_body || resultData;
            
            if (!resultBody || !resultBody.planet_aspect_binary_sequence || resultBody.planet_aspect_binary_sequence.length === 0) {
                 throw new Error("Profile data is incomplete or has an unexpected structure in 'activated_body'.");
            }

            const lifeWorkSequence = resultBody.planet_aspect_binary_sequence.find((p: any) => p.page_01);
            
            if (!lifeWorkSequence || !lifeWorkSequence.page_01 || !lifeWorkSequence.page_01.from_gate_line) {
                 throw new Error("Could not find 'Life's Work' (page_01) in the profile data.");
            }

            const lifeWorkGate = parseInt(lifeWorkSequence.page_01.from_gate_line, 10);
            
            const startHexagram = hexagramMap.get(lifeWorkGate);

            if (startHexagram) {
                const initialPage: Page = { id: 1, hexagramId: startHexagram.id, notes: '' };
                setPages([initialPage]);
                setCurrentPageIndex(0);
                setViewMode('reading');
                await savePageOne(initialPage);
                toast({
                    title: "Book of Life Started!",
                    description: `Your journey begins with Hexagram ${startHexagram.id}: ${startHexagram.name}.`,
                });
            } else {
                throw new Error(`Could not find Hexagram for gate number: ${lifeWorkGate}`);
            }

        } catch (error: any) {
            console.error("Error loading Human Design profile:", error);
            toast({
                variant: "destructive",
                title: "Failed to load profile",
                description: error.message || "An unknown error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const addNextPage = (currentHexagramId: number, clickedLine: number) => {
        const currentHexagram = hexagramMap.get(currentHexagramId);
        if (!currentHexagram || !currentHexagram.binary) return;

        const currentBinary = currentHexagram.binary;
        const lineIndex = clickedLine - 1;

        if (lineIndex < 0 || lineIndex >= currentBinary.length) return;

        const newBinaryArray = currentBinary.split('').reverse();
        newBinaryArray[lineIndex] = newBinaryArray[lineIndex] === '1' ? '0' : '1';
        const nextBinary = newBinaryArray.reverse().join('');

        const nextHexagram = binaryHexagramMap.get(nextBinary);

        if (nextHexagram) {
            setPages(prev => {
                const newPages = [...prev];
                if (newPages.length === currentPageIndex + 1) {
                    newPages.push({ id: prev.length + 1, hexagramId: nextHexagram.id, notes: '' });
                }
                return newPages;
            });
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handleNotesChange = (pageId: number, newNotes: string) => {
      // Only persist notes for the first page
      if(pageId === 1) {
        setPages(prev => [{...prev[0], notes: newNotes}, ...prev.slice(1)]);
      } else {
        // For other pages, just update local state
        setPages(prev => prev.map(p => p.id === pageId ? { ...p, notes: newNotes } : p));
      }
    };

    const handleDomainClick = (domain: string) => {
        if (domain === 'Vision') {
            loadHumanDesignProfile();
        } else {
            setActiveDomain(domain === activeDomain ? null : domain);
        }
    };
    
    const handlePrevClick = () => {
        if (viewMode === 'reading') {
            if (currentPageIndex > 0) {
                setCurrentPageIndex(prev => prev - 1);
            } else {
                setViewMode('index');
            }
        }
    };
    
    const handleNextClick = () => {
        if (viewMode === 'index') {
            if (pages.length > 0) {
                setViewMode('reading');
            } else {
                toast({
                    title: "Start your journey",
                    description: "Load your Human Design profile to begin your Book of Life.",
                });
            }
        } else {
            if (currentPageIndex < pages.length - 1) {
                setCurrentPageIndex(prev => prev + 1);
            }
        }
    };


    const currentPageData = pages[currentPageIndex];
    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin" /></div>
    }
    
    const currentHexagram = currentPageData ? hexagramMap.get(currentPageData.hexagramId) : null;
    const hexagramLines = currentHexagram ? bookOfLinesData.hexagrams.find(h => h.number === currentHexagram.id)?.lines || [] : [];
    
    const LeftPageContent = () => {
        if (viewMode === 'index') {
            return (
                <div className="p-6 h-full flex flex-col">
                    <h3 className="text-xl font-bold text-center mb-4">Book of Life Index</h3>
                    <div className="grid grid-cols-2 gap-2 flex-grow">
                        {lifeDomains.map(domain => {
                            const Icon = domain.icon;
                            return (
                                <Button
                                    key={domain.name}
                                    variant={activeDomain === domain.name ? 'default' : 'ghost'}
                                    className="justify-start gap-2"
                                    onClick={() => handleDomainClick(domain.name)}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{domain.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                     {pages.length === 0 && (
                        <Button onClick={loadHumanDesignProfile} disabled={isLoading || !user} className="mt-4">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                            Start Your Book of Life
                        </Button>
                    )}
                </div>
            );
        }
        return (
            <div className="w-full relative aspect-square md:aspect-auto h-full">
                {currentHexagram && (
                    <Image 
                        src={`https://picsum.photos/seed/${currentHexagram.id}/600/800`}
                        alt={currentHexagram.name}
                        fill={true}
                        objectFit="cover"
                        className="rounded-l-lg"
                    />
                )}
            </div>
        );
    };

    const RightPageContent = () => {
        if (viewMode === 'index') {
            return (
                <div 
                    className="p-6 h-full flex flex-col items-center justify-center text-center cursor-pointer group"
                    onClick={handleNextClick}
                >
                    <BookHeart className="w-16 h-16 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                    <h2 className="text-2xl font-headline mt-4">The Book of Life</h2>
                     {pages.length > 0 ? (
                        <p className="text-muted-foreground mt-2">Click here to continue your journey.</p>
                     ) : (
                        <p className="text-muted-foreground mt-2">Load your profile from the index to begin.</p>
                     )}
                </div>
            );
        }
        
        if (!currentHexagram || !currentPageData) return null;

        return (
            <div className="p-6 flex flex-col h-full">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{currentHexagram.name}</h2>
                    <p className="text-sm text-muted-foreground">{currentHexagram.id}: {currentHexagram.chineseName}</p>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                    <TooltipProvider>
                    {hexagramLines.map(line => (
                        <Tooltip key={line.line_number}>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline"
                                    className="h-auto text-wrap whitespace-normal justify-start text-left"
                                    onClick={() => addNextPage(currentHexagram!.id, line.line_number)}
                                    disabled={currentPageIndex < pages.length - 1}
                                >
                                    <span className="font-bold mr-2">{line.line_number}:</span>
                                    <span>{line.title}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p className="max-w-xs">{line.text}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </TooltipProvider>
                </div>
                <Textarea
                    value={currentPageData.notes}
                    onChange={(e) => handleNotesChange(currentPageData.id, e.target.value)}
                    placeholder="Your reflections on this moment..."
                    className="text-sm bg-transparent border-t mt-4 pt-4 focus-visible:ring-0 resize-none h-24"
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center gap-4 w-full">
                <Button 
                    onClick={handlePrevClick}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full flex-shrink-0"
                    disabled={viewMode === 'index' && currentPageIndex === 0}
                >
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">Previous</span>
                </Button>

                <Card className="w-[48rem] max-w-full h-auto aspect-[1/1.4] md:aspect-auto md:h-[40rem] flex-shrink-0 shadow-2xl relative bg-card">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent"></div>
                    <CardContent className="flex p-0 h-full">
                        <div className="w-1/2 h-full">
                           <LeftPageContent />
                        </div>
                        <div className="w-1/2 h-full border-l">
                            <RightPageContent />
                        </div>
                    </CardContent>
                </Card>

                <Button 
                    onClick={handleNextClick}
                    disabled={viewMode === 'reading' && currentPageIndex === pages.length - 1}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full flex-shrink-0"
                >
                    <ArrowRight className="h-6 w-6" />
                    <span className="sr-only">Next</span>
                </Button>
            </div>
            
            <div className="text-sm text-muted-foreground h-5">
                {viewMode === 'reading' && `Page ${currentPageIndex + 1} of ${pages.length}`}
            </div>
        </div>
    );
}
