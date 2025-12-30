'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BedDouble, Waves } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export default function LocationSection() {
  const { t } = useTranslation();

  const locations = [
    {
      id: 'hostel',
      title: t('yoloHostelTitle'),
      description: t('yoloHostelDescription'),
      imageIds: ['hostel-1', 'hostel-2', 'hostel-3'],
      icon: <BedDouble className="h-8 w-8 text-primary" />,
    },
    {
      id: 'beach',
      title: t('tambuBeachTitle'),
      description: t('tambuBeachDescription'),
      imageIds: ['map-location'],
      icon: <Waves className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section id="location" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            {t('accommodationAndPracticeLocations')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('locationDescription')}
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {locations.map((location) => {
            const images = location.imageIds.map(id => PlaceHolderImages.find((p) => p.id === id)).filter(Boolean);
            return (
              <Card key={location.id} className="shadow-lg overflow-hidden">
                {images.length > 1 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        image && (
                        <CarouselItem key={index}>
                          <div className="flex items-center justify-center">
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              width={image.width}
                              height={image.height}
                              className="object-cover w-full h-auto"
                              data-ai-hint={image.imageHint}
                            />
                          </div>
                        </CarouselItem>
                        )
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                ) : (
                  images[0] && (
                  <div className="flex items-center justify-center">
                    <Image
                      src={images[0].imageUrl}
                      alt={images[0].description}
                      width={images[0].width}
                      height={images[0].height}
                      className="object-cover w-full h-auto"
                      data-ai-hint={images[0].imageHint}
                    />
                  </div>
                  )
                )}
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        {location.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">{location.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{location.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
