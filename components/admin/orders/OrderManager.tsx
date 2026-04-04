import OrderTable from '@/components/admin/orders/OrderTable';
import {Order} from '@/lib/types/db-types';
import AdminHeader from '../shared/AdminHeader';
import AdminSearch from '../shared/AdminSearch';

type OrderManagerProps = {
  orders: Order[];
};

export default function OrderManager({orders}: OrderManagerProps) {
  return (
    <div>
      <AdminHeader title='Order overview' count={orders.length} />
      <AdminSearch
        searchParam='search'
        maxLength={50}
        placeholder=''
      />
      <OrderTable orders={orders} />
    </div>
  );
}
