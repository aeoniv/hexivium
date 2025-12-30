'use client';
    
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { useAuth } from '@/firebase/client-provider';

export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UseUserResult => {
  const auth = useAuth();
  const [state, setState] = useState<UseUserResult>(() => ({
    user: auth?.currentUser ?? null,
    isUserLoading: auth?.currentUser ? false : true,
    userError: null,
  }));

  useEffect(() => {
    if (!auth) {
      setState({ user: null, isUserLoading: false, userError: new Error("Auth service not available.") });
      return;
    }

    // Set initial state based on potentially already available user
    if (auth.currentUser && !state.user) {
        setState(s => s.user === auth.currentUser ? s : { ...s, user: auth.currentUser, isUserLoading: false });
    } else if (!auth.currentUser && state.isUserLoading) {
        // Only set loading if it's the initial check.
    }


    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setState({ user, isUserLoading: false, userError: null }),
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setState({ user: null, isUserLoading: false, userError: error });
      }
    );

    return () => unsubscribe();
  }, [auth]); // Dependency on the auth instance

  return state;
};
