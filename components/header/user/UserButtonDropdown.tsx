'use client';

import {User} from 'lucide-react';
import {useAuth} from '@/hooks/useAuth';
import {useState, useRef, useCallback, useEffect} from 'react';
import {AnimatePresence} from 'framer-motion';
import {useSaveCurrentUrl} from '@/hooks/useLoginRedirect';
import {useRouter} from 'next/navigation';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {useDropdownDismissal} from '@/hooks/useDropdownDismissal';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {HeaderPopoverPanel} from '../shared/HeaderPopoverPanel';
import {
  USER_DROPDOWN_TITLE_ID,
  UserDropdownMenu,
} from './UserDropdownMenu';

function computeUserInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  if (name) {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
    return nameParts[0].charAt(0).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() ?? 'U';
}

function UserMobileInitialsBadge({
  initials,
  role,
}: {
  initials: string;
  role: number | null | undefined;
}) {
  return (
    <div
      className={`h-5.5 w-5.5 rounded-full uppercase  border  bg-white flex items-center justify-center text-[10px]  font-semibold lg:hidden ${
        role === 1
          ? 'text-red-800 border-red-800'
          : 'text-gray-700 border-black/80'
      }`}
    >
      {initials}
    </div>
  );
}

function UserDesktopAccountLabel({role}: {role: number | null | undefined}) {
  return (
    <span
      className={`hidden lg:block text-xs font-semibold uppercase border-b border-transparent transition text-nowrap ${
        role === 1
          ? 'text-red-800 hover:border-red-800'
          : ' hover:border-black '
      }`}
    >
      MY ACCOUNT
    </span>
  );
}

const UserButton = () => {
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();
  const [mounted, setMounted] = useState(false);
  const {user, loading, role} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const saveCurrentUrl = useSaveCurrentUrl();
  const router = useRouter();

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  useDropdownDismissal({
    isOpen,
    onClose: closeDropdown,
    containerRef: rootRef,
  });

  useFocusTrap(panelRef, isOpen);
  useKeyboardShortcut('Escape', closeDropdown, isOpen);

  const handleLogin = () => {
    saveCurrentUrl();
    router.push('/log-in');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <span className='flex items-center justify-center'>
        <User size={23} strokeWidth={1} className='lg:hidden' />
        <span className='hidden lg:block text-xs font-semibold uppercase'>
          Log in
        </span>
      </span>
    );
  }

  if (!user) {
    return (
      <button
        aria-label='Log in'
        onClick={() => {
          if (isSearchExpanded) {
            collapseSearch();
          }
          handleLogin();
        }}
      >
        <User size={23} strokeWidth={1} className='lg:hidden' />
        <span className='hidden lg:block text-xs font-semibold uppercase border-b border-transparent hover:border-black transition cursor-pointer text-nowrap'>
          Log in
        </span>
      </button>
    );
  }

  const initials = computeUserInitials(user.name, user.email);

  return (
    <div className='relative' ref={rootRef}>
      <button
        aria-label='My account'
        aria-expanded={isOpen}
        onClick={() => {
          if (isSearchExpanded) {
            collapseSearch();
          }
          setIsOpen(!isOpen);
        }}
        className='flex items-center  cursor-pointer  relative'
      >
        <UserMobileInitialsBadge initials={initials} role={role} />
        <UserDesktopAccountLabel role={role} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <HeaderPopoverPanel
            ref={panelRef}
            aria-labelledby={USER_DROPDOWN_TITLE_ID}
            className={`absolute top-9.5 lg:top-9  -right-5.5 lg:-right-25 w-[230px] lg:w-[300px] bg-white  rounded-xs shadow-lg py-1 z-20 border  border-gray-300

            before:content-[''] before:absolute before:bottom-full before:right-6 lg:before:left-1/2 before:w-0 before:h-0 before:border-[8px] before:border-transparent before:border-b-gray-400/80

            after:content-[''] after:absolute after:bottom-full after:right-6 lg:after:left-1/2 after:w-0 after:h-0 after:border-[8px] after:border-transparent after:border-b-white after:-mb-px
            `}
          >
            <UserDropdownMenu user={user} role={role} onClose={closeDropdown} />
          </HeaderPopoverPanel>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserButton;
