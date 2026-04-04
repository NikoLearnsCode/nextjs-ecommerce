import {
  MotionDropdown,
  MotionOverlay,
  MotionCloseX,
} from '@/components/shared/AnimatedSidebar';
import {AnimatePresence} from 'framer-motion';
import {useEffect, useId, useRef} from 'react';
import ProductForm from './products/ProductForm';
import CategoryForm from './categories/CategoryForm';
import {useAdmin} from '@/context/AdminProvider';
import {Product} from '@/lib/types/db-types';
import {Category} from '@/lib/types/category-types';
import {useFocusTrap} from '@/hooks/useFocusTrap';

export default function FormWrapper({onClose}: {onClose: () => void}) {
  const {activeSidebar, editData} = useAdmin();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const isFormOpen = activeSidebar !== null;
  useFocusTrap(panelRef, isFormOpen);

  useEffect(() => {
    if (!isFormOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isFormOpen, onClose]);

  const renderForm = () => {
    const isEditMode = editData !== null;

    const isProduct = (data: Category | Product | null): data is Product => {
      return data !== null && 'price' in data;
    };

    const isCategory = (data: Category | Product | null): data is Category => {
      return data !== null && 'type' in data;
    };

    switch (activeSidebar) {
      case 'product':
        const productData = isEditMode && isProduct(editData) ? editData : null;
        return (
          <ProductForm
            mode={isEditMode ? 'edit' : 'create'}
            initialData={productData}
          />
        );
      case 'category':
        const categoryData =
          isEditMode && isCategory(editData) ? editData : null;
        return (
          <CategoryForm
            mode={isEditMode ? 'edit' : 'create'}
            initialData={categoryData}
          />
        );
      default:
        return null;
    }
  };

  const isEditMode = editData !== null;

  const getTitle = () => {
    if (activeSidebar === 'product') {
      return isEditMode ? 'edit product' : 'new product';
    }
    return isEditMode ? 'edit category' : 'new category';
  };

  const title = getTitle();

  return (
    <>
      <AnimatePresence>
        {isFormOpen && (
          <>
            <MotionOverlay id='admin-form-overlay' onClick={onClose} />
            <MotionDropdown
              position='right'
              className='max-w-full min-w-full  sm:max-w-[640px] sm:min-w-[640px]'
            >
              <div
                ref={panelRef}
                tabIndex={-1}
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                className='flex flex-col h-screen bg-white outline-none'
              >
                <div className='flex   justify-between items-center pl-4 sm:pl-6 pt-4 pb-0.5'>
                  <h1
                    id={titleId}
                    className='font-medium    uppercase text-base'
                  >
                    {title}
                  </h1>
                  <MotionCloseX
                    onClick={onClose}
                    size={16}
                    strokeWidth={2}
                    className='px-7 py-3 '
                    aria-label='Close form'
                  />
                </div>

                <div className='px-4 sm:px-6  flex-1 overflow-y-auto'>
                  {renderForm()}
                </div>
              </div>
            </MotionDropdown>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
