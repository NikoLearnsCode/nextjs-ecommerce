'use client';

import {useRef, useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {NavLink} from '@/lib/types/category-types';
import {NavLinkItem} from '../shared/NavLinkItem';
import {MotionCloseX, MotionOverlay} from '@/components/shared/AnimatedSidebar';
import {computeDropdownWidth, COLUMN_MIN_WIDTH} from './desktopUtils';
import {getFocusableElements} from '@/hooks/useFocusTrap';
import {safeFocus} from '@/lib/focus';

// Column entrance: first column appears instantly, later ones fade + slide in.
const FIRST_COLUMN_INITIAL = false;
const LATER_COLUMN_INITIAL = {opacity: 0, x: -10};
const FIRST_COLUMN_TRANSITION = {duration: 0};
const LATER_COLUMN_TRANSITION = {
  x: {duration: 0.3, ease: [0.215, 0.61, 0.333, 1]},
  opacity: {duration: 0.4, ease: 'easeInOut', delay: 0.1},
} as const;

interface DesktopDropdownProps {
  columnsToRender: NavLink[][];
  activePath: number[];
  navTabsWidth: number;
  onClose: () => void;
  onSubMenuHover: (level: number, index: number) => void;
  onClick: () => void;
  ariaLabel?: string;
}

export function DesktopDropdown({
  columnsToRender,
  activePath,
  navTabsWidth,
  onClose,
  onSubMenuHover,
  onClick,
  ariaLabel,
}: DesktopDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const [measuredColumnsWidth, setMeasuredColumnsWidth] = useState(0);

  const focusFirstInteractiveInColumn = (columnIndex: number) => {
    const columnsRoot = columnsRef.current;
    if (!columnsRoot) return;

    const column = columnsRoot.querySelector<HTMLElement>(
      `[data-dropdown-column="${columnIndex}"]`,
    );
    if (!column) return;

    const focusable = getFocusableElements(column);
    safeFocus(focusable[0]);
  };

  const handleSubmenuKeyOpen = (level: number, index: number) => {
    onSubMenuHover(level, index);

    // Wait for the next column to render before moving focus into it.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        focusFirstInteractiveInColumn(level + 1);
      });
    });
  };

  useEffect(() => {
    const el = columnsRef.current;
    if (!el) return;
    setMeasuredColumnsWidth(el.scrollWidth);

    const observer = new ResizeObserver(() => {
      setMeasuredColumnsWidth(el.scrollWidth);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [columnsToRender]);

  const dropdownWidth = computeDropdownWidth(
    measuredColumnsWidth,
    navTabsWidth,
  );

  return (
    <>
      <motion.div
        key='desktop-dropdown'
        ref={dropdownRef}
        id='desktop-nav-dialog'
        role='dialog'
        // No aria-modal: the focus trap spans the nav tabs (outside this
        // element), which must stay perceivable to AT.
        aria-label={ariaLabel}
        onMouseLeave={onClose}
        className='fixed left-0 top-0 h-full flex flex-col bg-white z-40  uppercase shadow-none'
        initial={{clipPath: 'inset(0% 100% 0% 0%)'}}
        animate={{
          // Negative inset lets focus outlines bleed past the panel edge.
          clipPath: 'inset(-4px -4px -4px -4px)',
          width: `${dropdownWidth}px`,
          transition: {type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.5},
        }}
        exit={{
          clipPath: 'inset(0% 100% 0% 0%)',
          transition: {type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.2},
        }}
      >
        {/* Columns come FIRST in the DOM so Tab naturally starts here.
            pt-13 reserves space for the absolutely-positioned close button. */}
        <div className='flex-1 min-h-0 pl-8 pt-13 pb-8'>
          <div ref={columnsRef} className='inline-flex gap-8 h-full'>
            {columnsToRender.map((columnItems, columnIndex) => {
              const isDimmed = columnsToRender.length > columnIndex + 1;

              return (
                <motion.div
                  key={columnIndex}
                  // pl-1 gives the focus ring left-side breathing room;
                  // pr-12 keeps column content spaced from the next column.
                  className='pl-1 pr-12 pt-6 h-full overflow-y-auto'
                  data-dropdown-column={columnIndex}
                  style={{minWidth: COLUMN_MIN_WIDTH}}
                  initial={
                    columnIndex === 0
                      ? FIRST_COLUMN_INITIAL
                      : LATER_COLUMN_INITIAL
                  }
                  animate={{opacity: 1, x: 0}}
                  transition={
                    columnIndex === 0
                      ? FIRST_COLUMN_TRANSITION
                      : LATER_COLUMN_TRANSITION
                  }
                >
                  <ul className='flex flex-col text-nowrap'>
                    {columnItems.map((item, itemIndex) => {
                      const isActive =
                        activePath[columnIndex + 1] === itemIndex;

                      return (
                        <NavLinkItem
                          key={item.title}
                          link={item}
                          onClick={onClick}
                          isActive={isActive}
                          isDimmed={isDimmed}
                          asListItem
                          preventSubmenuActivation
                          onItemMouseEnter={() =>
                            onSubMenuHover(columnIndex, itemIndex)
                          }
                          onSubmenuKeyOpen={() =>
                            handleSubmenuKeyOpen(columnIndex, itemIndex)
                          }
                        />
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Close button is last in the DOM so Tab reaches it after all nav
            items. Visually it sits at the top-right via absolute positioning. */}
        <div className='absolute top-0 right-0 flex items-center pr-1 pt-0.5 h-13'>
          <MotionCloseX
            size={14}
            strokeWidth={1.5}
            className='p-5'
            onClick={onClose}
          />
        </div>
      </motion.div>

      <MotionOverlay key='desktop-overlay' onClick={onClose} />
    </>
  );
}
