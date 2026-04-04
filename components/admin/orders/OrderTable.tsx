'use client';

import {Order} from '@/lib/types/db-types';
import AdminTable from '../shared/ReusableTable.tsx';
import {orderColumns} from '../utils/table-columns';

type OrderTableProps = {
  orders: Order[];
};

export default function OrderTable({orders}: OrderTableProps) {
  return <AdminTable data={orders} columns={orderColumns} />;
}
