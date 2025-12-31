
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';

export default function Hero() {
  const { t } = useTranslation();
  const videoUrl = "https://www.dropbox.com/scl/fi/5nvthf2gxsx8kcv8negez/dragonlordsofficial_2403860e6d7e48f7b41cc284ca72faa0.mp4?rlkey=o8k57a40onqhnlpuvvdusmvyy&raw=1";

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        {t('awakenTheInnerDragon')}
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="relative z-10 text-center px-4 -mt-16">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-shadow-lg">
          {t('awakenTheInnerDragon')}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-amber-50">
          {t('summerKungFuCamp')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#schedule" passHref>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold w-full sm:w-auto">
              {t('getYourSpot')}
            </Button>
          </Link>
          <Link href="#about" passHref>
            <Button size="lg" variant="outline" className="text-lg font-bold w-full sm:w-auto">
              {t('learnMore')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
