import {TableCell} from "@/components/dashboard/TableCell.tsx";
import {Table} from "@/components/dashboard/Table.tsx";

const IntegratedDashboard: React.FC = () => {
    const headers = ['Name', 'Email', 'Role', 'Actions'];

    // Build rows with TableCell components, each cell can have its own onClick or inner buttons
    // In this example we use onClick for the name cells to show an alert, and buttons for actions
    // Here two rows are created, one for Bob and another for Alice
    const rows = [
        [
            <TableCell onClick={() => alert('Clicked name: Alice')}>Alice</TableCell>,
            <TableCell>{'alice@example.com'}</TableCell>,
            <TableCell>{'Admin'}</TableCell>,
            <TableCell>
                <button onClick={() => console.log('Edit Alice')} className="mr-2 underline">
                    Edit
                </button>
                <button onClick={() => console.log('Delete Alice')} className="underline text-red-600">
                    Delete
                </button>
            </TableCell>,
        ],
        [
            <TableCell onClick={() => alert('Clicked name: Bob')}>Bob</TableCell>,
            <TableCell>{'bob@example.com'}</TableCell>,
            <TableCell>{'User'}</TableCell>,
            <TableCell>
                <button onClick={() => console.log('Promote Bob')} className="mr-2 underline">
                    Promote
                </button>
                <button onClick={() => console.log('Remove Bob')} className="underline text-red-600">
                    Remove
                </button>
            </TableCell>,
        ],
    ];

    return <Table headers={headers} rows={rows} />;
};

export default IntegratedDashboard;
