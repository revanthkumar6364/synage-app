import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MoreVertical, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomerContactIndexProps {
    customer: any;
    contacts: any;
}

const breadcrumbs = (customer: any): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
    { title: customer.business_name, href: `/customers/${customer.id}` },
    { title: 'Contacts', href: '#' },
];

export default function CustomerContactIndex({ customer, contacts }: CustomerContactIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<any>(null);

    const handleDelete = (contact: any) => {
        setContactToDelete(contact);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (contactToDelete) {
            router.delete(route('customers.contacts.destroy', [customer.id, contactToDelete.id]));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(customer)}>
            <Head title="Customer Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold tracking-tight">Customer Contacts</CardTitle>
                        <Link href={route('customers.contacts.create', customer.id)}>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Contact
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Contact Number</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.data.map((contact: any) => (
                                    <TableRow key={contact.id}>
                                        <TableCell>{contact.name}</TableCell>
                                        <TableCell>{contact.email}</TableCell>
                                        <TableCell>{contact.contact_number}</TableCell>
                                        <TableCell>{contact.role}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {contact.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex gap-2">
                                                <Link href={route('customers.contacts.edit', [customer.id, contact.id])}>
                                                    <Button variant="outline" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDelete(contact)}
                                                    className="text-red-600"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Contact</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this contact? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
