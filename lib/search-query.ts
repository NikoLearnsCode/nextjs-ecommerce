/**
 * Shared product search string handling for ILIKE (PostgreSQL default escape: backslash).
 */

export function normalizeProductSearchQuery(query: string | undefined): string {
  if (!query) return '';
  return query.replace(/\s+/g, ' ').trim();
}

function escapePostgresLikePattern(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/** Substring ILIKE pattern `%…%`, or null when search should be omitted. */
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
