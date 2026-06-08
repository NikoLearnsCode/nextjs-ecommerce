'use server';

import {db} from '@/drizzle/index';
import {eq, desc, or, ilike, sql, not, and} from 'drizzle-orm';

import {productApiSchema} from '@/lib/validators/admin.product-validation';
import {productsTable} from '@/drizzle/db/schema';
import {Product} from '@/lib/types/db-types';
import {ActionResult} from '@/lib/types/query-types';
import {isAdmin} from '@/lib/admin-guard';
import {revalidatePath} from 'next/cache';
import {uploadProductImages} from './admin.image-upload.actions';

import {cleanupUploadedImages} from './admin.categories.actions';
import {
  productSearchGenderExactIlikePattern,
  productSearchIlikePattern,
} from '@/lib/search-query';

type PaginatedProductsResult = {
  products: Product[];
  totalCount: number;
};

export async function getAllProducts(
  searchTerm?: string,
  page: number = 1,
  itemsPerPage: number = 25,
): Promise<PaginatedProductsResult> {
  if (!(await isAdmin())) {
    throw new Error('Unauthorized. Admin access required.');
  }

  const offset = (page - 1) * itemsPerPage;

  const pattern = productSearchIlikePattern(searchTerm);
  const genderExact = productSearchGenderExactIlikePattern(searchTerm);
  const whereCondition = pattern
    ? or(
        sql`${productsTable.id}::text ILIKE ${pattern}`,
        ilike(productsTable.name, pattern),
        ilike(productsTable.category, pattern),
        ilike(productsTable.brand, pattern),
        ilike(productsTable.slug, pattern),
        ilike(productsTable.gender, genderExact!),
      )
    : undefined;

  const [countResult] = await db
    .select({count: sql<number>`count(*)`})
    .from(productsTable)
    .where(whereCondition);

  const totalCount = Number(countResult.count);

  const products = await db
    .select()
    .from(productsTable)
    .where(whereCondition)
    .orderBy(desc(productsTable.updated_at))
    .limit(itemsPerPage)
    .offset(offset);

  return {products, totalCount};
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Unauthorized. Admin access required.'};
  }

  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!product) {
      return {success: false, error: 'Product could not be found.'};
    }
    if (product.images && product.images.length > 0) {
      await cleanupUploadedImages(product.images);
    }
    await db.delete(productsTable).where(eq(productsTable.id, id));
    revalidatePath('/admin/products');
    return {success: true};
  } catch (error) {
    console.error('Fel i deleteProduct:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting.',
    };
  }
}

export async function createProductWithImages(
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Unauthorized. Admin access required.'};
  }

  let uploadedImageUrls: string[] = [];

  const imageFiles = formData
    .getAll('images')
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (imageFiles.length === 0) {
    return {success: false, error: 'At least one image must be uploaded.'};
  }
  const {_images, ...rawData} = Object.fromEntries(formData.entries());
  const validationResult = productApiSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'Form data is invalid. Please correct the errors.',
      // errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  try {
    const existingProduct = await db
      .select({id: productsTable.id})
      .from(productsTable)
      .where(eq(productsTable.slug, validatedData.slug))
      .limit(1);

    if (existingProduct.length > 0) {
      return {
        success: false,
        error: `Slug "${validatedData.slug}" is already in use.`,
        errors: {slug: [`Slug "${validatedData.slug}" is already in use.`]},
      };
    }

    uploadedImageUrls = await uploadProductImages(
      imageFiles,
      validatedData.gender,
      validatedData.category,
    );

    const finalDbData = {
      ...validatedData,
      images: uploadedImageUrls,
    };

    const [newProduct] = await db
      .insert(productsTable)
      .values(finalDbData)
      .returning();

    revalidatePath('/admin/products');
    return {success: true, data: newProduct};
  } catch (error) {
    console.error('Fel i createProductWithImages:', error);
    await cleanupUploadedImages(uploadedImageUrls);
    return {success: false, error: 'A server error occurred.'};
  }
}

export async function updateProductWithImages(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Unauthorized. Admin access required.'};
  }

  let newlyUploadedImageUrls: string[] = [];

  const newImageFiles = formData
    .getAll('images')
    .filter((file): file is File => file instanceof File && file.size > 0);

  const existingImages = formData
    .getAll('existingImages')
    .filter((img): img is string => typeof img === 'string' && img.length > 0);

  if (newImageFiles.length === 0 && existingImages.length === 0) {
    return {success: false, error: 'At least one image must remain.'};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {images, ...rawData} = Object.fromEntries(formData.entries());

  const validationResult = productApiSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'Form data is invalid.',
    };
  }
  const validatedData = validationResult.data;

  try {
    const [currentProduct] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);
    if (!currentProduct) {
      return {success: false, error: 'Product could not be found.'};
    }

    const existingProductWithSlug = await db
      .select({id: productsTable.id})
      .from(productsTable)
      .where(
        and(
          eq(productsTable.slug, validatedData.slug),
          not(eq(productsTable.id, id)),
        ),
      )
      .limit(1);
    if (existingProductWithSlug.length > 0) {
      return {
        success: false,
        error: `Slug "${validatedData.slug}" is already in use.`,
        errors: {slug: [`Slug "${validatedData.slug}" is already in use.`]},
      };
    }

    if (newImageFiles.length > 0) {
      newlyUploadedImageUrls = await uploadProductImages(
        newImageFiles,
        validatedData.gender,
        validatedData.category,
      );
    }
    const finalImages = [...existingImages, ...newlyUploadedImageUrls];

    const imagesToDelete = (currentProduct.images || []).filter(
      (img) => !finalImages.includes(img),
    );
    await cleanupUploadedImages(imagesToDelete);

    const finalUpdateData = {
      ...validatedData,
      images: finalImages,
      updated_at: new Date(),
    };

    const [updatedProduct] = await db
      .update(productsTable)
      .set(finalUpdateData)
      .where(eq(productsTable.id, id))
      .returning();

    revalidatePath('/admin/products');
    return {success: true, data: updatedProduct};
  } catch (error) {
    console.error('Fel i updateProductWithImages:', error);
    await cleanupUploadedImages(newlyUploadedImageUrls);
    return {success: false, error: 'A server error occurred while updating.'};
  }
}
