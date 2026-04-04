'use client';

import {NavLink} from '@/lib/types/category-types';
import {NavLinkItem} from '../shared/NavLinkItem';

interface MobileCategoryTabsProps {
  navLinks: NavLink[];
  activeCategoryIndex: number;
  onChangeCategory: (index: number) => void;
}

/**
 * Horizontal category tabs (e.g. Women, Men) for mobile nav.
 * Uses the same NavLinkItem styling as the rest of the mobile menu.
 */
export function MobileCategoryTabs({
  navLinks,
  activeCategoryIndex,
  onChangeCategory,
}: MobileCategoryTabsProps) {
  return (
    <ul className='flex uppercase px-1 text-xs font-semibold h-14.5 items-center'>
      {navLinks.map((link, index) => {
        const isActive = activeCategoryIndex === index;

        return (
          <li key={link.title} className='first:ml-3 mx-2'>
            <NavLinkItem
              link={link}
              onClick={() => onChangeCategory(index)}
              isActive={isActive}
              isDimmed={!isActive}
              className='px-0'
            />
          </li>
        );
      })}
    </ul>
  );
}
