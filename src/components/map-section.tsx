
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Info, Bell } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

type NewsUpdate = {
  title: string;
  description: string;
  time: string;
};

const updates: NewsUpdate[] = [];

export default function MapSection() {
    const { t } = useTranslation();
    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.213569102484!2d-34.82736102579044!3d-7.101258669584346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7acdd46898433939%3A0x1e66205b55eda840!2sAv.%20Ant%C3%B4nio%20Lira%2C%20314%20-%20Tamba%C3%BA%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058039-050%2C%20Brazil!5e0!3m2!1sen!2sus!4v1700000000000";

    return (
        <section id="map" className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                        {t('locationAndUpdates')}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('mapSectionDescription')}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                        <p className="font-bold">{t('locationAddress')}</p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 lg:gap-12">
                    <div>
                        <Card className="shadow-lg h-full">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <MapPin className="w-6 h-6 text-primary" />
                                <CardTitle className="font-headline">{t('interactiveMap')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                    <iframe
                                        src={googleMapsEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={t('interactiveMap')}
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="shadow-lg h-full">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Bell className="w-6 h-6 text-primary" />
                                <CardTitle className="font-headline">{t('noticeBoard')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {updates.length > 0 ? (
                                    updates.map(update => (
                                        <Alert key={update.title}>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>{update.title}</AlertTitle>
                                            <AlertDescription>
                                                {update.description}
                                                <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                                            </AlertDescription>
                                        </Alert>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>{t('noUpdates')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
