import {z} from 'zod';
import {createInsertSchema} from 'drizzle-zod';
import {productsTable} from '@/drizzle/db/schema';

export const productFormSchema = createInsertSchema(productsTable, {
  price: z.coerce
    .number({required_error: 'Price is required.'})
    .positive('Price must be a positive number.'),

  sizes: z.string().min(1, {message: 'At least one size is required.'}),

  specs: z.string().optional(),

  published_at: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.date().optional(),
  ),
})
  .omit({
    images: true,
    id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    name: z.string().min(3, 'Product name must be at least 3 characters.'),
    slug: z
      .string()
      .min(1, 'Slug cannot be empty.')
      .regex(
        /^[a-z0-9-]+$/,
        'Slug may only contain lowercase letters, numbers, and hyphens.',
      ),
    description: z.string().min(1, 'Description cannot be empty.'),
    brand: z.string().min(1, 'Brand is required.'),
    gender: z
      .string({required_error: 'You must select a main category.'})
      .min(1, 'You must select a main category.'),
    category: z
      .string({required_error: 'You must select a subcategory.'})
      .min(1, 'You must select a subcategory.'),
    color: z.string().min(1, 'Color is required.'),
  });

export type ProductFormData = z.infer<typeof productFormSchema>;

// Extends the form schema with API-oriented transforms.
export const productApiSchema = productFormSchema.extend({
  sizes: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim().length > 0) {
        return val
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    },
    z.array(z.string()).min(1, {message: 'At least one size is required.'}),
  ),
  specs: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim().length > 0) {
      return val
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, z.array(z.string()).optional()),
});
