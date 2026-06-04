'use client';

import {twMerge} from 'tailwind-merge';

type ColumnDef<T> = {
  header: string;
  cell: (item: T) => React.ReactNode;
  headerClassName?: string;
};

interface ReusableTableProps<T extends {id: string | number}> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: {
    label: React.ReactNode | ((item: T) => React.ReactNode);
    onClick: (item: T, event?: React.MouseEvent) => void;
    key: string;
    isDisabled?: (item: T) => boolean;
    /** Optional Invoker Commands API attrs, e.g. open the form <dialog>. */
    command?: string;
    commandfor?: string;
  }[];
  getRowClassName?: (item: T) => string;
}

export default function ReusableTable<T extends {id: string | number}>({
  data,
  columns,
  actions,
  getRowClassName,
}: ReusableTableProps<T>) {
  return (
    <div className='bg-white rounded-lg text-sm'>
      <div className='overflow-x-auto border border-gray-100'>
        <table className='min-w-full divide-y divide-gray-00'>
          <thead className='bg-gray-50  border-gray-200'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-6 py-2.5 text-left text-xs font-semibold text-black uppercase tracking-wider ${
                    column.headerClassName || ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className='px-6 py-2.5 text-xs  flex justify-end font-semibold text-black uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-100'>
            {data.map((item) => (
              <tr
                key={item.id}
                className={twMerge(
                  getRowClassName ? getRowClassName(item) : 'hover:bg-gray-50'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className='px-6 py-2.5 text-xs font-medium whitespace-nowrap'
                  >
                    {column.cell(item)}
                  </td>
                ))}
                {actions && (
                  <td className='px-6 py-2.5 flex justify-end whitespace-nowrap'>
                    {actions.map((action) => {
                      const isDisabled = action.isDisabled
                        ? action.isDisabled(item)
                        : false;

                      return (
                        <button
                          key={action.key}
                          onClick={(event) => action.onClick(item, event)}
                          command={action.command}
                          commandfor={action.commandfor}
                          disabled={isDisabled}
                          className={twMerge(
                            'px-3 text-xs uppercase font-semibold',
                            actions.length > 1
                              ? 'first:border-r px-2.5 border-gray-400'
                              : '',
                            isDisabled
                              ? 'pointer-events-none hidden  '
                              : 'cursor-pointer text-black hover:underline'
                          )}
                        >
                          {typeof action.label === 'function'
                            ? action.label(item)
                            : action.label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className='text-center py-32'>
            <p className='text-black text-sm font-semibold'>No data found</p>
          </div>
        )}
      </div>
    </div>
  );
}
