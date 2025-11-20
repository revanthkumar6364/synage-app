import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AccountShowProps {
    account: any;
}

const breadcrumbs = (account: any): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Accounts', href: '/accounts' },
    { title: account.data.business_name, href: '#' },
];

export default function AccountShow({ account }: AccountShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('accounts.destroy', account.data.id), {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            },
            onError: () => {
                // Keep dialog open if there's an error
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(account)}>
            <Head title={account.data.business_name} />
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold tracking-tight">{account.data.business_name}</CardTitle>
                        <div className="flex items-center gap-1">
                            {account.data.can.view && (
                            <Link href={route('accounts.contacts.index', { account: account.data.id })}>
                                <Button>
                                    <UsersIcon className="mr-1 h-3 w-3" />
                                    Manage Contacts
                                </Button>
                            </Link>
                            )}
                            {account.data.can.edit && (
                            <Link href={route('accounts.edit', account.data.id)}>
                                <Button variant="outline">
                                    <PencilIcon className="mr-1 h-3 w-3" />
                                    Edit
                                </Button>
                            </Link>
                            )}
                            {account.data.can.delete && (
                                <Button variant="outline" onClick={handleDelete} className="text-red-600">
                                    <TrashIcon className="mr-1 h-3 w-3" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-4">
                                        <h3 className="text-sm font-medium text-gray-500">Business ID</h3>
                                        <p className="mt-1 text-lg font-semibold">{account.data.business_id}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4">
                                        <h3 className="text-sm font-medium text-gray-500">GST Number</h3>
                                        <p className="mt-1 text-lg font-semibold">{account.data.gst_number || '-'}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4">
                                        <h3 className="text-sm font-medium text-gray-500">Industry Type</h3>
                                        <p className="mt-1 text-lg font-semibold">{account.data.industry_type || '-'}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4">
                                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                        <span className={`mt-1 inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${
                                            account.data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {account.data.status}
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Billing Address</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                            <p className="mt-1">{account.data.billing_address || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                            <p className="mt-1">{account.data.billing_location || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">City</h4>
                                            <p className="mt-1">{account.data.billing_city || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">ZIP Code</h4>
                                            <p className="mt-1">{account.data.billing_zip_code || '-'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {!account.same_as_billing && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Shipping Address</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                                <p className="mt-1">{account.data.shipping_address || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                                <p className="mt-1">{account.data.shipping_location || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">City</h4>
                                                <p className="mt-1">{account.data.shipping_city || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">ZIP Code</h4>
                                                <p className="mt-1">{account.data.shipping_zip_code || '-'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Contacts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Designation</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {account.data.contacts?.map((contact: any) => (
                                                <TableRow key={contact.id}>
                                                    <TableCell>{contact.name}</TableCell>
                                                    <TableCell>{contact.email}</TableCell>
                                                    <TableCell>{contact.contact_number}</TableCell>
                                                    <TableCell>{contact.role}</TableCell>
                                                </TableRow>
                                            ))}
                                            {(!account.data.contacts || account.data.contacts.length === 0) && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                                        No contacts found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this account? This action cannot be undone.
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
