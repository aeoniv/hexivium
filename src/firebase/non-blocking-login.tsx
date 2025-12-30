'use client';
import {
  Auth,
  User,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Initiates an email/password sign-up (non-blocking).
 * @param authInstance The Firebase Auth instance.
 * @param email The user's email.
 * @param password The user's password.
 * @param onSuccess Callback function for successful sign-up.
 * @param onError Callback function for errors.
 */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  onSuccess: (user: User) => void,
  onError: (error: any) => void
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      onSuccess(userCredential.user);
    })
    .catch(error => {
      onError(error);
    });
}

/**
 * Initiates an email/password sign-in (non-blocking).
 * @param authInstance The Firebase Auth instance.
 * @param email The user's email.
 * @param password The user's password.
 * @param onSuccess Callback function for successful sign-in.
 * @param onError Callback function for errors.
 */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onSuccess: (user: User) => void,
  onError: (error: any) => void
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      onSuccess(userCredential.user);
    })
    .catch(error => {
      onError(error);
    });
}

/**
 * Initiates an anonymous sign-in (non-blocking).
 * @param authInstance The Firebase Auth instance.
 * @param onSuccess Callback for success.
 * @param onError Callback for error.
 */
export function initiateAnonymousSignIn(
  authInstance: Auth,
  onSuccess: (user: User) => void,
  onError: (error: any) => void
): void {
  signInAnonymously(authInstance)
    .then(userCredential => {
      onSuccess(userCredential.user);
    })
    .catch(error => {
      onError(error);
    });
}
