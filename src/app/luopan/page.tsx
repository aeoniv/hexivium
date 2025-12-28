
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth, useFirestore } from '@/firebase/client-provider';
import { useUser } from '@/lib/auth';
import { collection, getDocs } from 'firebase/firestore';

const GlobeView = dynamic(() => import('@/components/globe-view').then(mod => mod.GlobeView), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
});

interface Location {
    lat: number;
    lng: number;
    size: number;
    color: string;
    label?: string;
}

export default function LuopanPage() {
    const [userLocation, setUserLocation] = React.useState<Location | null>(null);
    const [allLocations, setAllLocations] = React.useState<Location[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const auth = useAuth();
    const db = useFirestore();
    const currentUser = useUser(auth);

    React.useEffect(() => {
        // 1. Get current user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const myLoc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        size: 0.5,
                        color: '#ef4444', // Red for current user
                        label: 'Your Location'
                    };
                    setUserLocation(myLoc);
                },
                (err) => {
                    setError(`Error getting your location: ${err.message}`);
                    console.error(err);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }

        // 2. Fetch all users' locations from Firestore
        const fetchUserLocations = async () => {
            if (!db || !currentUser) return;
            try {
                const usersCollection = collection(db, 'users');
                const userSnapshot = await getDocs(usersCollection);
                const locations: Location[] = [];
                userSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.last_location && userData.uid !== currentUser?.uid) {
                        locations.push({
                            lat: userData.last_location.latitude,
                            lng: userData.last_location.longitude,
                            size: 0.3,
                            color: '#3b82f6', // Blue for other users
                            label: userData.displayName || 'Another User'
                        });
                    }
                });
                setAllLocations(locations);
            } catch (firestoreError) {
                console.error("Error fetching user locations from Firestore:", firestoreError);
                setError("Could not fetch user locations.");
            }
        };
        
        if (currentUser) {
            fetchUserLocations();
        }

    }, [currentUser, db]);

    const displayPoints = userLocation ? [userLocation, ...allLocations] : allLocations;

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            {error && <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground p-2 rounded-md z-20">{error}</div>}
            <GlobeView 
                pointsData={displayPoints} 
                showLuopan={true}
            />
        </main>
    );
}
