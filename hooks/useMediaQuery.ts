'use client';

import {useCallback, useSyncExternalStore} from 'react';

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string) {
  // Stable identity per query - otherwise useSyncExternalStore
  // unsubscribes/resubscribes the matchMedia listener on every render.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    getServerSnapshot,
  );
}
