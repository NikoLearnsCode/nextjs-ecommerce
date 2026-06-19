'use client';

import {MotionCloseX} from '@/components/shared/AnimatedSidebar';

interface MobileCloseButtonProps {
  onClose: () => void;
}

/** Close (X) button pinned to the top-right of a mobile view header. */
export function MobileCloseButton({onClose}: MobileCloseButtonProps) {
  return (
    <div className='absolute top-0 right-0 z-10'>
      <MotionCloseX
        onClick={onClose}
        size={14}
        strokeWidth={1.5}
        className='py-5 px-4'
      />
    </div>
  );
}
