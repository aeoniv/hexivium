

'use client';

import { useState, useEffect } from 'react';
import { FloatingMenu } from './floating-menu';
import { useGlobal } from '@/contexts/global-state-context';
import { FloatingAgent } from './floating-agent';
import { GlobalCameraModal } from './global-camera-modal';
import { useUser } from '@/lib/auth';
import { useAuth } from '@/firebase/client-provider';
import { ref, uploadString } from "firebase/storage";
import { useStorage, useFirestore } from '@/firebase/client-provider';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { getDocWithRetry, isBrowserOnline } from '@/lib/firestore-utils';


export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const {
    mode, setMode,
    transitionTime, setTransitionTime,
    autoSequenceName, setAutoSequenceName,
    sunHexagramId,
    sunActiveLine,
    highlightMode, setHighlightMode,
  } = useGlobal();

  const [hasMounted, setHasMounted] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [lastCaptureTime, setLastCaptureTime] = useState<number | null>(null);

  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const user = useUser(auth);

  useEffect(() => {
    setHasMounted(true);
    let cancelled = false;
    (async () => {
      if (!user) return;
      if (!isBrowserOnline()) {
        console.warn('[GlobalLayout] Browser reported offline before initial lastCaptureAt fetch');
        return; // Let user actions trigger later retry implicitly.
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDocWithRetry(userRef, { retries: 2 });
        if (!cancelled && docSnap.exists()) {
          const data = docSnap.data();
          if ((data as any).lastCaptureAt) {
            setLastCaptureTime((data as any).lastCaptureAt);
          }
        }
      } catch (err: any) {
        console.warn('[GlobalLayout] Failed to fetch lastCaptureAt', { code: err?.code, message: err?.message });
      }
    })();
    return () => { cancelled = true; };
  }, [user, db]);

  useEffect(() => {
    if (lastCaptureTime === null) {
      setCaptureProgress(0);
      return;
    }
    const timer = setInterval(() => {
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const elapsed = Date.now() - lastCaptureTime;
      const progress = Math.max(0, 100 - (elapsed / twentyFourHours) * 100);
      setCaptureProgress(progress);

      if (progress <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastCaptureTime]);

  const handleCapture = async (dataUrl: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to save captures.",
      });
      return;
    }

    setIsCapturing(true);
    toast({ title: "Uploading...", description: "Your capture is being saved." });

    try {
      const newCaptureTime = Date.now();
      const storageRef = ref(storage, `users/${user.uid}/general_captures/${newCaptureTime}.jpg`);
      await uploadString(storageRef, dataUrl, 'data_url');

      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, { lastCaptureAt: newCaptureTime });
      } catch (err: any) {
        console.warn('[GlobalLayout] updateDoc(lastCaptureAt) failed', { code: err?.code, message: err?.message });
        throw err; // Let outer catch show toast.
      }

      setLastCaptureTime(newCaptureTime);

      toast({
        title: "Capture Saved!",
        description: "Your 24-hour cycle has reset.",
      });
    } catch (error) {
      console.error("Error saving capture:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your capture.",
      });
    } finally {
        setIsCapturing(false);
        setIsCameraOpen(false);
    }
  };


  return (
    <>
      {hasMounted && (
        <FloatingMenu
            mode={mode}
            setMode={setMode}
            transitionTime={transitionTime}
            setTransitionTime={setTransitionTime}
            autoSequenceName={autoSequenceName}
              setAutoSequenceName={setAutoSequenceName}
            sunHexagramId={sunHexagramId}
            sunActiveLine={sunActiveLine}
            highlightMode={highlightMode}
            setHighlightMode={setHighlightMode}
            onCameraClick={() => setIsCameraOpen(true)}
            isCapturing={isCapturing}
            captureProgress={captureProgress}
        />
      )}
      {children}
      <FloatingAgent />
      <GlobalCameraModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
        isCapturing={isCapturing}
      />
    </>
  );
}
