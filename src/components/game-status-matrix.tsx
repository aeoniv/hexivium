

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Clock, Zap, Coins, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAgentStore } from '@/hooks/use-agent-store';
import { QiCharger } from '@/components/qi-charger';

const ResourceMeter = ({ label, value, Icon }: { label: string; value: number; Icon: React.ElementType }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 font-semibold text-sm text-muted-foreground">{label}</div>
            <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                    <Icon
                        key={i}
                        className={`h-5 w-5 transition-colors duration-300 ${i < value ? 'text-primary' : 'text-muted-foreground/30'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const TimeDisplay = ({ remainingTime }: { remainingTime: number }) => {
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return (
        <div className="text-center font-mono text-xs text-muted-foreground">
            <span>Time Remaining: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
    );
}

export function GameStatusMatrix() {
    const { qi, jing, gameStartedAt, consultingInterval, decreaseJing } = useAgentStore();
    const [shen, setShen] = useState(3);
    const [remainingTime, setRemainingTime] = useState(24 * 60 * 60 * 1000);
    const prevShenRef = React.useRef(shen);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (gameStartedAt) {
            const updateTimer = () => {
                const now = Date.now();
                const elapsed = now - gameStartedAt;
                const twentyFourHours = 24 * 60 * 60 * 1000;
                const newRemainingTime = Math.max(0, twentyFourHours - elapsed);
                setRemainingTime(newRemainingTime);

                const hoursLeft = newRemainingTime / (1000 * 60 * 60);
                
                let newShen;
                if (hoursLeft <= 0) {
                    newShen = 0;
                } else if (hoursLeft <= 8) {
                    newShen = 1;
                } else if (hoursLeft <= 16) {
                    newShen = 2;
                } else {
                    newShen = 3;
                }
                setShen(newShen);

                if (newRemainingTime <= 0 && interval) {
                     clearInterval(interval);
                }
            };

            updateTimer(); // Initial call
            interval = setInterval(updateTimer, 1000);

        } else {
            setShen(3);
            setRemainingTime(24 * 60 * 60 * 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameStartedAt]);
    
    useEffect(() => {
        if (prevShenRef.current > 0 && shen === 0) {
            decreaseJing();
        }
        prevShenRef.current = shen;
    }, [shen, decreaseJing]);

    return (
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 space-y-3">
                <div className="space-y-1">
                    <ResourceMeter label="Shen" value={shen} Icon={Clock} />
                    <div className="pl-16">
                        <div className="text-xs text-muted-foreground font-mono">{gameStartedAt ? <TimeDisplay remainingTime={remainingTime}/> : "Timer starts on click"}</div>
                    </div>
                </div>
                <div className="space-y-1">
                    <ResourceMeter label="Qi" value={qi} Icon={Zap} />
                    <div className="pl-16">
                        <p className="text-xs text-muted-foreground font-mono">Chances: {consultingInterval}/6</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <ResourceMeter label="Jing" value={jing} Icon={Coins} />
                    <div className="pl-16">
                        <p className="text-xs text-muted-foreground font-mono">Collect all aspect gates to gain Jing</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
