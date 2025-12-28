
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

let app: FirebaseApp | null = null;

export function getOrInitializeApp(): FirebaseApp | null {
    if (typeof window === 'undefined') {
        // On the server, we don't initialize the client app.
        // Server-side logic should use the Admin SDK.
        return null;
    }

    if (!getApps().length) {
        try {
            app = initializeApp(firebaseConfig);
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            app = null;
        }
    } else {
        app = getApp();
    }
    
    return app;
}
