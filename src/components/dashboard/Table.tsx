import React from 'react';
import { TableCell, TableCellProps } from './TableCell';

// Props for the Table: a header array (length 1–6) and a 2D array of TableCell elements
export interface TableProps {
    // Column headers: must have between 1 and 6 items
    headers: string[];
    // Rows represented as arrays of TableCell elements
    rows: React.ReactElement<TableCellProps>[][];
}

/*
 Table component enforcing 1–6 headers and rendering rows of TableCell components only
 It is used by passing an array of headers and a 2D array of only TableCell elements.
 */
export const Table: React.FC<TableProps> = ({ headers, rows }) => {
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
        <table className="min-w-full border-collapse">
            <thead>
            <tr>
                {headers.map((text, idx) => (
                    <th key={idx} className="p-2 border bg-gray-200 text-left">
                        {text}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50">
                    {row.map((cell, cIdx) => (
                        React.cloneElement(cell, { key: cIdx })
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};