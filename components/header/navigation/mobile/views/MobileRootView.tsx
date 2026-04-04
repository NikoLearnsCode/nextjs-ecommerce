'use client';

import {motion} from 'framer-motion';
import {NavLink} from '@/lib/types/category-types';
import {MobileCategoryTabs} from '../MobileCategoryTabs';
import {MotionCloseX} from '@/components/shared/AnimatedSidebar';
import {NavLinkItem} from '../../shared/NavLinkItem';

interface MobileRootViewProps {
  navLinks: NavLink[];
  activeCategoryIndex: number;
  onLinkClick: (link: NavLink) => void;
  onChangeCategory: (index: number) => void;
  onClose: () => void;
}

/**
 * Mobile navigation root view (level 1).
 *
 * Category tabs and links for the selected category — first screen when the menu opens.
 * Slides in from the left when returning from a sub view.
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
      initial={{x: -100, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      // Leaving root for a sub view: fade out, no horizontal slide
      exit={{x: 0, opacity: 0}}
      transition={{
        type: 'tween',
        ease: [0.25, 1, 0.5, 1],
        duration: 0.6,
      }}
      className='absolute inset-0 flex min-h-0 flex-col'
    >
      {/* Header: Category tabs + Close button */}
      <div className='relative shrink-0'>
        <MobileCategoryTabs
          navLinks={navLinks}
          activeCategoryIndex={activeCategoryIndex}
          onChangeCategory={onChangeCategory}
        />

        <div className='absolute top-0 right-0 z-10'>
          <MotionCloseX
            onClick={onClose}
            size={14}
            strokeWidth={1.5}
            className='py-5 px-4'
          />
        </div>
      </div>

      {/* Content: link list */}
      <div className='min-h-0 flex-1 overflow-y-auto  pt-2'>
        <ul className='px-4 text-xs'>
          {activeLinks.map((link) => (
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
    </motion.div>
  );
}
