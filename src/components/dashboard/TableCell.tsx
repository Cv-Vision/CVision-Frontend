import React from 'react';

// Props for a single table cell used in Table.tsx
export interface TableCellProps {
    // Content to display inside the cell
    children: React.ReactNode;
    // Optional click handler for the entire cell (useful if you want the whole cell to be clickable without it being a button)
    onClick?: () => void;
    className?: string; // Optional className for additional styling
}

/*
 Modular TableCell component. Use this to wrap any content (text, buttons, icons, etc.)
 inside a table cell, with an optional onClick action.
 */
export const TableCell: React.FC<TableCellProps> = ({ children, onClick, className }) => {
    return (
      <td onClick={onClick} className={`px-6 py-4 ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}>
          {children}
      </td>
    );
};

