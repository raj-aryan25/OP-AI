import type { ReactNode } from 'react';
import './DataTable.css';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyField: keyof T;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true
}: DataTableProps<T>) {
  const renderCellValue = (row: T, column: DataTableColumn<T>, index: number) => {
    if (column.render) {
      return column.render(row, index);
    }
    return row[column.key as keyof T] as ReactNode;
  };

  return (
    <div className={`data-table-container ${className}`}>
      <table className={`data-table ${striped ? 'striped' : ''} ${hoverable ? 'hoverable' : ''}`}>
        <thead>
          <tr>
            {columns.map((column, idx) => (
              <th
                key={`${String(column.key)}-${idx}`}
                style={{ width: column.width }}
                className={column.sortable ? 'sortable' : ''}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-message">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={String(row[keyField])}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((column, colIndex) => (
                  <td key={`${String(row[keyField])}-${colIndex}`}>
                    {renderCellValue(row, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
