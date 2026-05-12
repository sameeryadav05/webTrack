import { useSyncExternalStore } from 'react';
import useAuthStore from '../store/useAuthStore';

/**
 * True after zustand persist has finished reading localStorage.
 * Use this before trusting `isAuthenticated` or sending authed API calls on first load.
 */
export function useAuthHydration() {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  );
}
