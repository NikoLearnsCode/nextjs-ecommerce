
'use client';

import {Controller, useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Category} from '@/lib/types/category-types';
import {useAdmin} from '@/context/AdminProvider';
import {
  categoryFormSchema,
  CategoryFormData,
  CATEGORY_TYPE_OPTIONS,
} from '@/lib/validators/admin.category-validation';
import {useEffect, useMemo, useRef, useState, useTransition} from 'react';
import {
  createCategoryWithImages,
  updateCategoryWithImages,
} from '@/actions/admin/admin.categories.actions';
import {toast} from 'sonner';
import {FloatingLabelInput} from '@/components/shared/ui/floatingLabelInput';
import {Button} from '@/components/shared/ui/button';
import {CheckboxOption} from '@/components/shared/ui/CheckboxOption';
import {generateSlug} from '@/components/admin/utils/slug-generator';
import CustomSelect from '../shared/Select';
import {
  findCategoriesForDropdown,
  createCategoryLookupMap,
} from '@/components/admin/utils/admin.form-helpers';
import {X} from 'lucide-react';
import FileInput from '../shared/FileInput';
import {UploadIcon} from '../shared/UploadIcon';
import Image from 'next/image';

type CategoryFormProps = {
  mode: 'create' | 'edit';
  initialData?: Category | null;
};

