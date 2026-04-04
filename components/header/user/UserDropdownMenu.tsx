'use client';

import Link from 'next/link';
import {FocusHeading} from '@/components/shared/FocusHeading';
import {ArrowRight, Loader2} from 'lucide-react';
import {useState} from 'react';
import {signOut} from 'next-auth/react';
import {MotionCloseX} from '../../shared/AnimatedSidebar';

function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    setTimeout(async () => {
      await signOut();
      setIsPending(false);
    }, 300);
  };

  return (
    <button
      onClick={handleLogout}
      type='button'
      disabled={isPending}
      className='flex items-center w-full  px-4 py-2 lg:py-2.5 text-xs  disabled:opacity-70 cursor-pointer'
    >
      {isPending ? (
        <span className='flex w-full justify-between group relative items-center gap-2 text-red-800'>
          Signing out...
          <Loader2 size={14} className='animate-spin' />
        </span>
      ) : (
        <span className='flex w-full hover:text-red-800 font-medium justify-between group relative items-center gap-2 text-gray-700'>
          Sign out
          <ArrowRight
            size={12}
            strokeWidth={1.5}
            className='group-hover:translate-x-1  transition-transform duration-300'
          />
        </span>
      )}
    </button>
  );
}

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

export const USER_DROPDOWN_TITLE_ID = 'user-dropdown-title';

type UserDropdownMenuProps = {
  user: SessionUser;
  role: number | null | undefined;
  onClose: () => void;
};

export function UserDropdownMenu({user, role, onClose}: UserDropdownMenuProps) {
  const name = user.name?.trim();
  const displayName = name || user.email || 'Account';
  const showEmailLine = Boolean(user.email && user.email !== displayName);

  return (
    <>
      <div className='px-4 py-2.5 lg:py-2.5 border-b border-gray-300 min-w-0'>
        <div className='relative pr-6 min-w-0'>
          <FocusHeading
            as='h5'
            id={USER_DROPDOWN_TITLE_ID}
            className='text-base lg:text-lg font-medium text-gray-900 leading-tight'
          >
            <span className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0'>
              <span className='min-w-0 break-words'>{displayName}</span>
              {role === 1 && (
                <span className='text-xs shrink-0 underline underline-offset-2 text-red-800 mb-0.5 font-semibold'>
                  ADMIN
                </span>
              )}
            </span>
          </FocusHeading>
          <span className='absolute -right-2 -top-1'>
            <MotionCloseX
              className='p-2'
              size={12}
              strokeWidth={2}
              onClick={onClose}
            />
          </span>
        </div>

        {showEmailLine ? (
          <span className='mt-0.5 block text-xs font-medium text-gray-600 min-w-0 break-words'>
            {user.email}
          </span>
        ) : null}
      </div>
      {role === 1 && (
        <Link
          href='/admin'
          className='flex items-center px-4  hover:text-gray-700 py-2 lg:py-2.5 text-xs   border-b  border-gray-200'
          onClick={onClose}
        >
          <span className='flex w-full font-medium  justify-between group relative items-center gap-2 '>
            <span className='font-bold text-red-800 group-hover:text-red-900'>
              Admin Dashboard
            </span>
            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className='group-hover:translate-x-1   transition-transform duration-300'
            />
          </span>
        </Link>
      )}
      <Link
        href='/profile/orders'
        className='flex items-center px-4 py-2 lg:py-2.5 text-xs  text-gray-700  border-b  border-gray-200'
        onClick={onClose}
      >
        <span className='flex w-full font-medium hover:text-black justify-between group relative items-center gap-2 '>
          My orders
          <ArrowRight
            size={12}
            strokeWidth={1.5}
            className='group-hover:translate-x-1   transition-transform duration-300'
          />
        </span>
      </Link>

      <LogoutButton />
    </>
  );
}
