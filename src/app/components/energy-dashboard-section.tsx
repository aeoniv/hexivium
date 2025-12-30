'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError, useCollection } from '@/firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

export default function EnergyDashboardSection() {
    const { t } = useTranslation();
    const { user } = useUser();
    const firestore = useFirestore();
    const [energyBalance, setEnergyBalance] = useState<number | null>(null);
    const [totalSpent, setTotalSpent] = useState<number>(0);

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const paymentsQuery = useMemoFirebase(
      () => (firestore && user ? query(collection(firestore, 'customers', user.uid, 'payments'), where('status', '==', 'succeeded')) : null),
      [firestore, user]
    );
    const { data: payments, isLoading: paymentsLoading } = useCollection(paymentsQuery);

    useEffect(() => {
        if (payments) {
          const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
          setTotalSpent(total);
        }
    }, [payments]);

    useEffect(() => {
        if (!userProfileRef) {
            setEnergyBalance(null);
            return;
        }

        const unsubscribe = onSnapshot(userProfileRef, (docSnap) => {
            if (docSnap.exists()) {
                setEnergyBalance(docSnap.data().energyBalance);
            } else {
                setEnergyBalance(0);
            }
        },
        (error) => {
          console.error("Failed to listen to user profile for energy balance:", error);
          const permissionError = new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
          setEnergyBalance(0);
        });

        return () => unsubscribe();
    }, [userProfileRef]);
    
    const energyLevel = (energyBalance ?? 0) + (totalSpent / 100);
    const isLoading = paymentsLoading || energyBalance === null;

    const energyGoal = 512;
    const progressPercentage = energyLevel ? (energyLevel / energyGoal) * 100 : 0;

    return (
        <section id="energy-dashboard" className="py-12 md:py-16 bg-secondary">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="mx-auto shadow-lg border-primary border-t-4">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl flex items-center gap-2">
                            <Zap className="h-8 w-8 text-primary" />
                            {t('yourEnergyLevel')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-muted-foreground">{t('currentScore')}</p>
                            <p className="text-5xl font-bold text-primary">{isLoading ? '...' : energyLevel.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm font-medium text-muted-foreground">
                               <span>{t('progress')}</span>
                               <span>{isLoading ? '...' : energyLevel.toLocaleString()} / {energyGoal} {t('pointsForFullAccess')}</span>
                           </div>
                            <Progress value={progressPercentage} className="h-4" />
                            <p className="text-sm text-muted-foreground text-center mt-2">
                                {t('goal')}: {energyGoal} {t('pointsForFullAccess')}
                            </p>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="#pricing" passHref className="flex-1">
                              <Button className="w-full" size="lg">{t('buyEnergy')}</Button>
                            </Link>
                             <Link href="#volunteer" passHref className="flex-1">
                                <Button variant="outline" className="w-full" size="lg">{t('sellEnergy')}</Button>
                             </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