export default function CategoryForm({mode, initialData}: CategoryFormProps) {
  const {closeSidebar, categories} = useAdmin();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string>(() =>
    mode === 'edit' ? (initialData?.desktopImage ?? '') : '',
  );
  const [mobilePreview, setMobilePreview] = useState<string>(() =>
    mode === 'edit' ? (initialData?.mobileImage ?? '') : '',
  );
  const [desktopImageError, setDesktopImageError] = useState(false);
  const [mobileImageError, setMobileImageError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors, isDirty},
    setValue,
    reset,
    control,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',

      slug: '',
      type: undefined,
      displayOrder: 0,
      isActive: true,
      parentId: null,
    },
  });

  const handleDesktopImageSelect = (files: File[]) => {
    if (files && files[0]) {
      const file = files[0];
      setDesktopImage(file);
      setDesktopImageError(false);
      const reader = new FileReader();
      reader.onload = (e) => setDesktopPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageSelect = (files: File[]) => {
    if (files && files[0]) {
      const file = files[0];
      setMobileImage(file);
      setMobileImageError(false);
      const reader = new FileReader();
      reader.onload = (e) => setMobilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearDesktopImage = () => {
    setDesktopImage(null);
    setDesktopPreview('');
  };

  const clearMobileImage = () => {
    setMobileImage(null);
    setMobilePreview('');
  };

  // Category lookup by ID is used below
  const categoryLookup = useMemo(
    () => createCategoryLookupMap(categories),
    [categories]
  );

  const formSyncKey =
    mode === 'edit' && initialData ? String(initialData.id) : `${mode}-create`;
  const [lastFormSyncKey, setLastFormSyncKey] = useState(formSyncKey);

  if (formSyncKey !== lastFormSyncKey) {
    setLastFormSyncKey(formSyncKey);
    setDesktopImageError(false);
    setMobileImageError(false);
    if (mode === 'edit' && initialData) {
      setDesktopPreview(initialData.desktopImage ?? '');
      setMobilePreview(initialData.mobileImage ?? '');
      setDesktopImage(null);
      setMobileImage(null);
    } else {
      setDesktopPreview('');
      setMobilePreview('');
      setDesktopImage(null);
      setMobileImage(null);
    }
  }

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        type: initialData.type,
        displayOrder: initialData.displayOrder,
        isActive: initialData.isActive,
        parentId: initialData.parentId || null,
      });
    }
  }, [mode, initialData, reset]);

  const watchedName = useWatch({control, name: 'name'});
  const watchedSlug = useWatch({control, name: 'slug'});

  useEffect(() => {
    if (watchedName && mode === 'create') {
      const slug = generateSlug(watchedName);
      setValue('slug', slug);
    }
  }, [watchedName, setValue, mode]);

  const watchedType = useWatch({control, name: 'type'});
  const watchedIsActive = useWatch({control, name: 'isActive'});

  const isParentSelectionEnabled = Boolean(
    watchedType &&
      (watchedType === 'CONTAINER' || watchedType === 'SUB-CATEGORY')
  );

  // Fetch all possible parent categories based on category type
  const getValidParentOptions = () => {
    if (!watchedType || watchedType === 'MAIN-CATEGORY') return [];
    const allPossibleParents = findCategoriesForDropdown(categories, [
      'MAIN-CATEGORY',
      'CONTAINER',
    ]);
    // For CONTAINER, only MAIN-CATEGORY may be parent; widen by changing allowedTypes
    if (watchedType === 'CONTAINER') {
      return allPossibleParents.filter((parent) => {
        const parentCategory = categoryLookup.get(parent.value);
        const allowedTypes = ['MAIN-CATEGORY'];
        return parentCategory && allowedTypes.includes(parentCategory.type);
      });
    }
    return allPossibleParents;
  };

  const handleReset = () => {
    reset({
      name: '',
      slug: '',
      type: undefined,
      displayOrder: 0,
      isActive: true,
      parentId: null,
    });

    setDesktopImage(null);
    setDesktopPreview('');
    setMobileImage(null);
    setMobilePreview('');
    setDesktopImageError(false);
    setMobileImageError(false);
  };

  // Hero images are handled outside react-hook-form, so flag the error
  // manually when a MAIN-CATEGORY is submitted without both images. Doubles as
  // the react-hook-form onInvalid handler so the state stays in sync.
  const validateImages = () => {
    if (watchedType !== 'MAIN-CATEGORY') return true;
    const missingDesktop = !desktopPreview;
    const missingMobile = !mobilePreview;
    setDesktopImageError(missingDesktop);
    setMobileImageError(missingMobile);
    return !missingDesktop && !missingMobile;
  };

  // form action + react-hook-form wrapper
  // Client-side validation before submitting to the server
  const onSubmit = () => {
    if (!validateImages()) return;
    startTransition(async () => {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);

      if (desktopImage) formData.append('desktopImageFile', desktopImage);
      if (mobileImage) formData.append('mobileImageFile', mobileImage);

      if (mode === 'edit') {
        if (initialData?.desktopImage && !desktopPreview)
          formData.set('desktopImage', '');
        if (initialData?.mobileImage && !mobilePreview)
          formData.set('mobileImage', '');
      }

      const result =
        mode === 'edit' && initialData
          ? await updateCategoryWithImages(initialData.id, formData)
          : await createCategoryWithImages(formData);

      if (result.success) {
        closeSidebar();
        handleReset();
        toast.success(
          mode === 'edit' ? 'Category updated' : 'Category created'
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form
      ref={formRef}
      // react-hook-form reads refs inside handleSubmit; safe here.
      // eslint-disable-next-line react-hooks/refs -- react-hook-form submit handler
      onSubmit={handleSubmit(onSubmit, validateImages)}
      className='space-y-5 h-full flex flex-col'
    >
      <div className='flex-1 space-y-4 overflow-y-auto pt-5 pb-2 scrollbar-hide px-1'>
        <div>
          <Controller
            name='type'
            control={control}
            render={({field}) => (
              <CustomSelect
                {...field}
                hasError={!!errors.type}
                options={CATEGORY_TYPE_OPTIONS}
                placeholder='Select category type *'
                disabled={mode === 'edit'}
              />
            )}
          />
          {errors.type && (
            <p className='text-red-500 font-medium text-xs mt-1 ml-1'>
              {errors.type.message}
            </p>
          )}
          {mode === 'edit' && initialData && (
            <input
              type='hidden'
              {...register('type')}
              value={initialData.type}
            />
          )}
        </div>
        <div>
          <Controller
            name='parentId'
            control={control}
            render={({field}) => (
              <CustomSelect
                {...field}
                value={field.value || ''}
                hasError={!!errors.parentId && isParentSelectionEnabled}
                options={getValidParentOptions().map((p) => ({
                  value: p.value,
                  label: p.label,
                }))}
                placeholder={
                  !isParentSelectionEnabled
                    ? 'Not applicable'
                    : 'Select parent category *'
                }
                disabled={!isParentSelectionEnabled || mode === 'edit'}
              />
            )}
          />
          {mode === 'edit' && initialData && (
            <input
              type='hidden'
              {...register('parentId')}
              value={initialData.parentId || ''}
            />
          )}
          {errors.parentId && isParentSelectionEnabled && (
            <p className='text-red-500 font-medium text-xs ml-1 mt-1'>
              {errors.parentId.message}
            </p>
          )}
        </div>
        <FloatingLabelInput
          {...register('name')}
          id='category-name'
          label='Category name *'
          type='text'
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <FloatingLabelInput
          {...register('slug')}
          id='category-slug'
          value={watchedSlug}
          label='Slug *'
          type='text'
          hasError={!!errors.slug}
          errorMessage={errors.slug?.message}
        />
        <FloatingLabelInput
          {...register('displayOrder')}
          id='category-display-order'
          label='Display order'
          className='mb-8'
          type='number'
          hasError={!!errors.displayOrder}
          errorMessage={errors.displayOrder?.message}
        />
        <CheckboxOption
          labelClassName=' font-medium '
          className='ml-1 w-7 h-6 checked:bg-[length:1.25rem_1.25rem]'
          {...register('isActive')}
          id='category-is-active'
          label={watchedIsActive ? 'Active' : 'Inactive'}
          checked={watchedIsActive}
        />

        {watchedType === 'MAIN-CATEGORY' && (
          <div className='z-10 pb-2.5 pt-7 bg-white space-y-2'>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                <span className='font-semibold'>Desktop image</span> (16:9)
              </label>
              <FileInput
                onFilesSelected={handleDesktopImageSelect}
                accept='image/*'
                className='w-full'
                id='desktop-image-upload'
                hasError={desktopImageError}
                errorMessage='A desktop image is required'
              >
                <UploadIcon
                  message={!desktopPreview ? 'Image is required *' : ''}
                />
              </FileInput>

              {desktopPreview && (
                <div className='mt-2.5 mb-10 relative group'>
                  <Image
                    src={desktopPreview}
                    alt='Desktop preview'
                    className='w-full h-full object-cover'
                    width={700}
                    height={300}
                    quality={100}
                  />
                  <button
                    type='button'
                    onClick={clearDesktopImage}
                    className='absolute p-2  group-hover:opacity-100 opacity-0 group-active:opacity-100 transition-opacity duration-300 group-hover:bg-white/60 cursor-pointer top-1 right-1'
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <div className='mt-6'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                <span className='font-semibold'>Mobile image</span> (9:16)
              </label>
              <FileInput
                onFilesSelected={handleMobileImageSelect}
                accept='image/*'
                className='w-full'
                id='mobile-image-upload'
                hasError={mobileImageError}
                errorMessage='A mobile image is required'
              >
                <UploadIcon
                  message={!mobilePreview ? 'Image is required *' : ''}
                />
              </FileInput>
              {mobilePreview && (
                <div className='mt-2.5 relative group'>
                  <Image
                    src={mobilePreview}
                    alt='Mobile preview'
                    className='w-full object-contain'
                    width={300}
                    height={700}
                    quality={100}
                  />
                  <button
                    type='button'
                    onClick={clearMobileImage}
                    className='absolute p-2  group-hover:opacity-100 opacity-0 group-active:opacity-100 transition-opacity duration-300 group-hover:bg-white/60 cursor-pointer top-1 right-1'
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className='flex gap-3 pt-3 pb-6'>
        <Button
          type='submit'
          disabled={isPending || (mode === 'edit' && !isDirty)}
          className='h-14 mt-0 w-full'
        >
          {isPending
            ? 'Saving...'
            : mode === 'edit'
              ? 'Update category'
              : 'Create category'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={closeSidebar}
          disabled={isPending}
          className='w-full h-14 mt-0'
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
