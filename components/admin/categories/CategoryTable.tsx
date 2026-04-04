'use client';

import {useState, useMemo} from 'react';
import {FiEdit, FiTrash} from 'react-icons/fi';
import AdminTable from '../shared/ReusableTable.tsx';
import {CategoryWithChildren} from '@/lib/types/category-types.js';
import {useAdmin} from '@/context/AdminProvider';
import {
  flattenCategoriesRecursive,
  FlattenedCategory,
  getAllCategoryIdsRecursive,
} from '../utils/admin.table-helpers';
import {createCategoryColumns} from '../utils/table-columns';

type CategoryManagerProps = {
  categories: CategoryWithChildren[];
};

export default function CategoryManager({categories}: CategoryManagerProps) {
  const {openSidebar, setDeleteModalOpen, setItemToDelete, setTriggerElement} =
    useAdmin();

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    () => {
      if (!categories || categories.length === 0) {
        return new Set();
      }

      const initialIds = new Set<number>();

      const firstCategory = categories[1];
      initialIds.add(firstCategory.id);

      if (firstCategory.children && firstCategory.children.length > 0) {
        firstCategory.children.forEach((child) => {
          initialIds.add(child.id);
        });
      }

      return initialIds;
    }
  );

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const flattenedCategories = useMemo(
    () => flattenCategoriesRecursive(categories, expandedCategories),
    [categories, expandedCategories]
  );

  const columns = useMemo(
    () => createCategoryColumns(expandedCategories, toggleCategory),
    [expandedCategories, toggleCategory]
  );

  // Sent to adminProvider → updates state → form wrapper subscribes to state
  const actions = [
    {
      label: <FiEdit size={16} className='text-gray-600 hover:text-gray-900' />,
      key: 'edit',
      isDisabled: (category: FlattenedCategory) =>
        category.type === 'COLLECTION',
      onClick: (category: FlattenedCategory) => {
        // Open sidebar in edit mode
        openSidebar('category', category);
      },
    },
    {
      label: (
        <FiTrash size={16} className='text-gray-600 hover:text-gray-900' />
      ),
      key: 'delete',
      isDisabled: (category: FlattenedCategory) =>
        category.type === 'COLLECTION',
      onClick: (category: FlattenedCategory, event?: React.MouseEvent) => {
        // Store trigger element for dialog
        if (event) {
          setTriggerElement(event.currentTarget as HTMLElement);
        }

        setItemToDelete({
          id: category.id.toString(),
          name: category.name,
          type: 'category',
        });

        setDeleteModalOpen(true);
      },
    },
  ];

  const getRowClassName = (category: FlattenedCategory) => {
    if (category.level === 0) {
      return `transition-colors ${
        expandedCategories.has(category.id)
          ? 'bg-gray-200 border-b border-gray-300'
          : 'bg-white hover:bg-gray-100 border-b border-gray-200'
      }`;
    }
    if (category.level === 1) {
      return `text-[13px] transition-colors ${
        expandedCategories.has(category.id)
          ? 'bg-gray-100 hover:bg-gray-200/70 border-b border-gray-300'
          : 'bg-white hover:bg-gray-100 border-b border-gray-100'
      }`;
    }
    return `bg-gray-50 text-[12px] border-b border-gray-200 hover:bg-gray-100`;
  };

  const expandAll = () =>
    setExpandedCategories(new Set(getAllCategoryIdsRecursive(categories)));

  const collapseAll = () => setExpandedCategories(new Set());

  return (
    <div>
      <div className='pb-1 pt-2 flex items-center gap-2'>
        <button
          onClick={expandAll}
          className='p-2 text-xs cursor-pointer hover:underline text-gray-600 font-medium'
        >
          Expandera
        </button>
        <button
          onClick={collapseAll}
          className='p-2 text-xs cursor-pointer hover:underline text-gray-600 font-medium'
        >
          Kollapsa
        </button>
      </div>

      <AdminTable
        data={flattenedCategories}
        columns={columns}
        actions={actions}
        getRowClassName={getRowClassName}
      />
    </div>
  );
}
