
'use client';

import * as React from 'react';
import { useAccelerometer } from '@/hooks/use-accelerometer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Vibrate, VibrateOff } from 'lucide-react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function AccelerometerVisualizer() {
    const { data, error, permissionState, requestPermission, start, stop } = useAccelerometer();
    const { toast } = useToast();
    const [isListening, setIsListening] = React.useState(false);
    const [motionLevel, setMotionLevel] = React.useState(0);
    const [isSaving, setIsSaving] = React.useState(false);

    const auth = useAuth();
    const db = useFirestore();
    const { user } = useUser();

    React.useEffect(() => {
        if (data && data.x !== null && data.y !== null && data.z !== null) {
            // Calculate magnitude of the acceleration vector
            const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
            // Normalize to a 0-100 scale. Max expected magnitude is ~4g (39.2 m/s^2) for vigorous shakes.
            const level = Math.min(100, (magnitude / 39.2) * 100);
            setMotionLevel(level);

            // Save data if a significant motion is detected
            if (magnitude > 15 && !isSaving) {
                setIsSaving(true);
                const saveData = async () => {
                    if (!user) return;
                    try {
                        await addDoc(collection(db, 'users', user.uid, 'accelerometer_logs'), {
                            timestamp: new Date().toISOString(),
                            x: data.x,
                            y: data.y,
                            z: data.z,
                        });
                        toast({ title: 'Motion Data Captured' });
                    } catch (dbError) {
                        console.error("Error saving motion data:", dbError);
                        toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save motion data.' });
                    } finally {
                        // Prevent saving again for 2 seconds
                        setTimeout(() => setIsSaving(false), 2000);
                    }
                };
                saveData();
            }
        }
    }, [data, user, db, toast, isSaving]);

    React.useEffect(() => {
        if (error) {
            toast({ variant: 'destructive', title: 'Motion Sensor Error', description: error });
        }
    }, [error, toast]);

    const toggleListening = async () => {
        if (isListening) {
            stop();
            setIsListening(false);
        } else {
            if (permissionState === 'prompt') {
                const granted = await requestPermission();
                if (granted) {
                    start();
                    setIsListening(true);
                }
            } else if (permissionState === 'granted') {
                start();
                setIsListening(true);
            } else {
                toast({ variant: 'destructive', title: 'Permission Denied', description: 'Enable motion sensor access in browser settings.' });
            }
        }
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (motionLevel / 100) * circumference;

    return (
        <div className="relative w-12 h-12">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44">
                <circle
                    className="text-border"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    r={radius}
                    cx="22"
                    cy="22"
                />
                <circle
                    className="text-primary transition-all duration-300"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="22"
                    cy="22"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <Button
                variant={isListening ? "outline" : "ghost"}
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                onClick={toggleListening}
                disabled={permissionState === 'denied'}
                aria-label={isListening ? "Stop listening to motion" : "Start listening to motion"}
            >
                {isListening ? <VibrateOff className="h-5 w-5" /> : <Vibrate className="h-5 w-5" />}
            </Button>
        </div>
    );
}
