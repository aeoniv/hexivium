
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { CheckCircle2, Circle, UploadCloud, Loader2, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { zodiacSequence, hexagrams as allHexagrams } from '@/lib/i-ching-data';
import type { Hexagram } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore, useStorage } from '@/firebase/client-provider';
import { useUser } from '@/lib/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

const hexagramMap = new Map<number, Hexagram>(allHexagrams.map(h => [h.id, h]));

const initialJourneySteps = [
    { id: 'ordinary-world', title: 'The Ordinary World', task: 'Post a "before" photo of the project/workspace.' },
    { id: 'call-to-adventure', title: 'The Call to Adventure', task: 'Post a sunrise photo with your daily goal.' },
    { id: 'refusal-of-call', title: 'Refusal of the Call', task: 'Post a photo/meme of your main obstacle.' },
    { id: 'meeting-mentor', title: 'Meeting the Mentor', task: 'Screenshot the feature they will rely on.' },
    { id: 'crossing-threshold', title: 'Crossing the Threshold', task: 'Screenshot their very first action/click.' },
    { id: 'tests-allies-enemies', title: 'Tests, Allies & Enemies', task: 'Post a mid-day photo with a progress update.' },
    { id: 'inmost-cave', title: 'Approach to the Inmost Cave', task: 'Screenshot the most difficult part of the task.' },
    { id: 'ordeal', title: 'The Ordeal', task: 'Screenshot the final action (e.g., hitting "Send").' },
    { id: 'reward', title: 'The Reward', task: 'Post a photo of the successful outcome/result.' },
    { id: 'road-back', title: 'The Road Back', task: 'Post a sunset photo with a key takeaway.' },
    { id: 'resurrection', title: 'The Resurrection', task: 'Share a "before & after" comparison.' },
    { id: 'return-with-elixir', title: 'Return with the Elixir', task: 'Create a testimonial (photo + quote).' },
];

const journeySteps = initialJourneySteps.map((step, index) => {
    const hexagramId = zodiacSequence[index];
    const hexagram = hexagramMap.get(hexagramId);
    return {
        ...step,
        hexagramId,
        hexagramName: hexagram ? `${hexagram.id}: ${hexagram.name}` : '',
    };
});

interface JourneyEntry {
    image: string | null;
    notes: string;
}

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (dataUrl: string) => void;
    stepTitle: string;
}

