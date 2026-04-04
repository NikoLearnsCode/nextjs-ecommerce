import ProductTable from '@/components/admin/products/ProductTable';
import {Product} from '@/lib/types/db-types';
import AdminHeader from '../shared/AdminHeader';
import AdminSearch from '../shared/AdminSearch';

type ProductManagerProps = {
  products: Product[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
};

export default function ProductManager({
  products,
  totalCount,
  currentPage,
  itemsPerPage,
}: ProductManagerProps) {
  return (
    <div>
      <AdminHeader
        title='Product management'
        count={totalCount}
        buttonShow
        formType='product'
      />
      <AdminSearch
        searchParam='search'
        maxLength={50}
        placeholder=''
      />

      <ProductTable
        products={products}
        totalCount={totalCount}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
