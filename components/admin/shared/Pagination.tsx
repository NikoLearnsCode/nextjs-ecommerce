'use client';

import {useEffect} from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import CustomSelect from './Select';

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
};

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentPage]);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const itemsPerPageOptions = [
    {value: 25, label: '25'},
    {value: 50, label: '50'},
    {value: 100, label: '100'},
  ];

  return (
    <div className='flex items-center pt-8 justify-between px-6 py-3.5 bg-white border-t border-gray-200'>
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        <span>Show</span>
        <div className='w-20'>
          <CustomSelect
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            options={itemsPerPageOptions}
            variant='compact'
            openUpward
          />
        </div>
        <span>per page</span>
      </div>

      <div className='flex items-center gap-6'>
        <div className='text-sm text-gray-600'>
          {startItem}–{endItem} of {totalItems}
        </div>

        <div className='flex items-center gap-1'>
          <button
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className='p-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors'
            aria-label='First page'
          >
            <FiChevronsLeft size={16} strokeWidth={2} />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className='p-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors'
            aria-label='Previous page'
          >
            <FiChevronLeft size={16} strokeWidth={2} />
          </button>

          <div className='px-4 text-sm text-gray-900 font-medium'>
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className='p-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors'
            aria-label='Next page'
          >
            <FiChevronRight size={16} strokeWidth={2} />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className='p-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors'
            aria-label='Last page'
          >
            <FiChevronsRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
