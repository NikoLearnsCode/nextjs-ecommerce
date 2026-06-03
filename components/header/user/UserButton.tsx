'use client';

import {User} from 'lucide-react';
import {useAuth} from '@/hooks/useAuth';
import {useState, useEffect, useMemo} from 'react';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {useSaveCurrentUrl} from '@/hooks/useLoginRedirect';
import Link from 'next/link';
import {
  PREVIEW_USER_DROPDOWN,
  PREVIEW_USER_DROPDOWN_USER,
} from '@/lib/constants';
import {
  USER_HEADER_POPOVER_ID,
  USER_HEADER_TRIGGER_ID,
} from '@/components/shared/HeaderPopoverPanel';
import {computeUserInitials} from './userInitials';

const isPreviewUserDropdown =
  process.env.NODE_ENV === 'development' && PREVIEW_USER_DROPDOWN;

export function useHeaderUserDisplay() {
  const {user, loading, role} = useAuth();

  const previewUser = useMemo(
    () =>
      isPreviewUserDropdown
        ? {
            ...PREVIEW_USER_DROPDOWN_USER,
            image: null,
          }
        : null,
    [],
  );

  const displayUser = user ?? previewUser;
  const displayRole = user ? role : (previewUser?.role ?? null);

  return {displayUser, displayRole, loading};
}

function UserButtonLoading() {
  return (
    <span className='flex items-center justify-center'>
      <User size={23} strokeWidth={1} className='lg:hidden' />
      <span className='hidden lg:block text-xs font-semibold uppercase'>
        Log in
      </span>
    </span>
  );
}

function UserLoggedOutButton() {
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();
  const saveCurrentUrl = useSaveCurrentUrl();

  return (
    <Link
      href='/log-in'
      aria-label='Go to log in'
      onClick={() => {
        if (isSearchExpanded) {
          collapseSearch();
        }
        saveCurrentUrl();
      }}
      className='outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
    >
      <User size={23} strokeWidth={1} className='lg:hidden' />
      <span className='hidden lg:block text-xs font-semibold uppercase border-b border-transparent hover:border-black transition text-nowrap'>
        Log in
      </span>
    </Link>
  );
}

function UserLoggedInButton({
  name,
  email,
  role,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  role: number | null | undefined;
}) {
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();
  const initials = computeUserInitials(name, email);

  return (
    <button
      id={USER_HEADER_TRIGGER_ID}
      type='button'
      aria-label='My account'
      popoverTarget={USER_HEADER_POPOVER_ID}
      onClick={() => {
        if (isSearchExpanded) {
          collapseSearch();
        }
      }}
      className='flex items-center relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
    >
      <div
        className={`h-5.5 w-5.5 rounded-full uppercase border bg-white flex items-center justify-center text-[10px] font-semibold lg:hidden ${
          role === 1
            ? 'text-red-800 border-red-800'
            : 'text-gray-700 border-black/80'
        }`}
      >
        {initials}
      </div>
      <span
        className={`hidden lg:block text-xs font-semibold uppercase border-b border-transparent transition text-nowrap ${
          role === 1
            ? 'text-red-800 hover:border-red-800'
            : 'hover:border-black'
        }`}
      >
        MY ACCOUNT
      </span>
    </button>
  );
}

export default function UserButton() {
  const [mounted, setMounted] = useState(false);
  const {displayUser, displayRole, loading} = useHeaderUserDisplay();

  useEffect(() => {
    setMounted(true);
  }, []);

  if ((loading && !isPreviewUserDropdown) || !mounted) {
    return <UserButtonLoading />;
  }

  if (!displayUser) {
    return <UserLoggedOutButton />;
  }

  return (
    <UserLoggedInButton
      name={displayUser.name}
      email={displayUser.email}
      role={displayRole}
    />
  );
}
