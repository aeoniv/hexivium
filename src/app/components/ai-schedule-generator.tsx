'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Gift, BookOpen, Zap, Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { useFirestore } from '@/firebase/client-provider';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

export default function AiScheduleGenerator() {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const benefits = [
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: t('freeClassBenefitTitle'),
      description: t('freeClassBenefitDesc'),
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: t('onlineCoursesBenefitTitle'),
      description: t('onlineCoursesBenefitDesc'),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t('energyPointsBenefitTitle'),
      description: t('energyPointsBenefitDesc'),
    }
  ];

  const emailSchema = z.string().email({ message: t('invalidEmail') });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: t('validationErrorTitle'),
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);
    
    const leadData = {
      email: email,
      createdAt: serverTimestamp(),
    };

    try {
      addDoc(collection(firestore, 'leads'), leadData)
      .then(() => {
        toast({
          title: t('leadSuccessTitle'),
          description: t('leadSuccessDescription'),
        });
        router.push('/signup');
      })
      .catch((error) => {
        console.error("Error adding lead: ", error);
        const permissionError = new FirestorePermissionError({
          path: 'leads',
          operation: 'create',
          requestResourceData: leadData,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        toast({
          variant: "destructive",
          title: t('leadErrorTitle'),
          description: t('leadErrorDescription'),
        });
        setIsLoading(false);
      });
    } catch (e) {
      // This catch block is for any synchronous error that might occur before the promise runs, although unlikely.
      console.error("Synchronous error during lead submission: ", e);
       toast({
        variant: "destructive",
        title: t('leadErrorTitle'),
        description: t('leadErrorDescription'),
      });
      setIsLoading(false);
    }
  };


  return (
    <section id="schedule" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-6xl mx-auto shadow-xl border-primary border-t-4 overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="font-headline text-3xl md:text-4xl">
                         {t('getAFreeClass')}
                        </CardTitle>
                        <CardDescription className="text-lg">
                         {t('freeClassDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className='text-muted-foreground mb-6'>{t('freeClassSubDescription')}</p>
                        <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2">
                          <Input 
                            type="email"
                            placeholder={t('yourEmail')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-grow"
                          />
                          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('signUpAndGetClass')}
                          </Button>
                        </form>
                    </CardContent>
                </div>
                <div className="bg-background/50 p-8 md:p-12 border-t md:border-t-0 md:border-l border-border/50">
                    <h3 className="font-headline text-2xl mb-6">{t('yourBenefits')}</h3>
                    <ul className="space-y-6">
                        {benefits.map(benefit => (
                            <li key={benefit.title} className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full mt-1">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-foreground">{benefit.title}</h4>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
