'use client';

import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import SizeDrawer from '@/components/shared/SizeDrawer';

type SizeDrawerTarget = {productId: string; sizes: string[]};

interface SizeDrawerContextType {
  openSizeDrawer: (target: SizeDrawerTarget) => void;
}

const SizeDrawerContext = createContext<SizeDrawerContextType>({
  openSizeDrawer: () => {},
});

// Mounts a single SizeDrawer for the whole subtree. Cards open it via
// openSizeDrawer() instead of each rendering their own hidden <dialog>.
export function SizeDrawerProvider({children}: {children: React.ReactNode}) {
  const [target, setTarget] = useState<SizeDrawerTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSizeDrawer = useCallback((next: SizeDrawerTarget) => {
    setTarget(next);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({openSizeDrawer}), [openSizeDrawer]);

  return (
    <SizeDrawerContext.Provider value={value}>
      {children}
      {target && (
        <SizeDrawer
          productId={target.productId}
          sizes={target.sizes}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </SizeDrawerContext.Provider>
  );
}

export function useSizeDrawer() {
  return useContext(SizeDrawerContext);
}
