import {cache} from 'react';
import {and, eq, ne, sql, getTableColumns} from 'drizzle-orm';
import {productsTable} from '@/drizzle/db/schema';
import {isNewSql} from '@/actions/lib/infiniteQuery-builder';
import type {ProductDetail, CarouselCard} from '@/lib/types/db-types';
import {db} from '@/drizzle/index';

const publishedFilter = sql`${productsTable.published_at} <= NOW()`;

// Cached so generateMetadata and the page share a single query per request.
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    // Exclude the FTS document from payloads sent to the client.
    const {search_vector: _sv, ...productColumns} =
      getTableColumns(productsTable);

    const rows = await db
      .select({...productColumns, isNew: isNewSql().as('isNew')})
      .from(productsTable)
      .where(and(eq(productsTable.slug, slug), publishedFilter))
      .limit(1);

    return rows[0] ?? null;
  },
);

export async function getRelatedProducts({
  id,
  category,
  gender,
}: Pick<ProductDetail, 'id' | 'category' | 'gender'>): Promise<{
  categoryProducts: CarouselCard[];
  genderProducts: CarouselCard[];
}> {
  const carouselColumns = {
    id: productsTable.id,
    name: productsTable.name,
    price: productsTable.price,
    images: productsTable.images,
    slug: productsTable.slug,
    created_at: productsTable.created_at,
  };

  const [categoryProducts, genderProducts] = await Promise.all([
    // Same category + gender
    db
      .select({...carouselColumns, isNew: isNewSql().as('isNew')})
      .from(productsTable)
      .where(
        and(
          eq(productsTable.category, category),
          eq(productsTable.gender, gender),
          ne(productsTable.id, id),
          publishedFilter,
        ),
      )
      .limit(8),
    // Same gender, different category
    db
      .select({...carouselColumns, isNew: isNewSql().as('isNew')})
      .from(productsTable)
      .where(
        and(
          eq(productsTable.gender, gender),
          ne(productsTable.id, id),
          ne(productsTable.category, category),
          publishedFilter,
        ),
      )
      .limit(8),
  ]);

  return {categoryProducts, genderProducts};
}
