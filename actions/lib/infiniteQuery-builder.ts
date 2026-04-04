import {and, or, eq, ilike, gt, lt, desc, asc, sql} from 'drizzle-orm';
import {productsTable} from '@/drizzle/db/schema';

import {sortSizes} from '@/utils/filterSort';
import {db} from '@/drizzle/index';
import {NEW_PRODUCT_DAYS} from '@/lib/constants';
import {
  productSearchGenderExactIlikePattern,
  productSearchIlikePattern,
} from '@/lib/search-query';

/**
 * Build WHERE clauses for full-text style search across product fields.
 * Gender uses exact ILIKE so "men" does not match stored value "women".
 */
export function createTextSearchFilters(query: string | undefined) {
  const searchTerm = productSearchIlikePattern(query);
  const genderExact = productSearchGenderExactIlikePattern(query);
  if (!searchTerm) return [];
  const genderPattern = genderExact!;

  return [
    or(
      ilike(productsTable.name, searchTerm),
      ilike(productsTable.category, searchTerm),
      ilike(productsTable.brand, searchTerm),
      ilike(productsTable.slug, searchTerm),
      ilike(productsTable.gender, genderPattern),
    ),
  ];
}

/**
 * Category and gender filters.
 * @param category Slug or null for any
 * @param gender Slug or null for any
 */
export function buildCategoryGenderFilters(
  category: string | null,
  gender: string | null,
) {
  const conditions = [];
  if (gender) conditions.push(eq(productsTable.gender, gender));
  if (category) conditions.push(eq(productsTable.category, category));

  // Hide products scheduled for future publish
  conditions.push(sql`${productsTable.published_at} <= NOW()`);

  return conditions;
}

/**
 * "New in" filter — products created within NEW_PRODUCT_DAYS.
 * @param isNewOnly When false, returns no extra conditions
 */
export function buildIsNewFilter(isNewOnly: boolean) {
  if (!isNewOnly) return [];

  return [
    sql`${productsTable.published_at} > NOW() - INTERVAL '${sql.raw(NEW_PRODUCT_DAYS.toString())} days'`,
  ];
}

/**
 * Size (JSONB contains) and color equality filters.
 */
export function buildSizeColorFilters(sizes: string[], color: string[]) {
  const conditions = [];

  // Size filters using JSONB array containment
  if (sizes.length) {
    const sizeConditions = sizes.map(
      (size) => sql`${productsTable.sizes} @> ${JSON.stringify([size])}`,
    );
    conditions.push(or(...sizeConditions));
  }

  // Color filters
  if (color.length) {
    const colorConditions = color.map((c) => eq(productsTable.color, c));
    conditions.push(or(...colorConditions));
  }

  return conditions;
}

/**
 * Coerce cursor "last value" to a string safe for Drizzle comparisons.
 */
export function convertLastValueToFieldType(
  sort: string,
  lastValue: number | string | null,
): string {
  if (lastValue === null) return '';

  return sort === 'price'
    ? typeof lastValue === 'string'
      ? lastValue
      : String(lastValue)
    : String(lastValue);
}

/** Simple ID-based cursor (sort by id). */
export function buildSimpleIdPagination(order: 'asc' | 'desc', lastId: string) {
  const idComparator = order === 'asc' ? gt : lt;
  return [idComparator(productsTable.id, lastId)];
}

/**
 * Cursor pagination on price or name with id tie-breaker:
 * (sortField > lastValue) OR (sortField = lastValue AND id > lastId).
 */
export function buildCursorFieldPagination(
  sort: string,
  order: 'asc' | 'desc',
  lastId: string,
  lastValue: number | string | null,
) {
  const sortField = sort === 'price' ? productsTable.price : productsTable.name;
  const sortFieldComparator = order === 'asc' ? gt : lt;
  const tieBreakingComparator = order === 'asc' ? gt : lt;

  const convertedValue = convertLastValueToFieldType(sort, lastValue);

  return [
    or(
      // Primary condition: sort field is greater/less than last value
      sortFieldComparator(sortField, convertedValue),
      // Tie-breaking condition: same sort value but higher/lower ID
      and(
        eq(sortField, convertedValue),
        tieBreakingComparator(productsTable.id, lastId),
      ),
    ),
  ];
}

