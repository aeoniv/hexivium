'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

const journeyImages = [
    PlaceHolderImages.find(p => p.id === 'practice-china'),
    PlaceHolderImages.find(p => p.id === 'practice-thailand'),
    PlaceHolderImages.find(p => p.id === 'practice-japan'),
].filter(Boolean);


export default function MentorSection() {
  const { t } = useTranslation();
  const profileImage = PlaceHolderImages.find(p => p.id === 'mentor-profile');

  return (
    <section id="mentor" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">{t('meetYourMentor')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('mentorSectionDescription')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-1">
            <Card className="p-6 text-center sticky top-24 shadow-lg">
              {profileImage && (
                <Image
                  src={profileImage.imageUrl}
                  alt={profileImage.description}
                  width={profileImage.width}
                  height={profileImage.height}
                  className="rounded-full mx-auto border-4 border-primary"
                  data-ai-hint={profileImage.imageHint}
                />
              )}
              <h3 className="font-headline text-2xl mt-4">{t('mentorName')}</h3>
              <p className="text-muted-foreground">{t('mentorTitle')}</p>
              <div className="text-left space-y-2 mt-6 text-sm">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> shi.heng.yong.yi@gmail.com</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +351 962 746 631</p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-xl">{t('biographyAndJourney')}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4 text-muted-foreground">
                  <p>{t('biographyContent1')}</p>
                  <p>{t('biographyContent2')}</p>
                  <p>{t('biographyContent3')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {journeyImages.map((image, index) => (
                      image && <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
                        <Image src={image.imageUrl} alt={image.description} width={image.width} height={image.height} className="object-cover w-full h-full" data-ai-hint={image.imageHint} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-headline text-xl">{t('philosophyAndMethodology')}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4 text-muted-foreground">
                    <p>{t('philosophyContent1')}</p>
                    <p>{t('philosophyContent2')}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
