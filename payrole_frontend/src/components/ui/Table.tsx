import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { BaseComponentProps, TableColumn } from '../../types';
import Button from './Button';

interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
}

interface TableHeaderProps extends BaseComponentProps {
  sticky?: boolean;
}

interface TableBodyProps extends BaseComponentProps {}

interface TableRowProps extends BaseComponentProps {
  hover?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

interface TableCellProps extends BaseComponentProps {
  align?: 'left' | 'center' | 'right';
  width?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  sortable = true,
  selectable = false,
  onRowSelect,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  striped = false,
  hover = true,
  compact = false,
  className = '',
  id,
  testId,
  ...props
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (!sortable) return;

    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (index: number, selected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (selected) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedData = Array.from(newSelectedRows).map(i => sortedData[i]);
      onRowSelect(selectedData);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIndices = new Set(sortedData.map((_, index) => index));
      setSelectedRows(allIndices);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const isAllSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  const tableClasses = [
    'w-full border-collapse',
    compact ? 'text-sm' : '',
    className,
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={tableClasses}
        id={id}
        data-testid={testId}
        {...props}
      >
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {selectable && (
              <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
              >
                {column.sortable !== false && sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column.key)}
                    className="font-medium text-left justify-start p-0 h-auto"
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="ml-1 w-4 h-4" />
                      ) : (
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )
                    )}
                  </Button>
                ) : (
                  <span className="font-medium text-gray-900">
                    {column.label}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td
                className="px-6 py-8 text-center text-gray-500"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row, index)}
                className={`
                  ${hover ? 'hover:bg-gray-50' : ''}
                  ${selectedRows.has(index) ? 'bg-blue-50' : ''}
                  ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={(e) => handleRowSelect(index, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '')
                    }
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

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  sticky = false,
  className = '',
  ...props
}) => {
  const classes = [
    'bg-secondary-50 border-b border-secondary-200',
    sticky ? 'sticky top-0 z-10' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  hover = false,
  selected = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    'border-b border-secondary-200',
    hover ? 'hover:bg-secondary-50' : '',
    selected ? 'bg-primary-50' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <tr className={classes} onClick={onClick} {...props}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  width,
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const classes = [
    'px-4 py-3',
    alignClasses[align],
    width || '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
};

// Attach sub-components
(Table as any).Header = TableHeader;
(Table as any).Body = TableBody;
(Table as any).Row = TableRow;
(Table as any).Cell = TableCell;

export default Table;
