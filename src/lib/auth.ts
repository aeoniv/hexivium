
'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, updateDoc, type Firestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export async function signUp(auth: Auth, email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(auth: Auth, email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(auth: Auth) {
  return await firebaseSignOut(auth);
}

export async function createUserDocument(db: Firestore, user: User, location: { latitude: number, longitude: number } | null = null) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userData: any = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
    };
    if (location) {
        userData.last_location = location;
    }
    return await setDoc(userRef, userData, { merge: true });
}

export async function updateUserLocation(db: Firestore, uid: string, location: { latitude: number, longitude: number }) {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    return await updateDoc(userRef, { last_location: location });
}

export function useUser(auth: Auth | null) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });

      return () => unsubscribe();
    } else {
        setUser(null);
    }
  }, [auth]);

  return user;
}
