'use client';

import React, {useRef, useEffect, useState} from 'react';
import {ArrowLeft, Search} from 'lucide-react';
import {motion} from 'framer-motion';
import {useRouter} from 'next/navigation';
import {MotionCloseX} from '../../shared/AnimatedSidebar';
import {useNavigatedHistory} from '@/context/NavigatedHistoryProvider';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {safeFocus} from '@/lib/focus';

export default function SearchBar() {
  const {isSearchExpanded, setIsSearchExpanded, collapseSearch} =
    useHeaderSearchUi();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const wasSearchExpandedRef = useRef(false);
  const {handleSaveSearch} = useNavigatedHistory();

  useEffect(() => {
    if (wasSearchExpandedRef.current && !isSearchExpanded) {
      const id = requestAnimationFrame(() => {
        safeFocus(searchTriggerRef.current);
      });
      return () => cancelAnimationFrame(id);
    }
    wasSearchExpandedRef.current = isSearchExpanded;
  }, [isSearchExpanded]);

  useEffect(() => {
    if (!isSearchExpanded && searchQuery !== '') {
      setSearchQuery('');
    }
  }, [isSearchExpanded, searchQuery]);

  useKeyboardShortcut('Escape', collapseSearch, isSearchExpanded);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      handleSaveSearch(trimmedQuery);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      collapseSearch();
      setSearchQuery('');
    }
  };

  return (
    <div
      className={`flex items-center  justify-end ${isSearchExpanded ? 'w-full' : ''}`}
    >
      {isSearchExpanded ? (
        <form
          key='search-form'
          name='search-form'
          className='flex items-center w-full fixed top-0  right-0 h-16  lg:h-auto z-50 lg:relative bg-white pr-5.5 lg:px-0'
          onSubmit={handleSubmit}
        >
          <button
            type='button'
            className=' lg:hidden p-4'
            onClick={collapseSearch}
            aria-label='Close search'
          >
            <ArrowLeft size={22} strokeWidth={1} className='text-black' />
          </button>
          <input
            maxLength={100}
            ref={inputRef}
            type='text'
            name='search'
            autoFocus={true}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='SEARCH'
            className='w-full py-0.75 font-medium text-sm uppercase lg:py-0.5 pl-0.5 lg:pr-4 lg:mb-1 placeholder:text-xs placeholder:text-black placeholder:font-semibold bg-white outline-none border-b border-gray-900 '
          />

          <MotionCloseX
            onClick={collapseSearch}
            size={12}
            strokeWidth={2}
            className='px-3 pt-1.5 pb-1 lg:mb-0.5 absolute top-0 -right-3 hidden lg:block'
            aria-label='Close search'
          />
        </form>
      ) : (
        <motion.button
          ref={searchTriggerRef}
          type='button'
          key='search-button'
          onClick={() => setIsSearchExpanded(true)}
          className=' cursor-pointer'
          aria-label='Search'
          aria-expanded={false}
        >
          <Search size={22} strokeWidth={1} className='lg:hidden' />
          <span className='hidden  lg:block text-xs font-semibold uppercase border-b border-transparent hover:border-black transition'>
            Search
          </span>
        </motion.button>
      )}
    </div>
  );
}
