import Link from 'next/link';
import AdminHeader from './shared/AdminHeader';

export default function AdminDashboard() {
  return (
    <div className=''>
      <AdminHeader title='Admin Dashboard' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 '>
        <Link
          className='bg-white p-5 hover:border-gray-300 border border-gray-200'
          href='/admin/products'
        >
          <h2 className='text-sm uppercase font-semibold mb-1'>Products</h2>
          <p className='text-gray-600 mb-4 text-xs font-medium'>
            Manage all products in the system
          </p>
        </Link>
        <Link
          className='bg-white p-5 border border-das hover:border-gray-300  border-gray-200'
          href='/admin/categories'
        >
          <h2 className='text-sm uppercase font-semibold mb-1'>Categories</h2>
          <p className='text-gray-600 mb-4 text-xs font-medium'>
            Manage product categories
          </p>
        </Link>
        <Link
          className='bg-white p-5 border hover:border-gray-300  border-gray-200'
          href='/admin/orders'
        >
          <h2 className='text-sm uppercase font-semibold mb-1'>Orders</h2>
          <p className='text-gray-600 mb-4 text-xs font-medium'>
            Manage orders
          </p>
        </Link>
      </div>
    </div>
  );
}
