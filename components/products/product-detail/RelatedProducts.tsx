import {getRelatedProducts} from '@/actions/product.queries';
import type {ProductDetail} from '@/lib/types/db-types';
import RelatedCarousels from './RelatedCarousels';

// Streamed below the fold so the related-product queries don't block TTFB/LCP.
export default async function RelatedProducts({
  product,
}: {
  product: ProductDetail;
}) {
  const {categoryProducts, genderProducts} = await getRelatedProducts(product);

  return (
    <RelatedCarousels
      categoryProducts={categoryProducts}
      genderProducts={genderProducts}
    />
  );
}
