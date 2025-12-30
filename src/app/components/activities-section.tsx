'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import KungFuIcon from './icons/kung-fu-icon';
import MedicineIcon from './icons/medicine-icon';
import IChingIcon from './icons/i-ching-icon';
import { useTranslation } from '@/context/language-context';

export default function ActivitiesSection() {
  const { t } = useTranslation();

  const activities = [
    {
      id: 'kung-fu',
      title: t('shaolinKungFuTitle'),
      description: t('shaolinKungFuDescription'),
      imageId: 'kung-fu-activity',
      icon: <KungFuIcon className="h-8 w-8 text-accent" />,
    },
    {
      id: 'medicine',
      title: t('chineseMedicineTitle'),
      description: t('chineseMedicineDescription'),
      imageId: 'medicine-activity',
      icon: <MedicineIcon className="h-8 w-8 text-accent" />,
    },
    {
      id: 'i-ching',
      title: t('wisdomOfIChingTitle'),
      description: t('wisdomOfIChingDescription'),
      imageId: 'iching-activity',
      icon: <IChingIcon className="h-8 w-8 text-accent" />,
    },
  ];
  return (
    <section id="activities" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            {t('pillarsOfYourTransformation')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('activitiesSectionDescription')}
          </p>
        </div>
        <div className="mt-12 space-y-12">
          {activities.map((activity, index) => {
            const image = PlaceHolderImages.find((p) => p.id === activity.imageId);
            const isReversed = index % 2 !== 0;
            return (
              <Card key={activity.id} className="overflow-hidden shadow-lg border-accent border-t-4 md:border-t-0 md:border-l-4">
                <div className={`grid md:grid-cols-2 items-center`}>
                  <div className={`flex items-center justify-center ${isReversed ? 'md:order-2' : ''}`}>
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
                  <div className={`p-8 md:p-12 ${isReversed ? 'md:order-1' : ''}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-accent/10 rounded-full">
                        {activity.icon}
                      </div>
                      <CardTitle className="font-headline text-3xl text-foreground">
                        {activity.title}
                      </CardTitle>
                    </div>
                    <p className="text-muted-foreground text-lg">{activity.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
