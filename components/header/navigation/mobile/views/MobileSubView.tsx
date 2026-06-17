'use client';

import {motion} from 'framer-motion';
import {ArrowLeft} from 'lucide-react';
import {NavLink} from '@/lib/types/category-types';
import {MotionCloseX} from '@/components/shared/AnimatedSidebar';
import {NavLinkItem} from '../../shared/NavLinkItem';

interface MobileSubViewProps {
  currentLevel: NavLink;
  mainCategoryTitle: string;
  navigationStack: NavLink[]; // Full stack for breadcrumb building
  direction: 'forward' | 'back';
  onGoBack: () => void;
  onLinkClick: (link: NavLink) => void;
  onClose: () => void;
}

/**
 * Mobile navigation sub view (level 2+).
 *
 * Renders links for a subcategory with a back button and breadcrumbs.
 * Slides in from the right when navigating deeper.
 */
export function MobileSubView({
  currentLevel,
  mainCategoryTitle,
  navigationStack,
  direction,
  onGoBack,
  onLinkClick,
  onClose,
}: MobileSubViewProps) {
  const linksToDisplay = currentLevel?.children || [];

  // Breadcrumbs from stack (excluding current level, which is shown separately)
  // e.g. [Women, Jackets, Winter] → "Winter - Jackets - Women"
  const breadcrumbs = [
    ...navigationStack.slice(0, -1).reverse(), // All but last, reversed
    {title: mainCategoryTitle}, // Main category title last
  ];

  // Direction-based motion
  // forward: enter from right, exit to right
  // back: enter from left, exit to left
  const animationConfig = {
    // Forward (deeper): enter from +150px. Back: enter from -75px.
    initial: {
      x: direction === 'forward' ? 150 : -75,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    // Forward: previous view fades out instead of sliding. Back: exit to the right (~150px).
    exit: {
      x: direction === 'forward' ? 0 : 150,
      opacity: 0,
    },
  };

  return (
    <motion.div
      key={`sub-view-${navigationStack.length}`}
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={{
        type: 'tween',
        ease: [0.25, 1, 0.5, 1], // Soft ease-out-style curve
        duration: 0.4,
      }}
      className='absolute inset-0 flex min-h-0 flex-col'
    >
      {/* Header: Back button + breadcrumb + Close button */}
      <div className='relative flex min-w-0 shrink-0 items-center gap-1 overflow-hidden px-2 h-14.5 pr-12'>
        <button
          onClick={onGoBack}
          type='button'
          className='text-xs font-medium shrink-0 py-2.5 pl-4 pr-3.5 mr-0.5  transition flex items-center '
          aria-label='Go back'
        >
          <ArrowLeft strokeWidth={1} className='w-5 h-5 text-gray-700' />
        </button>

        <nav
          className='min-h-0 min-w-0 flex-1 touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-hide'
          aria-label='Breadcrumb'
        >
          <ol className='flex w-max max-w-none flex-nowrap items-center gap-2 py-0.5'>
            {/* Current level */}
            <li
              aria-current='location'
              className='whitespace-nowrap text-xs font-semibold text-gray-600 uppercase'
            >
              {currentLevel?.title}
            </li>

            {/* Breadcrumb trail — parent levels */}
            {breadcrumbs.map((crumb, index) => (
              <li
                key={index}
                className='inline-flex shrink-0 items-center gap-2 whitespace-nowrap'
              >
                <span aria-hidden='true' className='shrink-0 text-gray-400'>
                  -
                </span>
                <span className='whitespace-nowrap text-xs font-medium text-gray-500 uppercase'>
                  {crumb.title}
                </span>
              </li>
            ))}
          </ol>
        </nav>

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
      <div className='min-h-0 flex-1 overflow-y-auto pt-2'>
        <ul className='px-4 text-xs'>
          {linksToDisplay.map((link) => (
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
