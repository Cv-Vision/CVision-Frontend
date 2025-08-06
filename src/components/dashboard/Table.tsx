import React from 'react';
import { TableCell, TableCellProps } from './TableCell';

// Props for the Table: a header array (length 1–6) and a 2D array of TableCell elements
export interface TableProps {
    // Column headers: must have between 1 and 6 items
    headers: string[];
    // Rows represented as arrays of TableCell elements
    rows: React.ReactElement<TableCellProps>[][];
    // Optional row click handler
    onRowClick?: (rowIndex: number) => void;
}

/*
 Table component enforcing 1–6 headers and rendering rows of TableCell components only
 It is used by passing an array of headers and a 2D array of only TableCell elements.
 */
export const Table: React.FC<TableProps> = ({ headers, rows, onRowClick }) => {
    if (headers.length < 1 || headers.length > 6) {
        throw new Error('Table: headers length must be between 1 and 6');
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

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full">
                <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    {headers.map((text, idx) => (
                        <th
                            key={idx}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            {text}
                        </th>
                    ))}
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
