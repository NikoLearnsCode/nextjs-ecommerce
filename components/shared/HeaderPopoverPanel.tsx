'use client';

import {forwardRef, type ReactNode} from 'react';

export const CART_HEADER_POPOVER_ID = 'header-cart-popover';
export const USER_HEADER_POPOVER_ID = 'header-user-popover';
export const CART_HEADER_TRIGGER_ID = 'header-cart-trigger';
export const USER_HEADER_TRIGGER_ID = 'header-user-trigger';

export function showHeaderPopover(id: string) {
  document.getElementById(id)?.showPopover();
}

// Open via the declarative trigger, not showPopover(): iOS WebKit needs an invoker or it light-dismisses immediately.
export function openHeaderPopover(triggerId: string, popoverId: string) {
  const popover = document.getElementById(popoverId);
  if (popover?.matches(':popover-open')) return;
  document.getElementById(triggerId)?.click();
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
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      e.currentTarget.hidePopover();
    }
  };

  return (
    <div
      ref={ref}
      id={id}
      popover='auto'
      onBlur={handleBlur}
      tabIndex={tabIndex}
      aria-labelledby={ariaLabelledby}
      className={`header-popover-panel outline-none ${className ?? ''}`}
    >
      {children}
    </div>
  );
});
