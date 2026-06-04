'use client';

import {ModalDialog} from '@/components/shared/modal/ModalDialog';
import {ModalCloseButton} from '@/components/shared/modal/ModalCloseButton';
import {FocusHeading} from '@/components/shared/FocusHeading';
import {useEffect, useId, useRef, useState} from 'react';
import ProductForm from './products/ProductForm';
import CategoryForm from './categories/CategoryForm';
import {useAdmin} from '@/context/AdminProvider';
import {Product} from '@/lib/types/db-types';
import {Category} from '@/lib/types/category-types';
import {ADMIN_FORM_DIALOG_ID} from './adminForm.constants';
import {focusInitialIn} from '@/lib/focus';

type FormView = {
  type: 'category' | 'product';
  data: Category | Product | null;
  session: number;
};

export default function FormWrapper({onClose}: {onClose: () => void}) {
  const {activeSidebar, editData} = useAdmin();
  const titleId = useId();

  const isFormOpen = activeSidebar !== null;

  // Bump a session id synchronously the moment the panel transitions to open.
  // The form is keyed off it so react-hook-form re-seeds its defaults on each
  // open (even on a rapid close → reopen).
  const sessionRef = useRef(0);
  const wasOpenRef = useRef(false);
  if (isFormOpen && !wasOpenRef.current) sessionRef.current += 1;
  wasOpenRef.current = isFormOpen;

  // Derive the open form straight from context state so its content renders in
  // the same commit the <dialog> opens — no effect round-trip, so the panel is
  // never shown empty regardless of how slow React updates land.
  const liveView: FormView | null = activeSidebar
    ? {type: activeSidebar, data: editData, session: sessionRef.current}
    : null;

  // While closing, keep showing the last view so the panel doesn't flash empty
  // during the slide-out animation.
  const [lastView, setLastView] = useState<FormView | null>(null);
  useEffect(() => {
    if (activeSidebar) {
      setLastView({
        type: activeSidebar,
        data: editData,
        session: sessionRef.current,
      });
    }
  }, [activeSidebar, editData]);

  const view = liveView ?? lastView;

  // Opening is owned by the browser: trigger buttons use the Invoker Commands
  // API (command="show-modal" / commandfor) so the native <dialog> gets proper
  // modality, focus trapping and Escape handling. React only handles the rest:
  //
  // - On open, native showModal lands focus on the first tabbable control, so
  //   move it to the heading instead (FocusHeading carries [data-initial-focus]).
  // - On a React-driven close (a successful submit calls closeSidebar), reflect
  //   that single close onto the dialog and unmount the form after its close
  //   animation finishes. User-driven closes (X button, backdrop, Escape) are
  //   handled natively and only sync React state back via onClose.
  useEffect(() => {
    const dialog = document.getElementById(
      ADMIN_FORM_DIALOG_ID,
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    if (isFormOpen) {
      const frame = requestAnimationFrame(() => focusInitialIn(dialog));
      return () => cancelAnimationFrame(frame);
    }

    if (dialog.open) dialog.close();
    const timer = setTimeout(() => setLastView(null), 500);
    return () => clearTimeout(timer);
  }, [isFormOpen]);

  const isEditMode = view?.data != null;

  const isProduct = (data: Category | Product | null): data is Product =>
    data !== null && 'price' in data;

  const isCategory = (data: Category | Product | null): data is Category =>
    data !== null && 'type' in data;

  const renderForm = () => {
    if (!view) return null;

    switch (view.type) {
      case 'product':
        return (
          <ProductForm
            mode={isEditMode ? 'edit' : 'create'}
            initialData={isProduct(view.data) ? view.data : null}
          />
        );
      case 'category':
        return (
          <CategoryForm
            mode={isEditMode ? 'edit' : 'create'}
            initialData={isCategory(view.data) ? view.data : null}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (!view) return '';
    if (view.type === 'product') {
      return isEditMode ? 'edit product' : 'new product';
    }
    return isEditMode ? 'edit category' : 'new category';
  };

  return (
    <ModalDialog
      id={ADMIN_FORM_DIALOG_ID}
      variant='right'
      className='w-full max-w-full sm:max-w-[640px]'
      onClose={onClose}
      aria-labelledby={titleId}
    >
      <div className='flex flex-col h-full bg-white outline-none'>
        <div className='flex justify-between items-center pl-4 sm:pl-6 pt-4 pb-0.5'>
          <FocusHeading
            as='h1'
            id={titleId}
            className='font-medium uppercase text-base'
          >
            {getTitle()}
          </FocusHeading>
          <ModalCloseButton
            dialogId={ADMIN_FORM_DIALOG_ID}
            size={16}
            strokeWidth={2}
            className='px-7 py-3'
            aria-label='Close form'
          />
        </div>

        <div
          key={view?.session}
          className='px-4 sm:px-6 flex-1 overflow-y-auto'
        >
          {renderForm()}
        </div>
      </div>
    </ModalDialog>
  );
}
