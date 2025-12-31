'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useUser, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { type UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/context/language-context';

function AdminDashboardLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Skeleton className="h-10 w-1/3 mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

// Componente para um único cartão de usuário, contendo toda a sua lógica de dados.
function UserCard({ user }: { user: UserProfile }) {
  const { t } = useTranslation();
  const firestore = useFirestore();

  // Busca os pagamentos para este usuário específico
  const paymentsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'customers', user.id, 'payments'), where('status', '==', 'succeeded')) : null),
    [firestore, user.id]
  );
  const { data: payments, isLoading: paymentsLoading } = useCollection(paymentsQuery);

  // Busca as reservas para este usuário específico
  const bookingsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users', user.id, 'bookings')) : null),
    [firestore, user.id]
  );
  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  // Calcula os totais
  const totalAmountSpent = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) ?? 0;
  const energyCredits = user.energyBalance ?? 0;
  const energyLevel = energyCredits + totalAmountSpent / 100; // O valor gasto está em centavos

  const bookingCount = bookings?.length ?? 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100);
  };

  return (
    <Card className="bg-background border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left flex-1">
            <p className="font-bold text-lg text-foreground">{user.displayName || t('nameUnavailable')}</p>
            <p className="text-sm text-muted-foreground">{user.email || t('emailUnavailable')}</p>
          </div>
          <div className="flex items-center gap-4 text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
             <Badge variant={bookingCount > 0 ? "default" : "outline"} className="ml-auto sm:ml-0 h-fit">
                  {bookingCount} {bookingCount === 1 ? t('class') : t('classes')}
              </Badge>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
         <div>
            <p className="text-sm text-muted-foreground">{t('credits')}</p>
            <p className="font-bold text-lg text-primary">{energyCredits}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('amountSpent')}</p>
            {paymentsLoading ? <Skeleton className="h-6 w-24 mx-auto mt-1" /> : <p className="font-bold text-lg text-primary">{formatCurrency(totalAmountSpent)}</p>}
          </div>
           <div>
            <p className="text-sm text-muted-foreground">{t('energyLevel')}</p>
            {paymentsLoading ? <Skeleton className="h-6 w-24 mx-auto mt-1" /> : <p className="font-bold text-lg text-primary">{energyLevel.toLocaleString()}</p>}
          </div>
          <div className="col-span-2 md:col-span-4 mt-4">
              <h4 className="font-semibold text-left mb-2">{t('scheduledClasses')}</h4>
              {bookingsLoading ? <Skeleton className="h-10 w-full" /> : 
              bookingCount > 0 && bookings ? (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-left">
              {bookings.map(booking => {
                  if (!booking) return null; 
                  const bookedDate = booking.bookedAt?.seconds 
                    ? new Date(booking.bookedAt.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
                    : t('pending');
                  return (
                    <li key={booking.id}>
                      <span className="font-medium text-foreground">
                        {booking.className || 'Aula sem nome'}
                      </span> em{' '}
                      {bookedDate}
                    </li>
                  )
              })}
              </ul>
              ) : (
              <p className="text-muted-foreground text-left">{t('noClassesScheduled')}</p>
              )}
          </div>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const { t } = useTranslation();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users')) : null),
    [firestore]
  );

  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<UserProfile>(usersQuery);
  
  if (usersLoading) {
    return <AdminDashboardLoading />;
  }

  return (
    <section className="py-8 md:py-12 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{t('adminDashboard')}</CardTitle>
            <CardDescription>{t('adminDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {usersError ? (
              <div className="text-center text-red-500 py-8">
                <p>{t('errorLoadingUsers')}</p>
                <p className="text-sm text-muted-foreground">{usersError?.message}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users && users.length > 0 ? (
                  users.map(user => {
                    if (!user) return null; // Validação para evitar erros de renderização
                    return <UserCard key={user.id} user={user} />;
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">{t('noUsersFound')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
