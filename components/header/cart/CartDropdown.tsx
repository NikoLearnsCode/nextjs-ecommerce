'use client';

import {CartButton} from './CartButton';
import {CartDropdownPanel} from './CartDropdownPanel';

export default function CartDropdown() {
  return (
    <div className='relative'>
      <CartButton />
      <CartDropdownPanel />
    </div>
  );
}
