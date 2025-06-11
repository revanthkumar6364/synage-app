import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, RefreshCcw, Plus, EyeIcon, PencilIcon, CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
];

interface Quotation {
    id: number;
    reference: string;
    title: string;
    account?: {
        business_name: string;
    };
    estimate_date: string;
    total_amount: number | null;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    parent_id?: number;
    creator?: any;
    sales_user?: any;
    can?: {
        update: boolean;
        approve: boolean;
        reject: boolean;
        view: boolean;
        editTerms: boolean;
        canEditFiles: boolean;
        delete: boolean;
    };
}

interface Props {
    quotations: {
        data: Quotation[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
    };
    filters: {
        search: string;
        status: string;
    };
    statuses: Array<{
        value: string;
        label: string;
    }>;
}

export default function Index({ quotations, filters, statuses }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('quotations.index'), data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (status: string) => {
        const newData = { ...data, status };
        setData(newData);
        router.get(route('quotations.index'), {
            ...newData,
            page: 1 // Reset to first page when changing status
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAmount = (amount: number | null): string => {
        if (amount === null || isNaN(amount)) return '₹0.00';
        return `₹${Number(amount).toFixed(2)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Quotations</CardTitle>
                            {auth.can.quotations.create && (
                                <Link href={route('quotations.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Quotation
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-4 space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                    <Input
                                        placeholder="Search quotations..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-9 md:max-w-sm"
                                    />
                                </div>
                                <Button type="submit">
                                    <Search className="mr-2 h-4 w-4" />Search
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData({ search: '', status: 'all' });
                                        router.get(route('quotations.index'));
                                    }}
                                >
                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </form>

                        <div className="mb-4">
                            <Tabs value={data.status} onValueChange={handleStatusChange} className="w-full">
                                <TabsList className="w-full sm:w-auto">
                                    {statuses.map((status) => (
                                        <TabsTrigger
                                            key={status.value}
                                            value={status.value}
                                            className="flex-1 sm:flex-none"
                                        >
                                            {status.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Sales Person</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotations.data.map((quotation: Quotation) => (
                                    <TableRow key={quotation.id}>
                                        <TableCell>
                                            {quotation.reference}
                                            {quotation.parent_id && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (Version {quotation.reference.split('-V')[1]})
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{quotation.title}</TableCell>
                                        <TableCell>{quotation.account?.business_name}</TableCell>
                                        <TableCell>{new Date(quotation.estimate_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{formatAmount(quotation.total_amount)}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(quotation.status)}>
                                                {quotation.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{quotation.creator?.name}</TableCell>
                                        <TableCell>{quotation.sales_user?.name}</TableCell>
                                        <TableCell>
                                            <div className="inline-flex gap-2">
                                                {quotation.status === 'approved' || quotation.status === 'rejected' ? (
                                                    <Link href={route('quotations.show', quotation.id)}>
                                                        <Button variant="outline" size="icon">
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    quotation.can?.approve && (
                                                        <Link href={route('quotations.show', quotation.id)}>
                                                            <Button variant="outline" size="icon">
                                                                <CheckIcon className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )
                                                )}
                                                {quotation.can?.update && (
                                                    <Link href={route('quotations.edit', quotation.id)}>
                                                        <Button variant="outline" size="icon">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing page {quotations.current_page} of {quotations.last_page}
                            </p>
                            <Pagination>
                                <PaginationContent>
                                    {quotations.current_page > 1 && (
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(route('quotations.index'), {
                                                        ...data,
                                                        page: quotations.current_page - 1
                                                    }, {
                                                        preserveState: true,
                                                        preserveScroll: true
                                                    });
                                                }}
                                            >
                                                Previous
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {Array.from({ length: quotations.last_page }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        const shouldShow = page === 1 ||
                                            page === quotations.last_page ||
                                            Math.abs(page - quotations.current_page) <= 1;

                                        if (!shouldShow) {
                                            // Show ellipsis for skipped pages, but only once
                                            if (page === 2 || page === quotations.last_page - 1) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <span className="px-4 py-2">...</span>
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        }

                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === quotations.current_page}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.get(route('quotations.index'), {
                                                            ...data,
                                                            page
                                                        }, {
                                                            preserveState: true,
                                                            preserveScroll: true
                                                        });
                                                    }}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {quotations.current_page < quotations.last_page && (
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(route('quotations.index'), {
                                                        ...data,
                                                        page: quotations.current_page + 1
                                                    }, {
                                                        preserveState: true,
                                                        preserveScroll: true
                                                    });
                                                }}
                                            >
                                                Next
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
