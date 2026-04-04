'use client';

import {usePathname, useSearchParams} from 'next/navigation';

export function useSaveCurrentUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return () => {
    const isAuthPage =
      pathname === '/log-in' ||
      pathname === '/profile' ||
      pathname.startsWith('/profile/');

    if (!isAuthPage) {
      const current =
        pathname + (searchParams.toString() ? `?${searchParams}` : '');
      sessionStorage.setItem('postLoginRedirect', current);
    }
  };
}
