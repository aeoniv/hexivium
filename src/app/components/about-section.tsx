'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Heart, BrainCircuit } from "lucide-react"
import { useTranslation } from "@/context/language-context";

export default function AboutSection() {
    const { t } = useTranslation();

    const pillars = [
        {
            icon: <Zap className="h-8 w-8 text-primary" />,
            title: t('bodyPillarTitle'),
            description: t('bodyPillarDescription')
        },
        {
            icon: <BrainCircuit className="h-8 w-8 text-primary" />,
            title: t('mindPillarTitle'),
            description: t('mindPillarDescription')
        },
        {
            icon: <Heart className="h-8 w-8 text-primary" />,
            title: t('spiritPillarTitle'),
            description: t('spiritPillarDescription')
        }
    ]

    return (
        <section id="about" className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                        {t('aJourneyOfBalance')}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('aboutSectionDescription')}
                    </p>
                    <div className="mt-6 border-t border-b border-primary/20 py-6">
                         <p className="text-lg text-foreground italic">
                           {t('aboutSectionQuote')}
                        </p>
                    </div>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {pillars.map((pillar) => (
                        <Card key={pillar.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary bg-card">
                            <CardHeader className="items-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    {pillar.icon}
                                </div>
                                <CardTitle className="font-headline text-2xl mt-4">{pillar.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{pillar.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
