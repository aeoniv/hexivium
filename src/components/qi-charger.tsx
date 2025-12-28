
'use client';

import * as React from 'react';
import { useAgentStore } from '@/hooks/use-agent-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QiCharger() {
  const { chargeQi, qi } = useAgentStore();
  const { toast } = useToast();
  const [micLevel, setMicLevel] = React.useState(0);
  const [isCharging, setIsCharging] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);

  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animationFrameRef = React.useRef<number>();

  const QI_CHARGE_THRESHOLD = 50; // out of 100
  const QI_CHARGE_INTERVAL = 2000; // ms

  const lastChargeTimeRef = React.useRef(0);

  const startMonitoring = React.useCallback(async () => {
    if (isCharging || hasPermission === false) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const level = (average / 128) * 100;
        setMicLevel(level);

        if (level > QI_CHARGE_THRESHOLD && Date.now() - lastChargeTimeRef.current > QI_CHARGE_INTERVAL) {
          if (qi < 3) {
            chargeQi();
            lastChargeTimeRef.current = Date.now();
            toast({
              title: "Qi Charged!",
              description: "Your breath has replenished your Qi.",
            });
          }
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
      setIsCharging(true);
      setHasPermission(true);

    } catch (err) {
      console.error("Microphone access denied:", err);
      setHasPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please enable microphone permissions in your browser settings to charge Qi.",
      });
    }
  }, [isCharging, hasPermission, chargeQi, toast, qi]);

  const stopMonitoring = React.useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsCharging(false);
    setMicLevel(0);
  }, []);

  const toggleMonitoring = () => {
    if (isCharging) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };

  React.useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (micLevel / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44" >
         <circle
           className="text-border"
           stroke="currentColor"
           strokeWidth="2"
           fill="transparent"
           r={radius}
           cx="22"
           cy="22"
         />
         <circle
           className="text-primary transition-all duration-300"
           stroke="currentColor"
           strokeWidth="2"
           strokeDasharray={circumference}
           strokeDashoffset={offset}
           strokeLinecap="round"
           fill="transparent"
           r={radius}
           cx="22"
           cy="22"
           style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
         />
       </svg>
       <Button 
         variant={isCharging ? "outline" : "ghost"} 
         size="icon" 
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
         onClick={toggleMonitoring}
         disabled={hasPermission === false}
         aria-label={isCharging ? "Stop charging Qi" : "Start charging Qi"}
       >
         {isCharging ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
       </Button>
    </div>
  );
}
