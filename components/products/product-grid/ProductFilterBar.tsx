'use client';

interface FilterBarProps {
  dialogId: string;
  onOpen: () => void;
  totalCount: number;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  dialogId,
  onOpen,
  totalCount,
  activeFilterCount,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className='sticky top-14 w-full bg-white py-4 pb-5 px-4 sm:px-8 text-base flex justify-between items-center z-20'>
      <button
        type='button'
        command='show-modal'
        commandfor={dialogId}
        onClick={onOpen}
        className='flex items-center gap-2 hover:text-gray-700 transition-colors cursor-pointer'
      >
        <span
          className={`text-[13px] font-semibold uppercase group ${hasActiveFilters ? 'text-black' : ''}`}
        >
          Filter and sort{' '}
          {hasActiveFilters && (
            <span className='inline-flex items-center text-black  '>
              ({activeFilterCount})
            </span>
          )}
        </span>
      </button>
      <span className=' text-xs   font-semibold text-gray-600'>
        {totalCount}{' '}
        <span className=''>{totalCount === 1 ? 'product' : 'products'}</span>
      </span>
    </div>
  );
}
