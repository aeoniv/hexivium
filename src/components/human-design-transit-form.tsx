
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse } from 'date-fns';
import { useAuth, useFirestore } from '@/firebase/client-provider';
import { useUser } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toZonedTime } from 'date-fns-tz';


import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CityCombobox, type City } from '@/components/city-combobox';
import { DatePicker } from '@/components/date-picker';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const profileSchema = z.object({
    date: z.date().optional(),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)").optional(),
    city: z.custom<City | null>(data => data !== null, "City is required.").nullable(),
});

const formSchema = z.object({
  profile1: profileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function HumanDesignTransitForm() {
    const auth = useAuth();
    const user = useUser(auth);
    const db = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<any>(null);
    const [isLoadingDiagnostics, setIsLoadingDiagnostics] = React.useState<string | null>(null);
    const [advancedDiagnosticsResult, setAdvancedDiagnosticsResult] = React.useState<any>(null);
    const [selectedDiagnosticKey, setSelectedDiagnosticKey] = React.useState<string | null>(null);
    const [selectedProfileId, setSelectedProfileId] = React.useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile1: { date: new Date(), time: format(new Date(), "HH:mm"), city: null },
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        setResult(null);

        const transformProfile = (profileData: typeof data.profile1 | undefined) => {
            if (!profileData || !profileData.date || !profileData.time || !profileData.city) return undefined;
            
            // 1. Combine local date and time strings
            const localDateTimeString = `${format(profileData.date, 'yyyy-MM-dd')} ${profileData.time}`;
            
            // 2. Parse this string into a Date object, assuming it's in the city's local timezone.
            // We use `parse` from date-fns for robustness.
            const localDate = parse(localDateTimeString, 'yyyy-MM-dd HH:mm', new Date());

            // 3. Convert this local date to UTC using the city's timezone.
            const utcDate = toZonedTime(localDate, profileData.city.timezone);
            
            // 4. Format the UTC date for the API.
            const apiDateTime = format(utcDate, 'yyyy/MM/dd HH:mm');
            
            return {
                datetime: apiDateTime,
                city: `${profileData.city.name}, ${profileData.city.country}`,
                latitude: profileData.city.latitude,
                longitude: profileData.city.longitude,
            };
        };

        const profile1Payload = transformProfile(data.profile1);
        if (!profile1Payload) {
            toast({ variant: 'destructive', title: 'Error', description: 'Your profile details are incomplete.' });
            setIsLoading(false);
            return;
        }

        const requestPayload = {
            mode: 3, // Hardcoded to Transit mode
            userId: user?.uid,
            profile1: profile1Payload,
            compact: true,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const apiResult = await response.json();
            setResult(apiResult);
            toast({ title: 'Transit Chart Calculated', description: 'Your transit chart is ready.' });

        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Calculation Failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadAdvancedDiagnostics = async (profileId: 'm3_profile1' | 'm3_now') => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        setIsLoadingDiagnostics(profileId);
        setAdvancedDiagnosticsResult(null);
        setSelectedDiagnosticKey(null);
        try {
            const profileRef = doc(db, 'users', user.uid, 'profiles', profileId);
            const docSnap = await getDoc(profileRef);

            if (!docSnap.exists()) {
                throw new Error(`Profile '${profileId}' not found. Please generate the chart first.`);
            }

            const data = docSnap.data();
            // The python script now saves the result in `activated_body_json`
            if (data.activated_body_json) {
                const parsedResult = JSON.parse(data.activated_body_json);
                // The JSON inside might have another 'activated_body' layer
                 const profileData = parsedResult.activated_body_profile1 || parsedResult.activated_body_profile2 || parsedResult.activated_body || parsedResult;
                setAdvancedDiagnosticsResult(profileData);
            } else {
                 throw new Error('No result data found in the profile.');
            }
            setSelectedProfileId(profileId);

            toast({ title: 'Profile Loaded', description: `Diagnostic data for '${profileId}' is ready.` });

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Failed to load diagnostics', description: error.message });
        } finally {
            setIsLoadingDiagnostics(null);
        }
    };

    const profileKeys = advancedDiagnosticsResult ? Object.keys(advancedDiagnosticsResult) : [];

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Card className="bg-card/50 border-0 shadow-none">
                        <CardHeader className="p-2">
                            <CardTitle>Human Design Transit</CardTitle>
                            <CardDescription>Enter your birth details to generate a transit chart against the current time.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                        <FormField
                            control={form.control}
                            name="profile1.date"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <DatePicker date={field.value} setDate={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profile1.time"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Time (24h)</FormLabel>
                                <FormControl>
                                <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="sm:col-span-2">
                            <FormField
                                control={form.control}
                                name="profile1.city"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Birth City</FormLabel>
                                    <FormControl>
                                        <CityCombobox value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        </CardContent>
                         <CardFooter className="p-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Calculate Transit
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            {result && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="w-full" onClick={() => loadAdvancedDiagnostics('m3_profile1')} disabled={!!isLoadingDiagnostics}>
                        {isLoadingDiagnostics === 'm3_profile1' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        View Birth Profile
                    </Button>
                     <Button className="w-full" onClick={() => loadAdvancedDiagnostics('m3_now')} disabled={!!isLoadingDiagnostics}>
                        {isLoadingDiagnostics === 'm3_now' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        View Current Transit
                    </Button>
                </div>
            )}
            
            {advancedDiagnosticsResult && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Advanced Diagnostics: {selectedProfileId}</CardTitle>
                        <CardDescription>Select a category to view its data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {profileKeys.map(key => (
                                <Button
                                    key={key}
                                    variant={selectedDiagnosticKey === key ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDiagnosticKey(key)}
                                >
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Button>
                            ))}
                        </div>
                        {selectedDiagnosticKey && (
                             <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto max-h-96">
                                {JSON.stringify(advancedDiagnosticsResult[selectedDiagnosticKey], null, 2)}
                            </pre>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
