'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {Product} from '@/lib/types/db-types';
import AdminTable from '../shared/ReusableTable.tsx';
import Pagination from '../shared/Pagination';
import {FiEdit, FiTrash} from 'react-icons/fi';
import {useAdmin} from '@/context/AdminProvider';
import {productColumns} from '../utils/table-columns';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const {openSidebar, setDeleteModalOpen, setItemToDelete, setTriggerElement} =
    useAdmin();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('itemsPerPage', newItemsPerPage.toString());
    params.set('page', '1'); // Reset to first page
    router.push(`/admin/products?${params.toString()}`);
  };

  const actions = [
    {
      label: <FiEdit size={14} className='text-gray-600 hover:text-gray-900' />,
      key: 'edit',
      onClick: (product: Product) => {
        openSidebar('product', product);
      },
    },
    {
      label: (
        <FiTrash size={15} className='text-gray-600 hover:text-gray-900' />
      ),
      key: 'delete',
      onClick: (product: Product, event?: React.MouseEvent) => {
        if (event) {
          setTriggerElement(event.currentTarget as HTMLElement);
        }

        setItemToDelete({
          id: product.id,
          name: product.name,
          type: 'product',
        });
        setDeleteModalOpen(true);
      },
    },
  ];

  return (
    <div className='pb-24'>
      <AdminTable data={products} columns={productColumns} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
