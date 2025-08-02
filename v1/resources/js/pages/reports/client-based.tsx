import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Search, Eye, Filter, Calendar, DollarSign, User, Building } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Client-Based Reports', href: '#' },
];

interface ReportData {
    id: number;
    quotationNumber: string;
    accountName: string;
    contactPerson: string;
    salesPerson: string;
    amount: number;
    status: string;
    createdAt: string;
    validUntil: string;
}

interface Props {
    reportData: ReportData[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        amountFrom?: string;
        amountTo?: string;
        account?: string;
        salesPerson?: string;
    };
}

export default function ClientBasedReports({ reportData, pagination, filters }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [amountFrom, setAmountFrom] = useState(filters.amountFrom || '');
    const [amountTo, setAmountTo] = useState(filters.amountTo || '');
    const [accountFilter, setAccountFilter] = useState(filters.account || 'All');
    const [salesPersonFilter, setSalesPersonFilter] = useState(filters.salesPerson || 'All');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Get unique accounts and sales persons for filter options
    const uniqueAccounts = [...new Set(reportData.map(item => item.accountName))].sort();
    const uniqueSalesPersons = [...new Set(reportData.map(item => item.salesPerson))].sort();

    // Debug: Log the first item to check data structure
    useEffect(() => {
        if (reportData.length > 0) {
            console.log('First report item:', reportData[0]);
            console.log('Amount field:', reportData[0]?.amount);
        }
    }, [reportData]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/client-based', {
                search: searchTerm,
                status: statusFilter === 'All' ? undefined : statusFilter,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
                amountFrom: amountFrom || undefined,
                amountTo: amountTo || undefined,
                account: accountFilter === 'All' ? undefined : accountFilter,
                salesPerson: salesPersonFilter === 'All' ? undefined : salesPersonFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, statusFilter, dateFrom, dateTo, amountFrom, amountTo, accountFilter, salesPersonFilter]);

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status.toLowerCase()) {
            case 'sent':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'converted':
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'expired':
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/reports/client-based', {
            search: searchTerm,
            status: statusFilter === 'All' ? undefined : statusFilter,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            amountFrom: amountFrom || undefined,
            amountTo: amountTo || undefined,
            account: accountFilter === 'All' ? undefined : accountFilter,
            salesPerson: salesPersonFilter === 'All' ? undefined : salesPersonFilter,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDateFrom('');
        setDateTo('');
        setAmountFrom('');
        setAmountTo('');
        setAccountFilter('All');
        setSalesPersonFilter('All');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client-Based Reports" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Client-Based Reports</h1>
                        <p className="text-muted-foreground">
                            Detailed reports by client, estimate status, and conversion rates
                        </p>
                    </div>
                    <Button variant="outline">
                        Download PDF
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Basic Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search quotations, clients, or contact persons..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Status</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        className="flex items-center gap-2"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Advanced
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showAdvancedFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                                    {/* Date Range */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Date Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="date"
                                                placeholder="From"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                            />
                                            <Input
                                                type="date"
                                                placeholder="To"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Amount Range */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Amount Range (₹)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="From"
                                                value={amountFrom}
                                                onChange={(e) => setAmountFrom(e.target.value)}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="To"
                                                value={amountTo}
                                                onChange={(e) => setAmountTo(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Account Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            Account
                                        </label>
                                        <Select value={accountFilter} onValueChange={setAccountFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Accounts</SelectItem>
                                                {uniqueAccounts.map(account => (
                                                    <SelectItem key={account} value={account}>
                                                        {account}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sales Person Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Sales Person
                                        </label>
                                        <Select value={salesPersonFilter} onValueChange={setSalesPersonFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select sales person" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Sales Persons</SelectItem>
                                                {uniqueSalesPersons.map(person => (
                                                    <SelectItem key={person} value={person}>
                                                        {person}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estimate Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Quotation No.</TableHead>
                                        <TableHead>Account Name</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Sales Person</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead className="text-right">Amount (₹)</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {((pagination.current_page - 1) * pagination.per_page + index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.quotationNumber}
                                            </TableCell>
                                            <TableCell>{item.accountName}</TableCell>
                                            <TableCell>{item.contactPerson}</TableCell>
                                            <TableCell>{item.salesPerson}</TableCell>
                                            <TableCell>
                                                <span className={getStatusBadge(item.status)}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                            <TableCell>{item.validUntil}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{(item.amount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/quotations/${item.id}`}
                                                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                >
                                    «
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(9, pagination.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={page === pagination.current_page ? "default" : "outline"}
                                                size="sm"
                                                className="w-8 h-8"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                >
                                    »
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
