'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { 
  doc, 
  collection, 
  runTransaction, 
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';

const eventProgram = {
  "Cronograma de Aulas": [
    { 
      day: "Dia 1", 
      style: "Shaolin Quan (少林拳)",
      form: "Wu Bu Quan (五步拳)", 
      description: "Fundamentos Shaolin: Aprenda a base de 5 posturas essenciais, desenvolvendo estabilidade e estrutura corporal.",
      schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-shaolin"
    },
    { 
      day: "Dia 1", 
      style: "Meihua Quan (梅花拳)",
      form: "Wu Shi (五势)", 
      description: "Punho da Flor de Ameixeira: Explore 5 movimentos dinâmicos que combinam fluidez e explosão.",
      schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-meihua"
    },
    { 
      day: "Dia 2", 
      style: "Louva-a-Deus (螳螂拳)",
      form: "Saam Bo Jin (三步箭)", 
      description: "Velocidade e Precisão: Domine a 'Flecha de Três Passos', uma sequência veloz focada em ataques precisos.",
      schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-mantis"
    },
    { 
      day: "Dia 2", 
      style: "Wing Chun (咏春拳)",
      form: "Siu Nim Tao (小念头)", 
      description: "Estrutura e Linha Central: Conecte-se com a 'Pequena Ideia', a base do Wing Chun para defesa e ataque simultâneo.",
       schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-wingchun"
    },
    { 
      day: "Dia 3", 
      style: "Taiji Quan (太极拳)",
      form: "8 Passos (八步)", 
      description: "Meditação em Movimento: Introdução suave aos 8 movimentos essenciais do Tai Chi para harmonizar corpo e mente.",
       schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-taiji"
    },
    { 
      day: "Dia 3", 
      style: "Bagua Zhang (八卦掌)",
      form: "8 Palmas Mãe (八母掌)", 
      description: "Movimento Circular Contínuo: Aprenda as Oito Palmas Fundamentais do Bagua para agilidade e adaptação.",
       schedule: {
        morning: "09:00-11:00",
        afternoon: "15:00-17:00",
        evening: "19:00-21:00",
      },
      practices: "Forma, Aplicação (Sanda), Qi Gong",
      imageId: "form-bagua"
    },
  ]
};

