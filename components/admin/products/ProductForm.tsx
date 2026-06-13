'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {
  productFormSchema,
  type ProductFormData,
} from '@/lib/validators/admin.product-validation';
import {Button} from '@/components/shared/ui/button';
import {FloatingLabelInput} from '@/components/shared/ui/floatingLabelInput';
import {CustomDateInput} from '@/components/admin/shared/DateInput';
import {useAdmin} from '@/context/AdminProvider';
import {useState, useEffect, useTransition, useRef, useMemo} from 'react';
import {
  findCategoriesForDropdown,
} from '@/components/admin/utils/admin.form-helpers';
import {generateSlug} from '@/components/admin/utils/slug-generator';
import Image from 'next/image';
import {Product} from '@/lib/types/db-types';
import {X} from 'lucide-react';
import CustomSelect from '../shared/Select';
import FileInput from '../shared/FileInput';
import {UploadIcon} from '../shared/UploadIcon';
import {
  createProductWithImages,
  updateProductWithImages,
} from '@/actions/admin/admin.products.actions';
import {toast} from 'sonner';

type ProductFormProps = {
  mode: 'create' | 'edit';
  initialData?: Product | null;
};

export default function ProductForm({mode, initialData}: ProductFormProps) {
  const {categories, closeSidebar} = useAdmin();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(() =>
    mode === 'edit' && initialData?.images ? initialData.images : [],
  );
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [realtimeUpdate, setRealtimeUpdate] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const imageStateKey =
    mode === 'edit' && initialData ? String(initialData.id) : `${mode}-create`;
  const [lastImageStateKey, setLastImageStateKey] = useState(imageStateKey);

  if (imageStateKey !== lastImageStateKey) {
    setLastImageStateKey(imageStateKey);
    setImageError(false);
    if (mode === 'edit' && initialData?.images) {
      setExistingImages(initialData.images);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    } else {
      setExistingImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    }
  }

  const {
    register,
    handleSubmit,
    formState: {errors, isDirty},
    setValue,
    reset,
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: 'Sample test product',
      slug: 'sample-test-product',
      description: 'Sample product description for development.',
      price: 987,
      brand: 'Sample brand',
      color: 'Sample color',
      gender: '',
      category: '',
      sizes: '46, 32/32, XXL, 28/32, S',
      specs:
        'Sample specification line one\nSample specification line two',
      published_at: new Date(),
    },
  });

  // Set initial data
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
        price:
          typeof initialData.price === 'string'
            ? parseFloat(initialData.price)
            : initialData.price,
        brand: initialData.brand,
        color: initialData.color,
        gender: initialData.gender || '',
        category: initialData.category || '',
        sizes: initialData.sizes.join(', '),
        specs: (initialData.specs || []).join('\n'),
        published_at: initialData.published_at
          ? new Date(initialData.published_at)
          : undefined,
      });
    }
  }, [mode, initialData, reset]);

  const selectedMainCategorySlug = useWatch({control, name: 'gender'});
  const watchedName = useWatch({control, name: 'name'});
  const watchedSlug = useWatch({control, name: 'slug'});

  const subCategoryOptions = useMemo(() => {
    if (!selectedMainCategorySlug) return [];

    const selectedMainCategory = categories.find(
      (cat) => cat.slug === selectedMainCategorySlug,
    );

    if (!selectedMainCategory?.children) return [];

    return findCategoriesForDropdown(selectedMainCategory.children, [
      'MAIN-CATEGORY',
      'SUB-CATEGORY',
    ]);
  }, [selectedMainCategorySlug, categories]);

  // Generate slug
  useEffect(() => {
    if (watchedName && mode === 'create') {
      setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, setValue, mode]);

  // Realtime date/time update (mostly unnecessary)
  useEffect(() => {
    if (mode === 'create' && realtimeUpdate) {
      const interval = setInterval(
        () => setValue('published_at', new Date()),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [mode, realtimeUpdate, setValue]);

  const handleImageChange = (files: File[]) => {
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map(URL.createObjectURL)]);
    setImageError(false);
  };

  const handleReset = () => {
    reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      brand: '',
      color: '',
      gender: '',
      category: '',
      sizes: '',
      specs: '',
      published_at: new Date(),
    });
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setImageError(false);
    if (mode === 'create') setRealtimeUpdate(true);
  };

  // Images are handled outside react-hook-form, so flag the error manually
  // when a submit is attempted without any image.
  const onInvalidSubmit = () => {
    if (newImageFiles.length === 0 && existingImages.length === 0) {
      setImageError(true);
    }
  };

  const onSubmit = () => {
    if (newImageFiles.length === 0 && existingImages.length === 0) {
      setImageError(true);
      return;
    }
    setImageError(false);
    startTransition(async () => {
      if (!formRef.current) return;

      const formData = new FormData(formRef.current);
      newImageFiles.forEach((file) => formData.append('images', file));
      if (mode === 'edit') {
        existingImages.forEach((url) => formData.append('existingImages', url));
      }

      const result =
        mode === 'edit' && initialData
          ? await updateProductWithImages(initialData.id, formData)
          : await createProductWithImages(formData);

      if (result.success) {
        toast.success(
          mode === 'edit' ? 'Product updated!' : 'Product created!'
        );
        closeSidebar();
        handleReset();
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && newImagePreviews.length > 0) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [newImagePreviews]);

  return (
    <form
      ref={formRef}
      // eslint-disable-next-line react-hooks/refs -- react-hook-form submit handler
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      onReset={handleReset}
      className='flex flex-col h-full'
    >
      <div
        ref={scrollContainerRef}
        className='flex-1 space-y-4 scrollbar-hide overflow-y-auto pt-5 pb-16 px-1 '
      >
        <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
          <Controller
            name='gender'
            control={control}
            render={({field}) => (
              <CustomSelect
                {...field}
                hasError={!!errors.gender}
                options={categories.map((c) => ({
                  value: c.slug,
                  label: c.name,
                }))}
                placeholder='Select main category *'
              />
            )}
          />
          {mode === 'edit' && initialData && (
            <input type='hidden' {...register('gender')} />
          )}
          {errors.gender && (
            <p className='text-xs text-destructive font-medium ml-1 -mt-2.5 '>
              {errors.gender.message}
            </p>
          )}
          <Controller
            control={control}
            name='category'
            render={({field}) => (
              <CustomSelect
                {...field}
                hasError={!!errors.category}
                value={field.value}
                disabled={
                  !selectedMainCategorySlug || subCategoryOptions.length === 0
                }
                options={subCategoryOptions.map((o) => ({
                  value: o.slug,
                  label: o.label,
                }))}
                placeholder={
                  !selectedMainCategorySlug
                    ? 'Select main category first'
                    : 'Select subcategory *'
                }
              />
            )}
          />
          {mode === 'edit' && initialData && (
            <input type='hidden' {...register('category')} />
          )}

          {errors.category && (
            <p className='text-xs text-destructive font-medium ml-1 -mt-2.5'>
              {errors.category.message}
            </p>
          )}
        </div>
        <div className='grid gap-4 grid-cols-2 w-full'>
          <FloatingLabelInput
            {...register('name')}
            id='product-name'
            label='Product name *'
            type='text'
            hasError={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <FloatingLabelInput
            {...register('slug')}
            id='product-slug'
            value={watchedSlug}
            label='Slug *'
            type='text'
            hasError={!!errors.slug}
            errorMessage={errors.slug?.message}
          />
          <FloatingLabelInput
            {...register('price')}
            id='product-price'
            label='Pris (SEK) *'
            type='number'
            hasError={!!errors.price}
            errorMessage={errors.price?.message}
          />
          <FloatingLabelInput
            {...register('brand')}
            id='product-brand'
            label='Brand *'
            type='text'
            hasError={!!errors.brand}
            errorMessage={errors.brand?.message}
          />
          <FloatingLabelInput
            {...register('color')}
            id='product-color'
            label='Color *'
            type='text'
            hasError={!!errors.color}
            errorMessage={errors.color?.message}
          />
          <FloatingLabelInput
            {...register('sizes')}
            id='product-sizes'
            label='Sizes *'
            type='text'
            hasError={!!errors.sizes}
            errorMessage={errors.sizes?.message}
          />
          <FloatingLabelInput
            {...register('description')}
            id='product-description'
            label='Description *'
            as='textarea'
            rows={3}
            className='w-full col-span-2'
            hasError={!!errors.description}
            errorMessage={errors.description?.message}
          />
          <FloatingLabelInput
            {...register('specs')}
            id='product-specs'
            label='Specifications (one per line)'
            as='textarea'
            className='w-full col-span-2'
            rows={5}
            hasError={!!errors.specs}
            errorMessage={errors.specs?.message}
          />
          <Controller
            name='published_at'
            control={control}
            render={({field}) => (
              <CustomDateInput
                {...field}
                id='product-published_at'
                label='Publish date'
                value={field.value || null}
                onChange={(date) => {
                  field.onChange(date);
                  if (mode === 'create') setRealtimeUpdate(false);
                }}
                className='w-full col-span-2 mb-4'
                hasError={!!errors.published_at}
                errorMessage={errors.published_at?.message}
              />
            )}
          />
        </div>
        <div className='sticky -top-5 z-10 pb-2.5 bg-white'>
          <FileInput
            id='image-upload'
            multiple
            accept='image/*'
            onFilesSelected={handleImageChange}
            hasError={imageError}
            errorMessage='At least one image is required'
          >
            <UploadIcon
              message={
                newImageFiles.length === 0 && existingImages.length === 0
                  ? 'At least one image is required *'
                  : ''
              }
            />
          </FileInput>
        </div>
        {(existingImages.length > 0 || newImagePreviews.length > 0) && (
          <div className='mt-2 space-y-4'>
            {existingImages.length > 0 && (
              <div>
                <p className='text-sm font-medium mb-1'>Existing images:</p>
                <div className='grid grid-cols-2 gap-1 mb-8'>
                  {existingImages.map((src, i) => (
                    <div key={`existing-${i}`} className='relative group'>
                      <Image
                        src={src}
                        height={400}
                        width={300}
                        alt={`Image ${i + 1}`}
                      />
                      <button
                        type='button'
                        className='absolute group-hover:opacity-100 opacity-0 group-active:opacity-100 transition-opacity duration-300 group-hover:bg-white/60 cursor-pointer top-1 right-1 p-2'
                        onClick={() =>
                          setExistingImages(
                            existingImages.filter((_, idx) => i !== idx)
                          )
                        }
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {newImagePreviews.length > 0 && (
              <div>
                <p className='text-sm font-medium mb-1'>New images:</p>
                <div className='grid grid-cols-2 gap-1 mb-8'>
                  {newImagePreviews.map((src, i) => (
                    <div key={`new-${i}`} className='relative group'>
                      <Image
                        src={src}
                        height={400}
                        width={300}
                        alt={`New image ${i + 1}`}
                      />
                      <button
                        type='button'
                        className='absolute group-hover:opacity-100 opacity-0 group-active:opacity-100 transition-opacity duration-300 group-hover:bg-white/60 cursor-pointer top-1 right-1 p-2'
                        onClick={() => {
                          setNewImagePreviews(
                            newImagePreviews.filter((_, idx) => i !== idx)
                          );

                          setNewImageFiles(
                            newImageFiles.filter((_, idx) => i !== idx)
                          );
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='flex w-full gap-2 pb-6 pt-3'>
        <Button
          className='w-full mt-0 h-14'
          type='submit'
          disabled={isPending || (mode === 'edit' && !isDirty)}
        >
          {isPending
            ? 'Saving...'
            : mode === 'edit'
              ? 'Update product'
              : 'Save product'}
        </Button>
        <Button
          className='w-full mt-0 h-14'
          variant='outline'
          type='reset'
          disabled={isPending}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
