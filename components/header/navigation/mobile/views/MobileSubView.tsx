'use client';

import {motion} from 'framer-motion';
import {ArrowLeft} from 'lucide-react';
import {NavLink} from '@/lib/types/category-types';
import {MobileCloseButton} from '../MobileCloseButton';
import {MobileNavLinkList} from '../MobileNavLinkList';

interface MobileSubViewProps {
  currentLevel: NavLink;
  mainCategoryTitle: string;
  navigationStack: NavLink[]; // Full stack for breadcrumb building
  direction: 'forward' | 'back';
  onGoBack: () => void;
  onLinkClick: (link: NavLink) => void;
  onClose: () => void;
}

// Soft ease-out curve, shared by both directions.
const subViewTransition = {
  type: 'tween',
  ease: [0.25, 1, 0.5, 1],
  duration: 0.4,
} as const;

/**
 * Mobile navigation sub view (level 2+).
 * Renders links for a subcategory with a back button and breadcrumbs.
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
  const isForward = direction === 'forward';

  // Breadcrumbs from stack (excluding current level, which is shown separately).
  // e.g. [Women, Jackets, Winter] → "Winter - Jackets - Women"
  const breadcrumbs = [
    ...navigationStack.slice(0, -1).reverse(),
    {title: mainCategoryTitle},
  ];

  return (
    <motion.div
      key={`sub-view-${navigationStack.length}`}
      // forward: enter from right, fade out in place. back: enter from left, exit right.
      initial={{x: isForward ? 150 : -75, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{x: isForward ? 0 : 150, opacity: 0}}
      transition={subViewTransition}
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

        <MobileCloseButton onClose={onClose} />
      </div>

      <MobileNavLinkList
        links={currentLevel?.children || []}
        onLinkClick={onLinkClick}
      />
    </motion.div>
  );
}
