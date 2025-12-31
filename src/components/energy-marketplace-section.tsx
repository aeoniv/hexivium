
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2, BedDouble, Handshake } from 'lucide-react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

const STRIPE_PUBLISHABLE_KEY = "pk_live_51S1xAcJm83RIAXZGuddidzXYX0mRBm5bFDpFhjWcfW2PAhyfkkskpMCLw0rmv45Sl1yb9Zm8kPp449mpIY2D0TTn005ZFH6VD6";

export default function EnergyMarketplaceSection() {
    const { t } = useTranslation();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

    const energyPacks = [
      {
        name: t('initialBoost'),
        price: 64,
        energy: 1,
        description: t('creditFor1Class'),
        features: [t('1EnergyCredit'), t('validForAnyClass'), t('idealForStarting')],
        isPopular: false,
        priceId: 'price_1Sg4EJJm83RIAXZGJ3sPZ2z6',
      },
      {
        name: t('intermediatePack'),
        price: 128,
        energy: 3,
        description: t('creditsFor3Classes'),
        features: [
          t('3EnergyCredits'),
          t('flexibilityForOneDay'),
          t('goodForDeepening'),
        ],
        isPopular: true,
        priceId: 'price_1Sg4G3Jm83RIAXZGGQYf600C',
      },
      {
        name: t('completeJourney'),
        price: 256,
        energy: 9,
        description: t('fullAccessTo3Days'),
        features: [
          t('9EnergyCredits'),
          t('accessToAllClasses'),
          t('humanDesignProfileReading'),
          t('guidedMeditationSessions'),
        ],
        isPopular: false,
        priceId: 'price_1Sg4IBJm83RIAXZGAMaTcRms',
      },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        }).format(price);
    };

    const handleCheckout = (priceId: string) => {
      if (!user || !firestore) {
        toast({
          variant: 'destructive',
          title: t('loginTitle'),
          description: t('loginToBuy'),
        });
        return;
      }
    
      setLoadingPriceId(priceId);
    
      const checkoutSessionData = {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
        mode: 'payment',
        client_reference_id: user.uid,
      };

      addDoc(
        collection(firestore, 'customers', user.uid, 'checkout_sessions'),
        checkoutSessionData
      ).then(checkoutSessionRef => {
        const timeout = setTimeout(() => {
            unsubscribe();
            setLoadingPriceId(null);
            toast({
              variant: "destructive",
              title: "Timeout de Pagamento",
              description: "A resposta do Stripe demorou muito. Tente novamente.",
            });
          }, 20000); // 20 seconds timeout
      
          const unsubscribe = onSnapshot(checkoutSessionRef, async (snap) => {
            const { error, sessionId } = snap.data() || {};
            
            if (error) {
              clearTimeout(timeout);
              unsubscribe();
              setLoadingPriceId(null); // Stop loading on error
              toast({
                variant: 'destructive',
                title: 'Erro ao Iniciar Pagamento',
                description: error.message,
              });
              return;
            }
      
            if (sessionId) {
              clearTimeout(timeout);
              unsubscribe();
              const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
              if (!stripe) {
                setLoadingPriceId(null);
                toast({
                  variant: 'destructive',
                  title: 'Erro de Configuração',
                  description: 'Stripe.js não pôde ser carregado.',
                });
                return;
              }
              await stripe.redirectToCheckout({ sessionId });
            }
          });
      })
      .catch((error) => {
          setLoadingPriceId(null);
          const permissionError = new FirestorePermissionError({
            path: `customers/${user.uid}/checkout_sessions`,
            operation: 'create',
            requestResourceData: checkoutSessionData,
          });
          errorEmitter.emit('permission-error', permissionError);
          
          toast({
            variant: "destructive",
            title: t('permissionFailed'),
            description: "Você não tem permissão para iniciar uma compra. Contate o suporte.",
          });
      });
    };


  return (
    <section id="pricing" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            {t('rechargeYourEnergy')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('energyMarketplaceDescription')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch max-w-md mx-auto md:max-w-none">
          {energyPacks.map(pack => {
            const isLoading = loadingPriceId === pack.priceId;
            
            return (
              <Card
                key={pack.name}
                className={`shadow-lg flex flex-col relative bg-card ${
                  pack.isPopular ? 'border-2 border-primary lg:scale-105' : 'border-border'
                }`}
              >
                {pack.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {t('mostPopular')}
                  </div>
                )}
                <CardHeader className="text-center pt-10 pb-6">
                  <CardTitle className="font-headline text-2xl h-14 flex items-center justify-center">
                    {pack.name}
                  </CardTitle>
                  <p className="text-4xl font-bold pt-2 text-primary">{formatPrice(pack.price)}</p>
                  <CardDescription className="pt-2 h-10">{pack.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {pack.features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col items-center mt-auto p-6">
                   <Button 
                    onClick={() => handleCheckout(pack.priceId)}
                    disabled={isLoading || !user}
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('buyNow')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 max-w-4xl mx-auto items-center">
             <Card className="shadow-lg flex flex-col md:flex-row relative bg-card border-accent border-2">
                <CardHeader className="text-center p-6 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="bg-accent/10 p-4 rounded-full mb-4">
                        <BedDouble className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{t('hostelAccommodation')}</CardTitle>
                     <p className="text-4xl font-bold pt-2 text-accent">R$ 64</p>
                    <CardDescription>{t('perNight')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:w-2/3">
                  <p className="text-muted-foreground mb-4">
                    {t('hostingDescription')}
                  </p>
                  <p className="text-muted-foreground font-semibold mb-6">
                    {t('directBookingInfo')}
                  </p>
                   <Link href="#hosting" passHref>
                        <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                            <Handshake className="mr-2" />
                            {t('iWantToStay')}
                        </Button>
                   </Link>
                </CardContent>
            </Card>
        </div>


        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            {t('securePaymentNotice')}
          </p>
           {!user && <p>{t('loginToBuy')}</p>}
        </div>
      </div>
    </section>
  );
}
