'use client';

import {useRef, useState, useEffect} from 'react';
import Link from 'next/link';
import {AnimatePresence} from 'framer-motion';
import {NavLink} from '@/lib/types/category-types';
import {useDesktopNav} from './useDesktopNav';
import {DesktopDropdown} from './DesktopDropdown';
import {useFocusTrap} from '@/hooks/useFocusTrap';

interface DesktopNavigationProps {
  navLinks: NavLink[];
}

export function DesktopNavigation({navLinks}: DesktopNavigationProps) {
  const {
    activePath,
    columnsToRender,
    closeDropdown,
    handleMainMenuHover,
    handleSubMenuHover,
    handleMainMenuLeave,
    handleClick,
    handleKeyOpen,
    checkIsActivePath,
  } = useDesktopNav(navLinks);

  const navRef = useRef<HTMLElement>(null);
  const navTabsRef = useRef<HTMLUListElement>(null);
  const [navTabsWidth, setNavTabsWidth] = useState(0);

  // Trap focus within the full <nav> (tabs + dropdown) while the mega-menu is
  // open. autoFocus:false so hovering with a mouse doesn't steal keyboard focus.
  useFocusTrap(navRef, activePath.length > 0, {autoFocus: false});

  useEffect(() => {
    const ul = navTabsRef.current;
    if (!ul || ul.children.length === 0) return;
    const firstChild = ul.children[0];
    const lastChild = ul.children[ul.children.length - 1];
    const contentWidth =
      lastChild.getBoundingClientRect().right -
      firstChild.getBoundingClientRect().left;
    setNavTabsWidth(contentWidth);
  }, [navLinks]);

  return (
    <nav ref={navRef} className='uppercase' aria-label='Primary'>
      <ul
        ref={navTabsRef}
        className='flex items-center gap-2 justify-center relative z-50'
      >
        {navLinks.map((link, index) => {
          const isActive =
            activePath.length === 0 && checkIsActivePath(link.href || '');
          const isCurrentlyOpen = activePath[0] === index;
          const isOtherOpen = activePath.length > 0 && !isCurrentlyOpen;

          return (
            <li
              key={link.title}
              onMouseEnter={() => handleMainMenuHover(index)}
              onMouseLeave={handleMainMenuLeave}
              className='text-xs font-semibold cursor-pointer'
            >
              <Link href={link.href || ''} onClick={handleClick}>
                <span
                  className={`pb-0.5 ${
                    isActive
                      ? 'text-black border-b delay-50 border-black'
                      : isCurrentlyOpen
                        ? 'text-black border-b border-black hover:border-black'
                        : isOtherOpen
                          ? 'text-gray-500'
                          : ''
                  }`}
                >
                  {link.title}
                </span>
              </Link>

              <button
                type='button'
                onClick={() => handleKeyOpen(index)}
                aria-haspopup='dialog'
                aria-expanded={isCurrentlyOpen}
                aria-controls={isCurrentlyOpen ? 'desktop-nav-dialog' : undefined}
                className='inline-flex w-3.5 justify-center items-center focus:text-black opacity-0 focus:opacity-100 text-white cursor-default'
                aria-label={`Open ${link.title} menu`}
              >
                ˅
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {activePath.length > 0 && (
          <DesktopDropdown
            columnsToRender={columnsToRender}
            activePath={activePath}
            navTabsWidth={navTabsWidth}
            ariaLabel={`${navLinks[activePath[0]]?.title} menu`}
            onClose={closeDropdown}
            onSubMenuHover={handleSubMenuHover}
            onClick={handleClick}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