function CameraModal({ isOpen, onClose, onCapture, stepTitle }: CameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
            if (isOpen) {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    setHasCameraPermission(true);
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                }
            } else {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
            }
        };

        getCameraPermission();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, stream]);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                onCapture(dataUrl);
                onClose();
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Capture for: {stepTitle}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Alert variant="destructive" className="max-w-sm">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please enable camera permissions in your browser to use this feature.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                         {hasCameraPermission === null && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                         )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Photo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function HeroJourneyView() {
    const [entries, setEntries] = useState<Record<string, JourneyEntry>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [activeCameraStep, setActiveCameraStep] = useState<string | null>(null);

    const auth = useAuth();
    const db = useFirestore();
    const storage = useStorage();
    const user = useUser(auth);
    const { toast } = useToast();

    const debouncedNotes = useDebounce(entries, 1000);

    const saveJourneyData = useCallback(async (updatedEntries: Record<string, JourneyEntry>) => {
        if (!user) return;
        try {
            const journeyRef = doc(db, 'users', user.uid, 'journeys', 'heroJourney');
            await setDoc(journeyRef, { entries: updatedEntries }, { merge: true });
        } catch (error) {
            console.error("Failed to save journey data:", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Your progress could not be saved."
            });
        }
    }, [user, db, toast]);

    useEffect(() => {
        if (Object.keys(debouncedNotes).length > 0 && !isLoading) {
            saveJourneyData(debouncedNotes);
        }
    }, [debouncedNotes, isLoading, saveJourneyData]);
    
    useEffect(() => {
        const loadJourney = async () => {
            if (!user) {
                const initial = {};
                journeySteps.forEach(step => (initial as any)[step.id] = { image: null, notes: '' });
                setEntries(initial);
                setIsLoading(false);
                return;
            }

            const journeyRef = doc(db, "users", user.uid, "journeys", "heroJourney");
            const docSnap = await getDoc(journeyRef);

            if (docSnap.exists()) {
                setEntries(docSnap.data().entries || {});
            } else {
                const initial = {};
                journeySteps.forEach(step => (initial as any)[step.id] = { image: null, notes: '' });
                setEntries(initial);
            }
            setIsLoading(false);
        };
        
        if (user) {
            loadJourney();
        } else if (auth === null) {
            setIsLoading(false);
        }

    }, [user, auth, db]);

    const uploadImage = async (id: string, fileOrDataUrl: File | string) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload an image.'});
            return;
        }
        setIsUploading(id);
        try {
            const storageRef = ref(storage, `users/${user.uid}/journeys/heroJourney/${id}-${Date.now()}.jpg`);
            let snapshot;

            if (typeof fileOrDataUrl === 'string') {
                snapshot = await uploadString(storageRef, fileOrDataUrl, 'data_url');
            } else {
                snapshot = await uploadBytes(storageRef, fileOrDataUrl);
            }
            
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            setEntries(prev => {
                const newEntries = { ...prev, [id]: { ...prev[id], image: downloadURL }};
                saveJourneyData(newEntries);
                return newEntries;
            });

            toast({ title: "Image Saved", description: "Your journey has been updated."});
        } catch (error) {
            console.error("Image upload failed:", error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not save your image.'});
        } finally {
            setIsUploading(null);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadImage(id, file);
        }
    };

     const handleCapture = async (id: string, dataUrl: string) => {
        await uploadImage(id, dataUrl);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
        setEntries(prev => ({ ...prev, [id]: { ...prev[id], notes: e.target.value } }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }


    return (
        <div className="max-w-3xl mx-auto">
            <div className="relative">
                {/* The vertical line */}
                <div className="absolute left-6 md:left-8 top-0 h-full w-0.5 bg-border -z-10" />

                <div className="space-y-12">
                    {journeySteps.map((step, index) => {
                        const entry = entries[step.id] || { image: null, notes: '' };
                        const isComplete = !!entry.image;
                        return (
                            <div key={step.id} className="relative flex items-start gap-4 md:gap-6">
                                {/* Step Circle */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background flex items-center justify-center">
                                        {isComplete ? (
                                            <CheckCircle2 className="w-8 h-8 text-primary" />
                                        ) : (
                                            <Circle className="w-8 h-8 text-muted-foreground/50" />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Step Content Card */}
                                <Card className="flex-1">
                                    <CardContent className="p-4 md:p-6 space-y-4">
                                        <div>
                                            <h2 className="text-lg font-bold">{index + 1}. {step.title}</h2>
                                            <p className="text-sm text-muted-foreground">{step.task}</p>
                                            <p className="text-xs text-primary font-semibold mt-1">{step.hexagramName}</p>
                                        </div>

                                        <div className="relative aspect-video bg-muted/50 rounded-md overflow-hidden flex items-center justify-center">
                                            {entry.image ? (
                                                <Image src={entry.image} alt={step.title} layout="fill" objectFit="cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full gap-4">
                                                     <Button variant="ghost" onClick={() => setActiveCameraStep(step.id)} disabled={isUploading === step.id}>
                                                        <Camera className="mr-2 h-4 w-4"/>
                                                        Use Camera
                                                    </Button>
                                                    <div className="w-px h-10 bg-border"/>
                                                    <label 
                                                        htmlFor={`upload-${step.id}`}
                                                        className={cn(
                                                            "cursor-pointer text-center p-2 flex items-center gap-2 text-muted-foreground transition-colors",
                                                            isUploading === step.id ? "cursor-not-allowed opacity-50" : "hover:text-primary"
                                                        )}
                                                    >
                                                        {isUploading === step.id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <UploadCloud className="w-5 h-5"/>
                                                        )}
                                                        <span className="text-sm font-semibold">{isUploading === step.id ? 'Uploading...' : 'Upload'}</span>
                                                    </label>
                                                    <Input 
                                                        id={`upload-${step.id}`} 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => handleImageChange(e, step.id)} 
                                                        disabled={isUploading === step.id} 
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor={`notes-${step.id}`} className="text-sm font-medium">Notes & Reflections</Label>
                                            <Textarea
                                                id={`notes-${step.id}`}
                                                value={entry.notes}
                                                onChange={(e) => handleNotesChange(e, step.id)}
                                                placeholder="What did you discover at this stage?"
                                                className="mt-2"
                                                rows={4}
                                            />
                                        </div>

                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
             {activeCameraStep && (
                <CameraModal
                    isOpen={!!activeCameraStep}
                    onClose={() => setActiveCameraStep(null)}
                    onCapture={(dataUrl) => handleCapture(activeCameraStep, dataUrl)}
                    stepTitle={journeySteps.find(s => s.id === activeCameraStep)?.title || ''}
                />
            )}
        </div>
    );
}
