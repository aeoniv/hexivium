
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Loader2 } from 'lucide-react';

interface GlobalCameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (dataUrl: string) => Promise<void>;
    isCapturing: boolean;
}

export function GlobalCameraModal({ isOpen, onClose, onCapture, isCapturing }: GlobalCameraModalProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
    const [stream, setStream] = React.useState<MediaStream | null>(null);

    React.useEffect(() => {
        const getCameraPermission = async () => {
            if (isOpen) {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    setHasCameraPermission(true);
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                }
            } else {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
            }
        };

        getCameraPermission();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    React.useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleCaptureClick = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                await onCapture(dataUrl);
            }
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Capture Moment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Alert variant="destructive" className="max-w-sm">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please enable camera permissions in your browser.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                         {hasCameraPermission === null && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                         )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCaptureClick} disabled={!hasCameraPermission || isCapturing}>
                        {isCapturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                        {isCapturing ? 'Saving...' : 'Capture Photo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
