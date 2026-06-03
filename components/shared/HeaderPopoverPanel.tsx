'use client';

import {forwardRef, type ReactNode} from 'react';

export const CART_HEADER_POPOVER_ID = 'header-cart-popover';
export const USER_HEADER_POPOVER_ID = 'header-user-popover';
export const CART_HEADER_TRIGGER_ID = 'header-cart-trigger';
export const USER_HEADER_TRIGGER_ID = 'header-user-trigger';

export function showHeaderPopover(id: string) {
  document.getElementById(id)?.showPopover();
}

export function hideHeaderPopover(id: string) {
  document.getElementById(id)?.hidePopover();
}

type HeaderPopoverPanelProps = {
  id: string;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  'aria-labelledby'?: string;
};

export const HeaderPopoverPanel = forwardRef<
  HTMLDivElement,
  HeaderPopoverPanelProps
>(function HeaderPopoverPanel(
  {id, children, className, tabIndex, 'aria-labelledby': ariaLabelledby},
  ref,
) {
  return (
    <div
      ref={ref}
      id={id}
      popover='auto'
      tabIndex={tabIndex}
      aria-labelledby={ariaLabelledby}
      className={`header-popover-panel outline-none ${className ?? ''}`}
    >
      {children}
    </div>
  );
});
