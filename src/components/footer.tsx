
'use client';

import Link from 'next/link';
import { Instagram, Facebook, MapPin } from 'lucide-react';
import DragonflyMantisIcon from './icons/dragonfly-mantis-icon';
import { useTranslation } from '@/context/language-context';

// Custom WhatsApp icon as SVG component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export default function Footer() {
  const { t } = useTranslation();

  const shareLinks = {
    whatsapp: `https://wa.me/351962746631`,
    facebook: 'https://www.facebook.com/vinicius.de.moraes.nascimento',
    instagram: 'https://www.instagram.com/shi.heng.yongyi',
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto py-12 px-4 md:px-6 grid md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold mb-4" prefetch={false}>
            <DragonflyMantisIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-lg">Dragonfly Mantis 蜻蜓螳螂</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {t('bodyMindSpirit')}
            <br />
            {t('eventDates')}
          </p>
           <div className="flex items-start gap-2 mt-4 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                <span>{t('locationAddress')}</span>
            </div>
        </div>
        <div>
          <h3 className="font-headline text-lg mb-4">{t('navigate')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#about" className="hover:text-primary transition-colors">{t('theProgram')}</Link></li>
            <li><Link href="#mentor" className="hover:text-primary transition-colors">{t('mentor')}</Link></li>
            <li><Link href="#schedule" className="hover:text-primary transition-colors">{t('yourJourney')}</Link></li>
            <li><Link href="#pricing" className="hover:text-primary transition-colors">{t('tickets')}</Link></li>
            <li><Link href="#faq" className="hovertext-primary transition-colors">FAQ</Link></li>
            <li><Link href="#volunteer" className="hover:text-primary transition-colors">{t('volunteering')}</Link></li>
            <li><Link href="#hosting" className="hover:text-primary transition-colors">{t('hosting')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-lg mb-4">{t('followTheJourney')}</h3>
          <div className="flex space-x-4">
             <a 
                href={shareLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Nosso Facebook"
             >
                <Facebook />
            </a>
            <a 
                href={shareLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Entre em contato no WhatsApp"
            >
                <WhatsAppIcon />
            </a>
            <a 
                href={shareLinks.instagram} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Nosso Instagram"
            >
                <Instagram />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('questions')} <a href="mailto:shi.heng.yong.yi@gmail.com" className="underline hover:text-primary">shi.heng.yong.yi@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          {t('allRightsReserved', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
