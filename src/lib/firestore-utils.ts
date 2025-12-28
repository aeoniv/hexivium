import { DocumentReference, getDoc } from 'firebase/firestore';

/**
 * getDocWithRetry
 * Robust wrapper around Firestore getDoc to handle transient offline/unavailable errors.
 * Retries with exponential backoff when error.code indicates a network / availability issue.
 */
export async function getDocWithRetry<T>(ref: DocumentReference<T>, options?: { retries?: number; baseDelayMs?: number; }) {
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 300;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const snap = await getDoc(ref);
      return snap; // May be !exists(); caller handles.
    } catch (err: any) {
      const code = err?.code;
      const isRetryable = code === 'unavailable' || code === 'failed-precondition' || code === 'deadline-exceeded';
      if (!isRetryable || attempt === retries) {
        console.warn('[getDocWithRetry] giving up', { attempt, code, message: err?.message });
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  // Should never reach here.
  throw new Error('getDocWithRetry exhausted unexpectedly');
}

/** Simple helper to check browser online status */
export const isBrowserOnline = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);