export default function ClassScheduleSection() {
    const { t } = useTranslation();
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [bookingStatus, setBookingStatus] = useState<Record<string, 'booking' | 'booked' | 'error' | 'idle'>>({});
  
    const bookingsQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return collection(firestore, 'users', user.uid, 'bookings');
    }, [firestore, user]);
  
    const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);
  
    const bookedClassIds = bookings?.map(b => b.classId) || [];
  
    const handleBooking = async (classItem: any, timeSlot: 'Manhã' | 'Tarde' | 'Noite') => {
        if (!user || !firestore) {
          toast({
            variant: "destructive",
            title: t('actionRequired'),
            description: t('mustBeLoggedInToBook'),
          });
          return;
        }
        
        const classId = `${classItem.day}-${classItem.style}-${timeSlot}`;
        setBookingStatus(prev => ({...prev, [classId]: 'booking'}));

        const bookingData = {
            classId: classId,
            className: `${classItem.style} - ${timeSlot}`,
            bookedAt: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName || user.email,
        };
    
        runTransaction(firestore, async (transaction) => {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await transaction.get(userRef);
  
          if (!userDoc.exists()) {
            throw new Error("Perfil de usuário não encontrado.");
          }
  
          const currentEnergy = userDoc.data().energyBalance || 0;
          const classCost = 64; // Each class costs 64 energy credits
  
          if (currentEnergy < classCost) {
            throw new Error(t('insufficientEnergy'));
          }
  
          const newEnergyBalance = currentEnergy - classCost;
          
          transaction.update(userRef, { energyBalance: newEnergyBalance });
  
          const userBookingRef = doc(collection(firestore, 'users', user.uid, 'bookings'));
          transaction.set(userBookingRef, bookingData);

          const allBookingRef = doc(collection(firestore, 'allBookings'));
          transaction.set(allBookingRef, bookingData);
        }).then(() => {
            toast({
              title: t('bookingConfirmed'),
              description: t('youHaveBooked', { className: `${classItem.style} - ${timeSlot}` }),
            });
            setBookingStatus(prev => ({...prev, [classId]: 'booked'}));
        }).catch((error: any) => {
            setBookingStatus(prev => ({ ...prev, [classId]: 'error' }));
            
            if (error.message.includes(t('insufficientEnergy'))) {
                 toast({
                    variant: "destructive",
                    title: t('bookingError'),
                    description: error.message,
                });
                return;
            }

            const permissionError = new FirestorePermissionError({
              path: `users/${user.uid}/bookings`, 
              operation: 'create',
              requestResourceData: bookingData,
            });

            errorEmitter.emit('permission-error', permissionError);

            toast({
              variant: "destructive",
              title: t('permissionFailed'),
              description: t('noPermissionToBook'),
            });
        });
      };
  
    return (
        <section id="schedule-classes" className="py-12 md:py-24 bg-secondary">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">{t('scheduleYourClasses')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('scheduleDescription')}
                    </p>
                </div>

                <Card className="mt-12 max-w-4xl mx-auto shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">
                      {t('eventClassSchedule')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    {eventProgram['Cronograma de Aulas'].map(item => {
                        const image = item.imageId ? PlaceHolderImages.find(p => p.id === item.imageId) : null;
                        return (
                        <div key={item.form} className="p-4 bg-background/50 rounded-lg border-l-4 border-primary shadow-sm overflow-hidden">
                            <div className={`grid grid-cols-1 ${image ? 'md:grid-cols-3' : ''} gap-4`}>
                            {image && (
                                <div className="rounded-md overflow-hidden col-span-1 flex items-center justify-center">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.description || item.form}
                                    width={image.width}
                                    height={image.height}
                                    className="object-cover w-full h-auto"
                                    data-ai-hint={image.imageHint}
                                />
                                </div>
                            )}
                            <div className={image ? 'md:col-span-2' : 'md:col-span-3'}>
                                <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h5 className="font-bold text-foreground text-base">{t('style')}: {item.style}</h5>
                                    <p className="font-medium text-primary text-sm">{t('focus')}: {item.form}</p>
                                </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                {item.schedule && (
                                <p className="text-xs text-muted-foreground">
                                    <strong className="text-foreground">{t('scheduleTimes')}:</strong> {t('morning')} ({item.schedule.morning}), {t('afternoon')} ({item.schedule.afternoon}), {t('evening')} ({item.schedule.evening})
                                </p>
                                )}
                                {item.practices && 
                                <p className="text-xs text-muted-foreground mt-1">
                                    <strong className="text-foreground">{t('practices')}:</strong> {item.practices}
                                </p>
                                }
                                {item.schedule && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {Object.keys(item.schedule).map(timeSlot => {
                                        const slot = timeSlot as 'morning' | 'afternoon' | 'evening';
                                        const timeLabel = slot === 'morning' ? t('morning') : slot === 'afternoon' ? t('afternoon') : t('evening');
                                        const classId = `${item.day}-${item.style}-${timeLabel}`;
                                        const isBooked = bookedClassIds.includes(classId);
                                        const isBooking = bookingStatus[classId] === 'booking';
                                        
                                        return (
                                            <Button 
                                                key={classId}
                                                size="sm" 
                                                variant={isBooked ? "secondary" : "default"}
                                                onClick={() => handleBooking(item, timeLabel as 'Manhã' | 'Tarde' | 'Noite')}
                                                disabled={!user || isBooked || isBooking || bookingsLoading}
                                            >
                                            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isBooked ? t('booked') : `${t('book')} ${timeLabel}`}
                                            </Button>
                                        );
                                    })}
                                </div>
                                )}
                            </div>
                            </div>
                        </div>
                        )
                    })}
                  </CardContent>
                </Card>
            </div>
        </section>
    );
}
