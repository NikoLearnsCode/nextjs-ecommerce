'use client';

import {NavLink} from '@/lib/types/category-types';
import {NavLinkItem} from '../shared/NavLinkItem';

interface MobileNavLinkListProps {
  links: NavLink[];
  onLinkClick: (link: NavLink) => void;
}

/** Scrollable list of nav links shared by the root and sub views. */
export function MobileNavLinkList({links, onLinkClick}: MobileNavLinkListProps) {
  return (
    <div className='min-h-0 flex-1 overflow-y-auto pt-2'>
      <ul className='px-4 text-xs'>
        {links.map((link) => (
          <NavLinkItem
            key={link.href + link.title}
            link={link}
            onClick={() => onLinkClick(link)}
            className='uppercase'
            asListItem
            listItemClassName='not-first:pt-2'
          />
        ))}
      </ul>
    </div>
  );
}
