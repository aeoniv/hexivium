
'use client';

import { useState, useCallback, useRef } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied';

interface MotionData {
  x: number | null;
  y: number | null;
  z: number | null;
}

// Type guard to check for the specific permission request method
const isIOSDeviceMotionEvent = (
  event: any
): event is typeof DeviceMotionEvent & {
  requestPermission: () => Promise<PermissionState>;
} => {
  return typeof (event as any).requestPermission === 'function';
};


export const useAccelerometer = () => {
  const [data, setData] = useState<MotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const isListening = useRef(false);

  const handleMotionEvent = useCallback((event: DeviceMotionEvent) => {
    if (event.accelerationIncludingGravity) {
      setData({
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z,
      });
    } else {
        setError("Device motion data is not available.");
    }
  }, []);

  const start = useCallback(() => {
    if (isListening.current || permissionState !== 'granted') {
      return;
    }
    window.addEventListener('devicemotion', handleMotionEvent, true);
    isListening.current = true;
  }, [permissionState, handleMotionEvent]);

  const stop = useCallback(() => {
    if (!isListening.current) {
      return;
    }
    window.removeEventListener('devicemotion', handleMotionEvent, true);
    isListening.current = false;
  }, [handleMotionEvent]);
  
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    // For iOS 13+ devices
    if (isIOSDeviceMotionEvent(DeviceMotionEvent)) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionState('granted');
          return true;
        } else {
          setPermissionState('denied');
          setError('Permission to access motion sensors was denied.');
          return false;
        }
      } catch (e) {
        setError('Error requesting motion sensor permission.');
        console.error(e);
        return false;
      }
    } else {
      // For other devices, permission is often granted by default or handled differently
      setPermissionState('granted');
      return true;
    }
  }, []);


  return { data, error, permissionState, requestPermission, start, stop };
};
