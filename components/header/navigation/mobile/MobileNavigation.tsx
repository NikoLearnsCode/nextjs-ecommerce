'use client';

import {useRef} from 'react';
import {AnimatePresence} from 'framer-motion';
import {NavLink} from '@/lib/types/category-types';
import {useMobileNav} from './useMobileNav';
import {MobileMenuButton} from './MobileMenuButton';
import {MobileRootView} from './views/MobileRootView';
import {MobileSubView} from './views/MobileSubView';
import {
  MotionOverlay,
  MotionDropdown,
} from '@/components/shared/AnimatedSidebar';
import {useFocusTrap} from '@/hooks/useFocusTrap';

interface MobileNavigationProps {
  navLinks: NavLink[];
}

export function MobileNavigation({navLinks}: MobileNavigationProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const {
    isMenuOpen,
    activeCategoryIndex,
    navigationStack,
    navigationDirection,
    isAtMainLevel,
    currentLevel,
    toggleMenu,
    closeMenu,
    handleLinkClick,
    goBack,
    changeCategory,
  } = useMobileNav(navLinks);

  useFocusTrap(sidebarRef, isMenuOpen);

  return (
    <nav className='relative uppercase'>
      <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <MotionOverlay
              key='mobile-overlay'
              onClick={closeMenu}
              withDelay={true}
            />

            <MotionDropdown
              ref={sidebarRef}
              position='newLeft'
              key='mobile-dropdown'
              isMobile={true}
              className='overflow-hidden'
            >
              <div className='relative h-full overflow-clip'>
                <AnimatePresence>
                  {isAtMainLevel ? (
                    // Root view: category tabs and links (level 1)
                    <MobileRootView
                      navLinks={navLinks}
                      activeCategoryIndex={activeCategoryIndex}
                      onLinkClick={handleLinkClick}
                      onChangeCategory={changeCategory}
                      onClose={closeMenu}
                    />
                  ) : (
                    // Sub view: back button and deeper links (level 2+)
                    <MobileSubView
                      currentLevel={currentLevel!}
                      mainCategoryTitle={navLinks[activeCategoryIndex]?.title}
                      navigationStack={navigationStack}
                      direction={navigationDirection}
                      onGoBack={goBack}
                      onLinkClick={handleLinkClick}
                      onClose={closeMenu}
                    />
                  )}
                </AnimatePresence>
              </div>
            </MotionDropdown>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
