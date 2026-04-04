'use client';

import {NavLink} from '@/lib/types/category-types';
import {DesktopNavigation} from './desktop/DesktopNavigation';
import {MobileNavigation} from './mobile/MobileNavigation';

interface NavigationProps {
  navLinks: NavLink[];
}

export default function Navigation({navLinks}: NavigationProps) {
  if (!navLinks || navLinks.length === 0) {
    return null;
  }

  return (
    <>
      <div className='hidden lg:block'>
        <DesktopNavigation navLinks={navLinks} />
      </div>

      <div className='block lg:hidden'>
        <MobileNavigation navLinks={navLinks} />
      </div>
    </>
  );
}
