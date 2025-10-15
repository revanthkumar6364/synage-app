import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, RefreshCcw, Plus, EyeIcon, PencilIcon, CheckIcon, Flame, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import SubStatusDialog from '@/components/SubStatusDialog';

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
    status: 'draft' | 'pending' | 'approved' | 'order_received' | 'rejected';
    sub_status?: 'open' | 'hot' | 'cold';
    effective_sub_status?: 'open' | 'hot' | 'cold';
    sub_status_color?: string;
    sub_status_notes?: string;
    requires_pricing_approval?: boolean;
    pricing_approval_notes?: string;
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
            case 'order_received': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSubStatusColor = (subStatus?: string) => {
        switch (subStatus) {
            case 'hot': return 'bg-red-100 text-red-800 border-red-300';
            case 'cold': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRowBackgroundColor = (quotation: Quotation) => {
        // Only apply background color for approved quotations with sub-status
        if (quotation.status === 'approved' && quotation.effective_sub_status) {
            switch (quotation.effective_sub_status) {
                case 'hot': return 'bg-red-50 hover:bg-red-100';
                case 'cold': return 'bg-blue-50 hover:bg-blue-100';
                case 'open': return 'bg-yellow-50 hover:bg-yellow-100';
                default: return 'bg-white hover:bg-gray-50';
            }
        }
        return 'bg-white hover:bg-gray-50';
    };

    const formatAmount = (amount: number | null): string => {
        return formatCurrency(amount);
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
                            <div className="flex flex-col gap-4 lg:flex-row">
                                <div className="relative w-full lg:w-auto flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                    <Input
                                        placeholder="Search quotations..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button type="submit" className="flex-1 sm:flex-none">
                                        <Search className="mr-2 h-4 w-4" />Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setData({ search: '', status: 'all' });
                                            router.get(route('quotations.index'));
                                        }}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
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

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[120px]">Reference</TableHead>
                                        <TableHead className="min-w-[200px]">Title</TableHead>
                                        <TableHead className="min-w-[150px]">Customer</TableHead>
                                        <TableHead className="min-w-[100px]">Date</TableHead>
                                        <TableHead className="min-w-[120px]">Total</TableHead>
                                        <TableHead className="min-w-[100px]">Status</TableHead>
                                        <TableHead className="min-w-[100px]">Sub-Status</TableHead>
                                        <TableHead className="min-w-[120px]">Actions</TableHead>
                                        <TableHead className="min-w-[150px]">Team</TableHead>


                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotations.data.map((quotation: Quotation) => (
                                        <TableRow key={quotation.id} className={getRowBackgroundColor(quotation)}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="break-all">{quotation.reference}</span>
                                                    {quotation.parent_id && (
                                                        <span className="text-xs text-muted-foreground">
                                                            (Version {quotation.reference.split('-V')[1]})
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="min-w-[200px] max-w-[300px]">
                                                    <span className="break-words whitespace-pre-wrap">{quotation.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="min-w-[150px] max-w-[250px]">
                                                    <span className="break-words whitespace-pre-wrap">{quotation.account?.business_name || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(quotation.estimate_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap font-medium">
                                                {formatAmount(quotation.total_amount)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge className={getStatusColor(quotation.status)}>
                                                        {quotation.status === 'order_received' ? 'Order Received' : quotation.status}
                                                    </Badge>
                                                    {quotation.requires_pricing_approval && quotation.status === 'pending' && (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Pricing Approval
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {quotation.status === 'approved' && quotation.effective_sub_status && (
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getSubStatusColor(quotation.effective_sub_status)}>
                                                            {quotation.effective_sub_status.charAt(0).toUpperCase() + quotation.effective_sub_status.slice(1)}
                                                        </Badge>
                                                        <SubStatusDialog
                                                            quotationId={quotation.id}
                                                            currentSubStatus={quotation.sub_status || quotation.effective_sub_status}
                                                            currentNotes={quotation.sub_status_notes}
                                                            trigger={
                                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                    <Flame className="h-3 w-3" />
                                                                </Button>
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {quotation.status === 'approved' || quotation.status === 'order_received' || quotation.status === 'rejected' ? (
                                                        <Link href={route('quotations.show', quotation.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <EyeIcon className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        quotation.can?.approve && (
                                                            <Link href={route('quotations.show', quotation.id)}>
                                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                                    <CheckIcon className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                        )
                                                    )}
                                                    {quotation.can?.update && (
                                                        <Link href={route('quotations.edit', quotation.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <PencilIcon className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-1">
                                                    <div>
                                                        <span className="text-xs text-gray-500">Created:</span>
                                                        <span className="ml-1 break-words text-sm">{quotation.creator?.name || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500">Sales:</span>
                                                        <span className="ml-1 break-words text-sm">{quotation.sales_user?.name || '-'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
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
