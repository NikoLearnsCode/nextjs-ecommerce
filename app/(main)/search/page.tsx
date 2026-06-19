import type {Metadata} from 'next';
import {getInfiniteProducts} from '@/actions/product.actions';
import type {Result} from '@/lib/types/query-types';
import InfiniteProductList from '@/components/products/product-grid/InfiniteProductList';

type Props = {
  searchParams: Promise<{q?: string}>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const {q = ''} = await searchParams;

  return {
    title: q ? `Search results for "${q}" | NC` : 'Search products | NC',
    description: q
      ? `See our products matching "${q}"`
      : 'Search our product range',
  };
}

export default async function SearchPage({searchParams}: Props) {
  const {q = ''} = await searchParams;

  const result: Result = q
    ? await getInfiniteProducts({
        query: q,
        limit: 8,
        includeCount: true,
      })
    : {products: [], hasMore: false};

  if (!result.products || result.products.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-400px)]'>
        <div className='text-center max-w-full '>
          <p className='px-6 text-sm md:text-base font-medium break-words '>
            No products were found for{' '}
            <span className='italic font-medium'>{`"${q}"`}</span>.
          </p>
        </div>
      </div>
    );
  }
  // TODO: Implement separate category-aware autocomplete/live-suggestion search
  // 1. Implement a separate search input for category-aware suggestions.
  // 2. Use the same search query input for the main search.
  // 3. Add URL parameter for main category.
  // 4. Inherit initial category from navigation context (e.g., navigating "Men" sets param and scopes suggestions to "Men").
  // 5. Allow category overriding: If the user searches for a different main category (e.g., "Women"), update the URL param.
  // 6. Sync URL param changes back to the main navigation to update the active UI state.

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-full'>
        <InfiniteProductList
          mode='search'
          query={q}
          initialHasMore={result.hasMore}
          initialProducts={result.products}
          initialSearchMode={result.searchMode}
          totalCount={result.totalCount}
        />
      </div>
    </div>
  );
}
