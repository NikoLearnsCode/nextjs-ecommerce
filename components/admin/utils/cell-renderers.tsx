import {formatPrice} from '@/utils/formatPrice';
import {formatDateForAdmin} from './admin-helpers';

export const cellRenderers = {
  date: (value: Date | null | undefined) => (
    <div>{formatDateForAdmin(value)}</div>
  ),

  dateWithFutureWarning: (value: Date | null | undefined) => (
    <div
      className={`text-xs font-medium ${
        value && value > new Date() ? 'text-red-800' : 'text-gray-600'
      }`}
    >
      {formatDateForAdmin(value)}
    </div>
  ),

  price: (value: string | number) => <div>{formatPrice(value)}</div>,

  activeStatus: (value: boolean) => (
    <div className={`text-sm ${value ? 'text-black' : 'text-red-900'}`}>
      {value ? 'Active' : 'Inactive'}
    </div>
  ),

  text: (value: string | number | null | undefined) => (
    <div>{value !== null && value !== undefined ? String(value) : '–'}</div>
  ),

  array: (value: string[] | null | undefined) => (
    <div>{value ? value.join(', ') : '–'}</div>
  ),
} as const;
