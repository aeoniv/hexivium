'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Handshake } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export default function VolunteerSection() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const volunteerEmail = "shi.heng.yong.yi@gmail.com";
  const emailSubject = t('volunteerMessagePlaceholder');

  const generateMailtoLink = () => {
    const body = `Olá,
    
Gostaria de me candidatar para ser voluntário no evento.

Nome: ${name}

Mensagem:
${message}
`;
    return `mailto:${volunteerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="volunteer" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-4xl mx-auto shadow-xl border-primary border-t-4">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Handshake className="h-8 w-8 text-primary" />
              {t('joinOurTeam')}
            </CardTitle>
            <CardDescription>
              {t('volunteerDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="volunteer-name">{t('fullName')}</Label>
              <Input 
                id="volunteer-name"
                placeholder={t('yourName')}
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volunteer-message">{t('yourMessage')}</Label>
              <Textarea 
                id="volunteer-message"
                placeholder={t('volunteerMessagePlaceholder')}
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
              <Button disabled={!name || !message} className="w-full md:w-auto">
                {t('sendApplicationEmail')}
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
