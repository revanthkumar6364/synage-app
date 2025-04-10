import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreVertical, PencilIcon, PlusIcon, TrashIcon, UsersIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

export default function CustomersIndex({ customers, filters, statuses }: {
    customers: any;
    filters: any;
    statuses: Record<string, string>;
}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('customers.index'), data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (customer: any) => {
        setSelectedCustomer(customer);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCustomer) {
            router.delete(route('customers.destroy', selectedCustomer.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedCustomer(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Customers</CardTitle>
                            <Link href={route('customers.create')}>
                                <Button>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Customer
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-4 space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <Input
                                    placeholder="Search by business name or GST number"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="md:max-w-sm"
                                />
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger className="md:w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit">
                                    <SearchIcon className="mr-2 h-4 w-4" />Search
                                </Button>
                            </div>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Business ID</TableHead>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>GST Number</TableHead>
                                    <TableHead>Industry Type</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.data.map((customer: any) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.business_id}</TableCell>
                                        <TableCell>{customer.business_name}</TableCell>
                                        <TableCell>{customer.gst_number}</TableCell>
                                        <TableCell>{customer.industry_type}</TableCell>
                                        <TableCell>{customer.billing_city}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    customer.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {customer.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex gap-2">
                                                {customer.can.edit && (
                                                    <Link href={route('customers.edit', customer.id)}>
                                                        <Button variant="outline" size="icon">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={route('customers.contacts.index', customer.id)}>
                                                    <Button variant="outline" size="icon">
                                                        <UsersIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {customer.can.delete && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(customer)}
                                                        className="text-red-600"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Pagination className="mt-4" {...customers.meta} />
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this customer? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
