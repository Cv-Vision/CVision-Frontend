import React from 'react';

// Props for a single table cell used in Table.tsx
export interface TableCellProps {
    // Content to display inside the cell
    children: React.ReactNode;
    // Optional click handler for the entire cell (useful if you want the whole cell to be clickable without it being a button)
    onClick?: () => void;
}

/*
 Modular TableCell component. Use this to wrap any content (text, buttons, icons, etc.)
 inside a table cell, with an optional onClick action.
 */
export const TableCell: React.FC<TableCellProps> = ({ children, onClick }) => (
    <td
        onClick={onClick}
        className="p-2 border cursor-pointer hover:bg-gray-100"
    >
        {children}
    </td>
);

