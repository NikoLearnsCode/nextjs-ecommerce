/**
 * Shared product search string handling for PostgreSQL full-text and trigram search.
 */

export function normalizeProductSearchQuery(query: string | undefined): string {
  if (!query) return '';
  return query.replace(/\s+/g, ' ').trim();
}

/**
 * Prefix tsquery string: "nike air" -> "nike:* & air:*", or null when search
 * should be omitted. Terms are split on any non-alphanumeric character (so
 * "t-shirt" -> "t:* & shirt:*", matching the lexemes to_tsvector produces),
 * which leaves tokens free of tsquery syntax. The result must always be passed
 * as a bound parameter to to_tsquery('english', ...).
 */
export function productSearchTsQuery(query: string | undefined): string | null {
  const normalized = normalizeProductSearchQuery(query);
  if (!normalized) return null;
  const terms = normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!terms.length) return null;
  return terms.map((t) => `${t}:*`).join(' & ');
}

/**
 * Minimum word_similarity() for the trigram fallback. The pg_trgm default of
 * 0.6 misses common typos ("nikee" vs "Nike" scores ~0.5).
 */
export const FUZZY_WORD_SIMILARITY_THRESHOLD = 0.3;

function escapePostgresLikePattern(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/**
 * Substring ILIKE pattern `%…%`, or null when search should be omitted.
 * Used by the admin product table; storefront search uses FTS instead.
 */
export function productSearchIlikePattern(
  query: string | undefined,
): string | null {
  const normalized = normalizeProductSearchQuery(query);
  if (!normalized) return null;
  return `%${escapePostgresLikePattern(normalized)}%`;
}

/**
 * Exact ILIKE pattern for the gender column (no `%`). E.g. "men" matches `men`
 * but not `women`, unlike substring search on gender.
 */
export function productSearchGenderExactIlikePattern(
  query: string | undefined,
): string | null {
  const normalized = normalizeProductSearchQuery(query);
  if (!normalized) return null;
  return escapePostgresLikePattern(normalized);
}
