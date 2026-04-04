'use client';

import {forwardRef, type ReactNode} from 'react';
import {motion} from 'framer-motion';

export const headerDropdownMotionProps = {
  initial: {opacity: 0, y: -10},
  animate: {opacity: 1, y: 0},
  exit: {opacity: 0, y: -10},
  transition: {duration: 0.1},
} as const;

type HeaderPopoverPanelProps = {
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  'aria-labelledby'?: string;
};

export const HeaderPopoverPanel = forwardRef<
  HTMLDivElement,
  HeaderPopoverPanelProps
>(function HeaderPopoverPanel(
  {children, className, tabIndex, 'aria-labelledby': ariaLabelledby},
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={className}
      tabIndex={tabIndex}
      aria-labelledby={ariaLabelledby}
      {...headerDropdownMotionProps}
    >
      {children}
    </motion.div>
  );
});
