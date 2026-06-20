import {and, or, eq, gt, lt, desc, asc, sql, type SQL} from 'drizzle-orm';
import {productsTable} from '@/drizzle/db/schema';

import {sortSizes} from '@/utils/filterSort';
import {db} from '@/drizzle/index';
import {NEW_PRODUCT_DAYS} from '@/lib/constants';
import {
  normalizeProductSearchQuery,
  productSearchTsQuery,
  FUZZY_WORD_SIMILARITY_THRESHOLD,
} from '@/lib/search-query';
import type {SearchMode} from '@/lib/types/query-types';

/**
 * Build WHERE clauses for product search.
 * 'fts': weighted full-text search on the generated search_vector column
 * (stemming + per-term prefix matching, GIN-indexed). "men" does not match
 * "women" since prefix matching anchors at the start of each lexeme.
 * 'fuzzy': pg_trgm word similarity on name/brand/category — the typo
 * fallback when FTS finds nothing.
 */
export function createSearchFilters(
  query: string | undefined,
  mode: SearchMode,
) {
  if (mode === 'fts') {
    const tsquery = productSearchTsQuery(query);
    if (!tsquery) return [];
    return [
      sql`${productsTable.search_vector} @@ to_tsquery('english', ${tsquery})`,
    ];
  }

  const normalized = normalizeProductSearchQuery(query);
  if (!normalized) return [];
  // Function form instead of the <% operator: the operator only uses the trgm
  // index at pg_trgm.word_similarity_threshold (default 0.6, too strict for
  // typos) and lowering it needs SET LOCAL inside a transaction.
  return [
    or(
      sql`word_similarity(${normalized}, ${productsTable.name}) > ${FUZZY_WORD_SIMILARITY_THRESHOLD}`,
      sql`word_similarity(${normalized}, ${productsTable.brand}) > ${FUZZY_WORD_SIMILARITY_THRESHOLD}`,
      sql`word_similarity(${normalized}, ${productsTable.category}) > ${FUZZY_WORD_SIMILARITY_THRESHOLD}`,
    ),
  ];
}

/**
 * Relevance score for ORDER BY and the rank cursor. ts_rank weights follow
 * the setweight labels on search_vector (name 1.0 > brand 0.4 > category 0.2
 * > gender 0.1); the fuzzy score weights columns the same way, name first.
 * Cast to float8: ts_rank/word_similarity return float4, which does not
 * round-trip exactly through the driver, breaking cursor equality.
 */
export function createSearchRankExpr(
  query: string | undefined,
  mode: SearchMode,
): SQL<number> | null {
  if (mode === 'fts') {
    const tsquery = productSearchTsQuery(query);
    if (!tsquery) return null;
    return sql<number>`(ts_rank(${productsTable.search_vector}, to_tsquery('english', ${tsquery})))::float8`;
  }

  const normalized = normalizeProductSearchQuery(query);
  if (!normalized) return null;
  return sql<number>`(greatest(word_similarity(${normalized}, ${productsTable.name}), word_similarity(${normalized}, ${productsTable.brand}) * 0.5, word_similarity(${normalized}, ${productsTable.category}) * 0.25))::float8`;
}

/**
 * Cursor for relevance-ordered pages:
 * (rank < lastRank) OR (rank = lastRank AND id > lastId).
 */
export function buildRankCursorPagination(
  rankExpr: SQL<number>,
  lastId: string,
  lastRank: number,
) {
  return [
    or(
      sql`${rankExpr} < ${lastRank}`,
      and(sql`${rankExpr} = ${lastRank}`, gt(productsTable.id, lastId)),
    ),
  ];
}

/**
 * ORDER BY for relevance: best match first, id tie-break for stable
 * pagination. Deliberately ignores the order param.
 */
export function createRelevanceOrderClause(rankExpr: SQL<number>) {
  return [desc(rankExpr), asc(productsTable.id)];
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
 * Single source of truth for the "is new" predicate: published within
 * NEW_PRODUCT_DAYS. Add `.as('isNew')` when used as a selected column.
 */
export const isNewSql = () =>
  sql<boolean>`${productsTable.published_at} > NOW() - INTERVAL '${sql.raw(NEW_PRODUCT_DAYS.toString())} days'`;

/**
 * "New in" filter — products published within NEW_PRODUCT_DAYS.
 * @param isNewOnly When false, returns no extra conditions
 */
export function buildIsNewFilter(isNewOnly: boolean) {
  if (!isNewOnly) return [];

  return [isNewSql()];
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
    metadataConditions.push(isNewSql());
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
