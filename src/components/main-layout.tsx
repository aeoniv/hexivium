
'use client';

import { useState, useEffect } from 'react';
import { FloatingNav } from '@/components/floating-nav';
import { useGlobal } from '@/contexts/global-state-context';
import { GlobalCameraModal } from './global-camera-modal';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { getDocWithRetry, isBrowserOnline } from '@/lib/firestore-utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    mode, setMode,
    transitionTime, setTransitionTime,
    autoSequenceName, setAutoSequenceName,
    sunHexagramId,
    sunActiveLine,
    highlightMode, setHighlightMode,
  } = useGlobal();

  const { user } = useUser();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [lastCaptureTime, setLastCaptureTime] = useState<number | null>(null);

  const { toast } = useToast();
  const db = useFirestore();
  const storage = useStorage();

  useEffect(() => {
    if (!user || !db) return;
    let cancelled = false;
    (async () => {
      if (!isBrowserOnline()) {
        console.warn('[MainLayout] Browser reported offline before initial lastCaptureAt fetch');
        return;
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
        console.warn('[MainLayout] Failed to fetch lastCaptureAt', { code: err?.code, message: err?.message });
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
      await updateDoc(userRef, { lastCaptureAt: newCaptureTime });
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
      <FloatingNav
          user={user}
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
        />
      {children}
      <GlobalCameraModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
        isCapturing={isCapturing}
      />
    </>
  );
}
