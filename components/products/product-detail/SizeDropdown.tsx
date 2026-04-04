'use client';

import {useState} from 'react';
import {motion} from 'framer-motion';
import {ChevronDown} from 'lucide-react';
import {twMerge} from 'tailwind-merge';

type SizeDropdownProps = {
  sizes: string[];
  selectedSize: string | null;
  showWarning: boolean;
  onSelect: (size: string) => void;
};

export default function SizeDropdown({
  sizes,
  selectedSize,
  showWarning,
  onSelect,
}: SizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Previously: expanded the list when selectedSize was cleared after add to cart — left disabled so the UI does not “reset” the chosen size
  // useEffect(() => {
  //   if (!selectedSize) {
  //     setIsOpen(true);
  //   }
  // }, [selectedSize]);

  const showWarningState = showWarning && !selectedSize;

  return (
    <div className='hidden lg:flex flex-col pt-2 pb-6'>
      <div className='h-5'>
        {showWarningState && (
          <p className='text-red-900 text-xs font-semibold'>
            Please select a size
          </p>
        )}
      </div>
      <motion.div
        initial={false}
        animate={{height: isOpen ? 'auto' : 48}}
        transition={{duration: 0.3, ease: [0.25, 1, 0.5, 1]}}
        className='relative overflow-hidden border-t border-b border-gray-300 transition-colors duration-200 hover:border-gray-500'
      >
        <motion.button
          type='button'
          tabIndex={isOpen ? -1 : 0}
          animate={{opacity: isOpen ? 0 : 1}}
          transition={{duration: 0.2}}
          style={{pointerEvents: isOpen ? 'none' : 'auto'}}
          className='absolute top-0 left-0 w-full h-12 flex items-center justify-between px-3.5 cursor-pointer outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black'
          onClick={() => setIsOpen(true)}
        >
          <span
            className={twMerge(
              'font-semibold uppercase text-xs',
              selectedSize ? 'text-black' : 'text-gray-500',
            )}
          >
            {selectedSize}
          </span>
          <ChevronDown size={22} strokeWidth={1} />
        </motion.button>

        <motion.div
          animate={{opacity: isOpen ? 1 : 0}}
          transition={{duration: 0.2}}
          style={{pointerEvents: isOpen ? 'auto' : 'none'}}
          className='w-full'
        >
          <div className='max-h-48 overflow-y-auto py-0.25'>
            {sizes.map((size) => (
              <button
                key={size}
                type='button'
                tabIndex={isOpen ? 0 : -1}
                className={twMerge(
                  'w-full text-left py-2.5 px-3.5 text-xs font-semibold cursor-pointer transition-colors hover:bg-gray-100 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black',
                  selectedSize === size ? 'bg-gray-100 font-bold' : '',
                )}
                onClick={() => {
                  onSelect(size);
                  setIsOpen(false);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
