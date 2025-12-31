
'use client';

import * as React from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { collection, getDocs, query, orderBy, limit, doc } from 'firebase/firestore';
import { getDocWithRetry, isBrowserOnline } from '@/lib/firestore-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Inbox, History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Profile {
    id: string;
    mode: number;
    label: string;
    createdAt: string;
}

interface FullResult {
    [key: string]: any;
}

export function SavedProfiles() {
    const auth = useAuth();
    const db = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [profiles, setProfiles] = React.useState<Profile[]>([]);
    const [selectedResult, setSelectedResult] = React.useState<FullResult | null>(null);
    const [isLoadingProfiles, setIsLoadingProfiles] = React.useState(false);
    const [isLoadingResult, setIsLoadingResult] = React.useState<string | null>(null);
    const [hasFetched, setHasFetched] = React.useState(false);

    const fetchProfiles = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in to view saved profiles.' });
            return;
        }
        setIsLoadingProfiles(true);
        setHasFetched(true);
        setSelectedResult(null);
        setProfiles([]);
        try {
            const profilesRef = collection(db, 'users', user.uid, 'profiles');
            const q = query(profilesRef, orderBy('createdAt', 'desc'), limit(20));
            const querySnapshot = await getDocs(q);
            const fetchedProfiles: Profile[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedProfiles.push({
                    id: doc.id,
                    mode: data.mode,
                    label: data.label,
                    createdAt: data.createdAt.toDate().toISOString(),
                });
            });
            setProfiles(fetchedProfiles);
             if (fetchedProfiles.length === 0) {
                toast({ title: 'No profiles found.' });
            }
        } catch (error: any) {
            console.error("Error fetching profiles from Firestore: ", error);
            toast({ variant: 'destructive', title: 'Error fetching profiles', description: error.message });
        } finally {
            setIsLoadingProfiles(false);
        }
    };
    
    const fetchResult = async (profileId: string) => {
        if (!user || !profileId) return;
        setIsLoadingResult(profileId);
        setSelectedResult(null);
        try {
            if (!isBrowserOnline()) {
                toast({ title: 'Offline', description: 'You appear to be offline. Please check your connection and try again.' });
                return;
            }
            const profileRef = doc(db, 'users', user.uid, 'profiles', profileId);
            const docSnap = await getDocWithRetry(profileRef, { retries: 2 });

            if (!docSnap.exists()) {
                throw new Error('Profile document not found.');
            }

            const data = docSnap.data();
            // The python script saves the result in `activated_body_json`
            if (data.activated_body_json) {
                const parsedResult = JSON.parse(data.activated_body_json);
                setSelectedResult(parsedResult);
            } else if (data.activated_body) { // Fallback for older data structure
                 setSelectedResult(data.activated_body);
            } else {
                 throw new Error('No result data found in the profile.');
            }

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error fetching result', description: error.message });
        } finally {
            setIsLoadingResult(null);
        }
    };
    
    const getModeLabel = (mode: number) => {
        switch (mode) {
            case 1: return 'Single Profile';
            case 2: return 'Compatibility';
            case 3: return 'Transit';
            default: return 'Unknown';
        }
    }

    if (!user) {
        return null; 
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Saved Calculations</CardTitle>
                <CardDescription>Review your previously generated Human Design charts and reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={fetchProfiles} disabled={isLoadingProfiles}>
                    {isLoadingProfiles ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
                    Fetch My Saved Profiles
                </Button>

                {isLoadingProfiles && (
                    <div className="mt-4 space-y-2">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-10 w-full rounded-md bg-muted animate-pulse" />)}
                    </div>
                )}
                
                {hasFetched && !isLoadingProfiles && profiles.length === 0 && (
                    <div className="mt-4 text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <Inbox className="mx-auto h-12 w-12" />
                        <p className="mt-4">No saved profiles found.</p>
                        <p className="text-xs">Generate a new chart above to save your first profile.</p>
                    </div>
                )}

                {profiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {profiles.map(profile => (
                            <div key={profile.id} className="flex items-center justify-between p-2 border rounded-md gap-2">
                                <div>
                                    <p className="font-semibold">{profile.label}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(parseISO(profile.createdAt), 'PPp')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={profile.mode === 2 ? "secondary" : "outline"}>{getModeLabel(profile.mode)}</Badge>
                                  <Button size="sm" onClick={() => fetchResult(profile.id)} disabled={!!isLoadingResult}>
                                      {isLoadingResult === profile.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View'}
                                  </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedResult && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-lg mb-2">Selected Result</h3>
                        <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto max-h-96">
                            {JSON.stringify(selectedResult, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
