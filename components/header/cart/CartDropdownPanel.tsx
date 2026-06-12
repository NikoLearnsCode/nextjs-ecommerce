'use client';

import {
  CART_HEADER_POPOVER_ID,
  HeaderPopoverPanel,
  hideHeaderPopover,
} from '@/components/shared/HeaderPopoverPanel';
import {
  CartDropdownContent,
} from './CartDropdownContent';

const cartPanelClassName = `absolute right-2.5 lg:right-8 top-[3.5rem] w-72 sm:w-96 bg-white shadow-lg rounded-xs z-20 border border-gray-300

            before:content-[''] before:absolute before:bottom-full before:right-2 sm:right-6.5 lg:before:right-4 before:w-0 before:h-0  before:border-[8px] before:border-transparent before:border-b-gray-400/70

            after:content-[''] after:absolute after:bottom-full after:right-2 lg:after:right-4 after:w-0 after:h-0  after:border-[8px] after:border-transparent after:border-b-white after:-mb-px
            `;

export function CartDropdownPanel() {
  return (
    <HeaderPopoverPanel
      id={CART_HEADER_POPOVER_ID}
      tabIndex={-1}
      className={cartPanelClassName}
    >
      <CartDropdownContent
        onClose={() => hideHeaderPopover(CART_HEADER_POPOVER_ID)}
      />
    </HeaderPopoverPanel>
  );
}
