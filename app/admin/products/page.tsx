'use server';

import {getAllProducts} from '@/actions/admin/admin.products.actions';

import ProductManager from '@/components/admin/products/ProductManager';
import {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Products',
  };
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    itemsPerPage?: string;
  }>;
}

export default async function ProductsPage({searchParams}: ProductsPageProps) {
  const {search, page, itemsPerPage} = await searchParams;

  const currentPage = page ? parseInt(page) : 1;
  const perPage = itemsPerPage ? parseInt(itemsPerPage) : 25;

  const {products, totalCount} = await getAllProducts(
    search,
    currentPage,
    perPage
  );

  return (
    <ProductManager
      products={products}
      totalCount={totalCount}
      currentPage={currentPage}
      itemsPerPage={perPage}
    />
  );
}
