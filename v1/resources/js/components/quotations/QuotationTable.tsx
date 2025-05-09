import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Quotation } from "@/types";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";

interface Props {
    quotations: Quotation[];
    status: string;
}

export default function QuotationTable({ quotations, status }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'sent': return 'bg-blue-100 text-blue-800';
            case 'converted': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                        <TableCell>{quotation.reference}</TableCell>
                        <TableCell>{quotation.title}</TableCell>
                        <TableCell>{format(new Date(quotation.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{quotation.customer_account?.business_name}</TableCell>
                        <TableCell>${quotation.total.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(quotation.status)}>
                                {quotation.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Link
                                    href={route('quotations.edit', quotation.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={route('quotations.show', quotation.id)}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    View
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}