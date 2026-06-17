'use client';

import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import {MAIN_CONTENT_ID} from '@/lib/focus';

// On route change, move focus to the new page's <main> unless it's already
// there (persistent-layout links keep focus; content links drop it to <body>).
// Mounted at the root; each layout's <main> needs id={MAIN_CONTENT_ID} + tabIndex={-1}.
export function RouteFocusManager() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const main = document.getElementById(MAIN_CONTENT_ID);
    if (!main) return;

    if (!main.contains(document.activeElement)) {
      // preventScroll so Next keeps owning scroll position.
      main.focus({preventScroll: true});
    }
  }, [pathname]);

  return null;
}
