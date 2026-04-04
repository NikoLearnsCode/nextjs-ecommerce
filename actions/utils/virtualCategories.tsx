/** URL slugs that mean “new in” for a gender — not a real product.category value */
export const NEW_COLLECTION_SLUGS = ['nyheter', 'new-now'] as const;

export function isNewCollectionSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return (NEW_COLLECTION_SLUGS as readonly string[]).includes(slug);
}

/** Product grid / cards: path is `/c/{gender}/{slug}` */
export function pathnameEndsWithNewCollection(pathname: string): boolean {
  return NEW_COLLECTION_SLUGS.some((s) => pathname.endsWith(`/${s}`));
}

export function parseCollectionSlug(slug: string | null | undefined) {
  if (!slug) {
    return {
      actualCategory: null,
      isNewOnly: false,
    };
  }

  const isNewOnly = isNewCollectionSlug(slug);

  return {
    actualCategory: isNewOnly ? null : slug,
    isNewOnly,
  };
}
