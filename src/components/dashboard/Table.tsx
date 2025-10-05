import React from 'react';
import { TableCell, TableCellProps } from './TableCell';
import { ChevronUpIcon, ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
    key: string;
    direction: SortDirection;
}

// Props for the Table: a header array (length 1–8) and a 2D array of TableCell elements
export interface TableProps {
    // Column headers: must have between 1 and 8 items
    headers: string[];
    // Rows represented as arrays of TableCell elements
    rows: React.ReactElement<TableCellProps>[][];
    // Optional row click handler
    onRowClick?: (rowIndex: number) => void;
    // Optional sorting configuration
    sortConfig?: SortConfig | null;
    // Optional sort handler
    onSort?: (key: string) => void;
    // Optional sortable columns (array of column keys that can be sorted)
    sortableColumns?: string[];
}

/*
 Table component enforcing 1–8 headers and rendering rows of TableCell components only
 It is used by passing an array of headers and a 2D array of only TableCell elements.
 */
export const Table: React.FC<TableProps> = ({ 
    headers, 
    rows, 
    onRowClick, 
    sortConfig, 
    onSort, 
    sortableColumns = [] 
}) => {
    if (headers.length < 1 || headers.length > 8) {
        throw new Error('Table: headers length must be between 1 and 8');
    }

    // Development-time check for ensuring all rows contain TableCell components and not other elements
    if (process.env.NODE_ENV !== 'production') {
        rows.forEach((row, rId) => {
            row.forEach((cell, cId) => {
                if (cell.type !== TableCell) {
                    console.warn(`Table: Cell at row ${rId}, col ${cId} is not a TableCell component.`);
                }
            });
        });
    }

    const getSortIcon = (columnKey: string) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            // Show sortable indicator for columns that can be sorted
            if (isSortable(columnKey)) {
                return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
            }
            return null;
        }
        
        if (sortConfig.direction === 'asc') {
            return <ChevronUpIcon className="h-4 w-4 text-blue-600" />;
        } else if (sortConfig.direction === 'desc') {
            return <ChevronDownIcon className="h-4 w-4 text-blue-600" />;
        }
        
        return null;
    };

    const isSortable = (columnKey: string) => {
        return sortableColumns.includes(columnKey) && onSort;
    };

    const handleSort = (columnKey: string) => {
        if (isSortable(columnKey) && onSort) {
            onSort(columnKey);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full">
                <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    {headers.map((text, idx) => {
                        const columnKey = text.toLowerCase().replace(/\s+/g, '_');
                        const sortable = isSortable(columnKey);
                        
                        return (
                            <th
                                key={idx}
                                className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider ${
                                    sortable 
                                        ? 'cursor-pointer hover:bg-blue-100 transition-colors duration-200 select-none' 
                                        : ''
                                }`}
                                onClick={sortable ? () => handleSort(columnKey) : undefined}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{text}</span>
                                    {getSortIcon(columnKey)}
                                </div>
                            </th>
                        );
                    })}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {rows.map((row, rIdx) => (
                    <tr 
                        key={rIdx} 
                        className={`transition-all duration-300 ${
                            onRowClick 
                                ? 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer' 
                                : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50'
                        }`}
                        onClick={onRowClick ? () => onRowClick(rIdx) : undefined}
                    >
                        {row.map((cellNode, cIdx) => (
                            <React.Fragment key={cIdx}>{cellNode}</React.Fragment>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
