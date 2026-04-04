'use client';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/** Hamburger toggle for mobile navigation */
export function MobileMenuButton({isOpen, onClick}: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className='flex flex-col gap-[3px] py-2 mb-1 items-center group relative cursor-pointer'
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span className='w-5 border-t-[1px] border-black/90' />
      <span className='w-5 border-t-[1px] border-black/90' />
      <span className='w-5 border-t-[1px] border-black/90' />
    </button>
  );
}
