'use client';

import Link from 'next/link';
import {ArrowRight, Loader2} from 'lucide-react';
import {useState} from 'react';
import {signOut} from 'next-auth/react';
import {MotionCloseX} from '@/components/shared/AnimatedSidebar';
import {
  HeaderPopoverPanel,
  USER_HEADER_POPOVER_ID,
  hideHeaderPopover,
} from '@/components/shared/HeaderPopoverPanel';
import {useHeaderUserDisplay} from './UserButton';

const userPanelClassName = `absolute overflow-visible top-[3.5rem] right-18 sm:right-23.5 lg:right-27 w-[230px] lg:w-[300px] bg-white  rounded-xs shadow-lg py-1 z-20 border  border-gray-300

            before:content-[''] before:absolute before:bottom-full before:right-6 lg:before:left-1/2 before:w-0 before:h-0 before:border-[8px] before:border-transparent before:border-b-gray-400/80

            after:content-[''] after:absolute after:bottom-full after:right-6 lg:after:left-1/2 after:w-0 after:h-0 after:border-[8px] after:border-transparent after:border-b-white after:-mb-px
            `;

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
      className='flex items-center w-full px-4 py-2 lg:py-2.5 text-xs disabled:opacity-70 cursor-pointer'
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
            className='group-hover:translate-x-1 transition-transform duration-300'
          />
        </span>
      )}
    </button>
  );
}

export default function UserDropdown() {
  const {displayUser, displayRole} = useHeaderUserDisplay();

  if (!displayUser) {
    return null;
  }

  const closeDropdown = () => hideHeaderPopover(USER_HEADER_POPOVER_ID);
  const name = displayUser.name?.trim();
  const displayName = name || displayUser.email || 'Account';
  const showEmailLine = Boolean(
    displayUser.email && displayUser.email !== displayName,
  );

  return (
    <HeaderPopoverPanel
      id={USER_HEADER_POPOVER_ID}
      className={userPanelClassName}
    >
      <div className='px-4 py-2.5 lg:py-2.5 border-b border-gray-300 min-w-0'>
        <div className='relative pr-6 min-w-0'>
          <h2
            className='text-base lg:text-lg font-medium text-gray-900 leading-tight'
          >
            <span className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0'>
              <span className='min-w-0 break-words'>{displayName}</span>
              {displayRole === 1 && (
                <span className='text-xs shrink-0 underline underline-offset-2 text-red-800 mb-0.5 font-semibold'>
                  ADMIN
                </span>
              )}
            </span>
          </h2>
          <span className='absolute -right-2 -top-1'>
            <MotionCloseX
              className='p-2'
              size={12}
              strokeWidth={2}
              onClick={closeDropdown}
            />
          </span>
        </div>

        {showEmailLine ? (
          <span className='mt-0.5 block text-xs font-medium text-gray-600 min-w-0 break-words'>
            {displayUser.email}
          </span>
        ) : null}
      </div>
      {displayRole === 1 && (
        <Link
          href='/admin'
          className='flex items-center px-4 hover:text-gray-700 py-2 lg:py-2.5 text-xs border-b border-gray-200'
          onClick={closeDropdown}
        >
          <span className='flex w-full font-medium justify-between group relative items-center gap-2'>
            <span className='font-bold text-red-800 group-hover:text-red-900'>
              Admin Dashboard
            </span>
            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className='group-hover:translate-x-1 transition-transform duration-300'
            />
          </span>
        </Link>
      )}
      <Link
        href='/profile/orders'
        className='flex items-center px-4 py-2 lg:py-2.5 text-xs text-gray-700 border-b border-gray-200'
        onClick={closeDropdown}
      >
        <span className='flex w-full font-medium hover:text-black justify-between group relative items-center gap-2'>
          My orders
          <ArrowRight
            size={12}
            strokeWidth={1.5}
            className='group-hover:translate-x-1 transition-transform duration-300'
          />
        </span>
      </Link>

      <LogoutButton />
    </HeaderPopoverPanel>
  );
}
