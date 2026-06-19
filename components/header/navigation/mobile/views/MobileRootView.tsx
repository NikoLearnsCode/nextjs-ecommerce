'use client';

import {motion} from 'framer-motion';
import {NavLink} from '@/lib/types/category-types';
import {MobileCategoryTabs} from '../MobileCategoryTabs';
import {MobileCloseButton} from '../MobileCloseButton';
import {MobileNavLinkList} from '../MobileNavLinkList';

interface MobileRootViewProps {
  navLinks: NavLink[];
  activeCategoryIndex: number;
  onLinkClick: (link: NavLink) => void;
  onChangeCategory: (index: number) => void;
  onClose: () => void;
}

// Slides in from the left when returning from a sub view; fades out (no slide) when leaving.
const rootMotion = {
  initial: {x: -100, opacity: 0},
  animate: {x: 0, opacity: 1},
  exit: {x: 0, opacity: 0},
  transition: {type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.6},
} as const;

/**
 * Mobile navigation root view (level 1).
 * Category tabs and links for the selected category — first screen when the menu opens.
 */
export function MobileRootView({
  navLinks,
  activeCategoryIndex,
  onLinkClick,
  onChangeCategory,
  onClose,
}: MobileRootViewProps) {
  const activeLinks = navLinks[activeCategoryIndex]?.children || [];

  return (
    <motion.div
      key='root-view'
      initial={rootMotion.initial}
      animate={rootMotion.animate}
      exit={rootMotion.exit}
      transition={rootMotion.transition}
      className='absolute inset-0 flex min-h-0 flex-col'
    >
      {/* Header: Category tabs + Close button */}
      <div className='relative shrink-0'>
        <MobileCategoryTabs
          navLinks={navLinks}
          activeCategoryIndex={activeCategoryIndex}
          onChangeCategory={onChangeCategory}
        />
        <MobileCloseButton onClose={onClose} />
      </div>

      <MobileNavLinkList links={activeLinks} onLinkClick={onLinkClick} />
    </motion.div>
  );
}
