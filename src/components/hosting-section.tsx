
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BedDouble } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export default function HostingSection() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const volunteerEmail = "shi.heng.yong.yi@gmail.com";
  const emailSubject = t('bookYourStay');

  const generateMailtoLink = () => {
    const body = `Olá,
    
Gostaria de saber mais sobre a hospedagem no evento.

Nome: ${name}

Mensagem:
${message}
`;
    return `mailto:${volunteerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="hosting" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-4xl mx-auto shadow-xl border-accent border-t-4">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <BedDouble className="h-8 w-8 text-accent" />
              {t('bookYourStay')}
            </CardTitle>
            <CardDescription>
              {t('hostingBookingDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hosting-name">{t('fullName')}</Label>
              <Input 
                id="hosting-name"
                placeholder={t('yourName')}
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hosting-message">{t('yourMessage')}</Label>
              <Textarea 
                id="hosting-message"
                placeholder={t('hostingMessagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </CardContent>
          <CardContent>
            <a
              href={generateMailtoLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button disabled={!name || !message} className="w-full md:w-auto" variant="outline">
                {t('sendBookingEmail')}
              </Button>
            </a>
            {!name || !message ? (
                <p className="text-xs text-muted-foreground mt-2">
                    {t('fillToEnable')}
                </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
