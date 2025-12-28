
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraProgressButtonProps {
  progress: number; // 0-100
  onClick: () => void;
  isCapturing: boolean;
}

export function CameraProgressButton({ progress, onClick, isCapturing }: CameraProgressButtonProps) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-12 h-12">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44">
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
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                onClick={onClick}
                disabled={isCapturing}
                aria-label="Capture a moment"
            >
                <Camera className="h-5 w-5" />
            </Button>
        </div>
    );
}