/**
 * Compose cursor WHERE for the next page; empty array on first page (lastId null).
 */
export function buildCursorPaginationWhereClause(
  sort: string,
  order: 'asc' | 'desc',
  lastId: string | null,
  lastValue: number | string | null,
) {
  // No pagination needed
  if (lastId === null) return [];

  // Simple ID-based pagination
  if (sort === 'id') {
    return buildSimpleIdPagination(order, lastId);
  }

  // Fallback to simple ID pagination if no sort value
  if (lastValue === null) {
    return buildSimpleIdPagination(order, lastId);
  }

  // Full cursor pagination with sort field
  return buildCursorFieldPagination(sort, order, lastId, lastValue);
}

/**
 * ORDER BY primary field plus id for stable pagination.
 */
export function createSortOrderClause(sort: string, order: 'asc' | 'desc') {
  const orderByFields = [];

  switch (sort) {
    case 'price':
      orderByFields.push(
        order === 'asc' ? asc(productsTable.price) : desc(productsTable.price),
      );
      break;
    case 'name':
      orderByFields.push(
        order === 'asc' ? asc(productsTable.name) : desc(productsTable.name),
      );
      break;
    default: // 'id'
      orderByFields.push(
        order === 'asc' ? asc(productsTable.id) : desc(productsTable.id),
      );
  }

  // Always add ID as secondary sort for consistent pagination
  orderByFields.push(
    order === 'asc' ? asc(productsTable.id) : desc(productsTable.id),
  );

  return orderByFields;
}

/**
 * Distinct colors, sizes, and categories available for the current filter scope.
 */
export async function fetchAvailableFilterOptions(
  gender: string | null,
  category: string | null,
  isNewOnly: boolean = false,
) {
  const metadataConditions = [];
  if (gender) metadataConditions.push(eq(productsTable.gender, gender));
  if (category) metadataConditions.push(eq(productsTable.category, category));
  metadataConditions.push(sql`${productsTable.published_at} <= NOW()`);
  if (isNewOnly) {
    metadataConditions.push(
      sql`${productsTable.published_at} > NOW() - INTERVAL '${sql.raw(NEW_PRODUCT_DAYS.toString())} days'`,
    );
  }

  const whereClause =
    metadataConditions.length > 0 ? and(...metadataConditions) : undefined;

  const colorsQuery = db
    .selectDistinct({color: productsTable.color})
    .from(productsTable)
    .where(whereClause)
    .orderBy(asc(productsTable.color));

  const categoriesQuery = db
    .selectDistinct({category: productsTable.category})
    .from(productsTable)
    .where(whereClause);

  const sizesQuery = db
    .select({
      size: sql<string>`jsonb_array_elements_text(${productsTable.sizes})`.as(
        'size',
      ),
    })
    .from(productsTable)
    .where(
      whereClause
        ? and(whereClause, sql`jsonb_typeof(${productsTable.sizes}) = 'array'`)
        : sql`jsonb_typeof(${productsTable.sizes}) = 'array'`,
    )
    .groupBy(sql`size`);

  const [colorRows, categoryRows, sizeRows] = await Promise.all([
    colorsQuery,
    categoriesQuery,
    sizesQuery,
  ]);

  const availableColors = colorRows.map((r) => r.color).filter(Boolean);
  const availableCategories = categoryRows
    .map((r) => r.category)
    .filter(Boolean);
  const availableSizes = sortSizes(sizeRows.map((r) => r.size));

  return {
    availableColors,
    availableSizes,
    availableCategories,
  };
}
