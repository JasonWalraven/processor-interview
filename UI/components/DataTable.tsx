import React from 'react';

type AccessorFunction<T> = (item: T) => any;

interface TableColumn<T> {
  header: string;
  accessor: keyof T | AccessorFunction<T>;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  emptyMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyField,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="text-center p-4 border rounded">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th key={index} className="py-2 px-4 text-left border-b">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={String(item[keyField])} className="hover:bg-gray-50">
              {columns.map((column, index) => {
                const accessorValue = typeof column.accessor === 'function'
                  ? (column.accessor as AccessorFunction<T>)(item)
                  : item[column.accessor as keyof T];
                
                return (
                  <td key={index} className="py-2 px-4 border-b">
                    {column.render ? column.render(item) : accessorValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
