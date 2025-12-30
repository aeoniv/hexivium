'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

export default function PhasesSection() {
  const { t } = useTranslation();

  const phases = [
    {
      title: t('littleDragonTitle'),
      subtitle: t('littleDragonSubtitle'),
      description: t('littleDragonDescription'),
      imageId: 'kids-phase',
    },
    {
      title: t('warriorJourneyTitle'),
      subtitle: t('warriorJourneySubtitle'),
      description: t('warriorJourneyDescription'),
      imageId: 'martial-artists-phase',
    },
    {
      title: t('pathOfHarmonyTitle'),
      subtitle: t('pathOfHarmonySubtitle'),
      description: t('pathOfHarmonyDescription'),
      imageId: 'seniors-phase',
    },
  ];

  return (
    <section id="phases" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            {t('threeJourneysOnePath')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('phasesSectionDescription')}
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {phases.map((phase) => {
            const image = PlaceHolderImages.find((p) => p.id === phase.imageId);
            return (
              <Card key={phase.title} className="overflow-hidden shadow-lg border-accent border-t-4 flex flex-col">
                <div>
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={image.width}
                        height={image.height}
                        className="object-cover w-full h-auto"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline text-2xl font-bold text-accent">{phase.subtitle}</h3>
                    <h4 className="font-headline text-xl font-bold text-foreground mb-2">{phase.title}</h4>
                    <p className="text-muted-foreground mb-4 flex-grow">{phase.description}</p>
                     <Link href="#schedule" passHref>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-auto">
                            {t('seePlans')}
                        </Button>
                     </Link>
                  </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
