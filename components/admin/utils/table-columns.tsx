import {Product, Order} from '@/lib/types/db-types';
import {FlattenedCategory} from './admin.table-helpers';
import {cellRenderers} from './cell-renderers';
import {categoryConfig} from './admin.table-helpers';
import {
  FiChevronDown,
  FiChevronRight,
  FiChevronUp,
  FiCornerLeftUp,
} from 'react-icons/fi';

type ColumnDef<T> = {
  header: string;
  cell: (item: T) => React.ReactNode;
  headerClassName?: string;
};

export const productColumns: ColumnDef<Product>[] = [
  {
    header: 'Product name',
    cell: (product: Product) => cellRenderers.text(product.name),
  },
  {
    header: 'Price',
    cell: (product: Product) => cellRenderers.price(product.price),
  },
  {
    header: 'Brand',
    cell: (product: Product) => cellRenderers.text(product.brand),
  },
  {
    header: 'Gender',
    cell: (product: Product) => cellRenderers.text(product.gender),
  },
  {
    header: 'Category',
    cell: (product: Product) => cellRenderers.text(product.category),
  },
  {
    header: 'Sizes',
    cell: (product: Product) => cellRenderers.array(product.sizes),
  },
  {
    header: 'Updated',
    cell: (product: Product) =>
      cellRenderers.dateWithFutureWarning(product.updated_at),
  },
  {
    header: 'Published',
    cell: (product: Product) =>
      cellRenderers.dateWithFutureWarning(product.published_at),
  },
];

export const createCategoryColumns = (
  expandedCategories: Set<number>,
  toggleCategory: (id: number) => void
): ColumnDef<FlattenedCategory>[] => [
  {
    header: 'Categories',
    headerClassName: 'pl-11',
    cell: (category: FlattenedCategory) => {
      const isExpanded = expandedCategories.has(category.id);
      const hasChildren = category.children && category.children.length > 0;

      if (category.level === 0) {
        return (
          <div className='flex items-center group transition-all duration-100'>
            <div
              className='flex items-center cursor-pointer text-gray-700 hover:text-black'
              onClick={() => hasChildren && toggleCategory(category.id)}
            >
              {hasChildren ? (
                isExpanded ? (
                  <FiChevronDown
                    size={20}
                    strokeWidth={1}
                    className='mr-2 text-black flex-shrink-0 group-hover:text-black'
                  />
                ) : (
                  <FiChevronRight
                    size={20}
                    strokeWidth={1}
                    className='mr-2 text-gray-700 flex-shrink-0 group-hover:text-black'
                  />
                )
              ) : (
                <div className='w-5 mr-2 flex-shrink-0' />
              )}
              <span className='font-semibold uppercase'>{category.name}</span>
            </div>
            {hasChildren && (
              <span className='ml-2 text-xs text-gray-700'>
                ({category.children?.length || 0})
              </span>
            )}
          </div>
        );
      }

      return (
        <div className='flex items-center relative'>
          <div
            style={{width: `${(category.level - 1) * 50 + 40}px`}}
            className='flex-shrink-0'
          />
          {!hasChildren && (
            <FiCornerLeftUp
              size={16}
              strokeWidth={1.5}
              className='text-gray-400 flex-shrink-0'
            />
          )}
          <div className='flex items-center text-gray-900'>
            <div
              className={`flex items-center ${hasChildren ? 'cursor-pointer hover:text-black' : ''}`}
              onClick={() => hasChildren && toggleCategory(category.id)}
            >
              {hasChildren ? (
                isExpanded ? (
                  <FiChevronUp
                    size={20}
                    strokeWidth={1}
                    className='mr-4 text-gray-500 flex-shrink-0'
                  />
                ) : (
                  <FiChevronRight
                    size={20}
                    strokeWidth={1}
                    className='mr-4 text-gray-500 flex-shrink-0'
                  />
                )
              ) : (
                <div className='w-5 flex-shrink-0' />
              )}
              <span className='normal-case'>{category.name}</span>
              {hasChildren && (
                <span className='ml-1.5 text-xs italic text-gray-500'>
                  ({category.children?.length || 0})
                </span>
              )}
            </div>
            {category.parentName && (
              <div className='ml-1.5 flex items-center text-xs text-gray-500'>
                <span className='italic'>({category.parentName})</span>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: 'Slug',
    cell: (category: FlattenedCategory) => cellRenderers.text(category.slug),
  },
  {
    header: 'Sort order',
    cell: (category: FlattenedCategory) =>
      cellRenderers.text(category.displayOrder),
  },
  {
    header: 'Type',
    cell: (category: FlattenedCategory) => {
      const config =
        categoryConfig[category.type] || categoryConfig['MAIN-CATEGORY'];
      return <div className={config.className}>{config.name}</div>;
    },
  },
  {
    header: 'Status',
    cell: (category: FlattenedCategory) =>
      cellRenderers.activeStatus(category.isActive),
  },
  {
    header: 'Created',
    cell: (category: FlattenedCategory) =>
      cellRenderers.date(category.created_at),
  },
  {
    header: 'Updated',
    cell: (category: FlattenedCategory) =>
      cellRenderers.date(category.updated_at),
  },
];

export const orderColumns: ColumnDef<Order>[] = [
  {
    header: 'Customer',
    cell: (order: Order) => (
      <div>{`${order.delivery_info.firstName} ${order.delivery_info.lastName}`}</div>
    ),
  },
  {
    header: 'Contact',
    cell: (order: Order) => (
      <div>
        <p>{order.delivery_info.email}</p>
        <p className='text-xs text-gray-700'>
          tel: {order.delivery_info.phone}
        </p>
      </div>
    ),
  },
  {
    header: 'Address',
    cell: (order: Order) => (
      <div>{`${order.delivery_info.address}, ${order.delivery_info.postalCode} ${order.delivery_info.city}`}</div>
    ),
  },
  {
    header: 'Payment',
    cell: (order: Order) => cellRenderers.text(order.payment_info),
  },
  {
    header: 'Status',
    cell: (order: Order) => cellRenderers.text(order.status),
  },
  {
    header: 'Total',
    cell: (order: Order) => cellRenderers.price(order.total_amount),
  },
  {
    header: 'Created',
    cell: (order: Order) => cellRenderers.date(order.created_at),
  },
  {
    header: 'Updated',
    cell: (order: Order) => cellRenderers.date(order.updated_at),
  },
];
