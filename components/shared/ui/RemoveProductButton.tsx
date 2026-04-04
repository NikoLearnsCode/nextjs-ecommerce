'use client';

import {twMerge} from 'tailwind-merge';

type RemoveProductButtonProps = {
  isPending: boolean;
  onClick: () => void;
  className?: string;
};

const baseClassName =
  'text-[11px] font-medium underline transition-colors hover:text-red-900 disabled:opacity-50 font-medium cursor-pointer  disabled:cursor-not-allowed';

export default function RemoveProductButton({
  isPending,
  onClick,
  className,
}: RemoveProductButtonProps) {
  return (
    <button
      type='button'
      className={twMerge(baseClassName, className)}
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? 'Removing' : 'Remove'}
    </button>
  );
}
