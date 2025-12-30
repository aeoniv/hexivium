'use client';

import React, { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { getOrInitializeApp } from '@/lib/firebase';
import type { FirebaseApp } from 'firebase/app';
import { Loader2 } from 'lucide-react';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// This is the core provider that initializes Firebase.
function FirebaseProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<FirebaseContextType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const app = getOrInitializeApp();
      if (!app) {
        throw new Error("Firebase initialization failed on the client.");
      }
      
      const auth = getAuth(app);
      // Use initializeFirestore for more robust setup options
      const db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
      const storage = getStorage(app);
      
      setServices({ app, auth, db, storage });
    } catch (e: any) {
        console.error("Firebase Provider Error:", e);
        setError(e.message || "Failed to initialize Firebase services.");
    }
  }, []);

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
                <h1 className="text-lg font-bold text-destructive">Firebase Error</h1>
                <p className="text-destructive/80">{error}</p>
            </div>
        </div>
    );
  }

  if (!services) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    );
  }
  
  return (
    <FirebaseContext.Provider value={services}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

// This is the component to use in your layout.
// It wraps the actual provider and ensures it only renders on the client.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
             <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return <FirebaseProvider>{children}</FirebaseProvider>
}


export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
    const { auth } = useFirebase();
    if (!auth) {
        throw new Error('Firebase Auth is not available. Make sure you are using FirebaseProvider.');
    }
    return auth;
}

export const useFirestore = (): Firestore => {
    const { db } = useFirebase();
    if (!db) {
        throw new Error('Firestore is not available. Make sure you are using FirebaseProvider.');
    }
    return db;
}

export const useStorage = (): FirebaseStorage => {
    const { storage } = useFirebase();
    if (!storage) {
        throw new Error('Firebase Storage is not available. Make sure you are using FirebaseProvider.');
    }
    return storage;
}
