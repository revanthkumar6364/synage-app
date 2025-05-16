import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, RefreshCcw, Plus, EyeIcon, PencilIcon } from 'lucide-react';
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
    can?: {
        edit: boolean;
    };
}

interface Props {
    quotations: {
        data: Quotation[];
        meta: any;
    };
    filters: {
        search: string;
        status: string;
    };
}

export default function Index({ quotations, filters }: Props) {
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

    const getFilteredQuotations = (status: string) => {
        if (status === 'all') {
            return quotations.data;
        }
        return quotations.data.filter(quotation => quotation.status === status);
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

    const handlePageChange = (page: number) => {
        router.get(route('quotations.index'), {
            ...data,
            page
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Quotations</CardTitle>
                            <Link href={route('quotations.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Quotation
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-4 space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search by name"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="md:max-w-sm"
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

                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="w-full grid grid-cols-3 md:grid-cols-5">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="draft">Draft</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="approved">Approved</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getFilteredQuotations('all').map((quotation: Quotation) => (
                                            <TableRow key={quotation.id}>
                                                <TableCell>{quotation.reference}</TableCell>
                                                <TableCell>{quotation.title}</TableCell>
                                                <TableCell>{quotation.account?.business_name}</TableCell>
                                                <TableCell>{new Date(quotation.estimate_date).toLocaleDateString()}</TableCell>
                                                <TableCell>{formatAmount(quotation.total_amount)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(quotation.status)}>
                                                        {quotation.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="inline-flex gap-2">
                                                        <Link href={route('quotations.show', quotation.id)}>
                                                            <Button variant="outline" size="icon">
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {quotation.can?.edit && (
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
                            </TabsContent>

                            <TabsContent value="draft">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getFilteredQuotations('draft').map((quotation: Quotation) => (
                                            <TableRow key={quotation.id}>
                                                <TableCell>{quotation.reference}</TableCell>
                                                <TableCell>{quotation.title}</TableCell>
                                                <TableCell>{quotation.account?.business_name}</TableCell>
                                                <TableCell>{new Date(quotation.estimate_date).toLocaleDateString()}</TableCell>
                                                <TableCell>{formatAmount(quotation.total_amount)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(quotation.status)}>
                                                        {quotation.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="inline-flex gap-2">
                                                        <Link href={route('quotations.show', quotation.id)}>
                                                            <Button variant="outline" size="icon">
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {quotation.can?.edit && (
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
                            </TabsContent>
                        </Tabs>

                        <Pagination>
                            <PaginationContent>
                                {quotations.meta.links.map((link: any, i: number) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href={link.url}
                                            isActive={link.active}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (link.url) {
                                                    handlePageChange(link.label);
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}