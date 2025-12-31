

'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, type Firestore } from 'firebase/firestore';

export async function signUp(auth: Auth, email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(auth: Auth, email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(auth: Auth) {
  return await firebaseSignOut(auth);
}

export async function createUserDocument(db: Firestore, user: User, additionalData: { displayName?: string, phone?: string, location?: { latitude: number, longitude: number } | null } = {}) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userData: any = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        energyBalance: 64, // Grant 64 credits on creation
        ...additionalData.phone && { phone: additionalData.phone },
        ...additionalData.location && { last_location: additionalData.location },
    };
    
    return await setDoc(userRef, userData, { merge: true });
}

export async function updateUserLocation(db: Firestore, uid: string, location: { latitude: number, longitude: number }) {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    return await setDoc(userRef, { last_location: location }, { merge: true });
}
