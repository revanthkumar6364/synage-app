import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Search, Filter, Calendar, DollarSign, Building, User, FileDown, Printer } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Client-Based Reports', href: '#' },
];

interface ReportData {
    id: number;
    reference: string;
    accountName: string;
    contactPerson: string;
    salesPerson: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    reportData: ReportData[];
    pagination: PaginationMeta;
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

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [amountFrom, setAmountFrom] = useState(filters.amountFrom || '');
    const [amountTo, setAmountTo] = useState(filters.amountTo || '');
    const [accountFilter, setAccountFilter] = useState(filters.account || 'All');
    const [salesPersonFilter, setSalesPersonFilter] = useState(filters.salesPerson || 'All');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const reportsContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/client-based', {
                search: searchTerm || undefined,
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

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDateFrom('');
        setDateTo('');
        setAmountFrom('');
        setAmountTo('');
        setAccountFilter('All');
        setSalesPersonFilter('All');

        // Trigger reset request
        router.get('/reports/client-based', {}, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    // Get unique accounts and sales persons for filters
    const uniqueAccounts = [...new Set(reportData.map(item => item.accountName))];
    const uniqueSalesPersons = [...new Set(reportData.map(item => item.salesPerson))];

    const printReport = async () => {
        if (!reportsContainerRef.current) {
            alert('No content to print. Please try again.');
            return;
        }

        try {
            // Use browser's built-in print
            window.print();
        } catch (error) {
            alert('Failed to print report. Please use browser print function (Ctrl+P).');
        }
    };

    const exportAsCSV = () => {
        try {
            // Create CSV data from report data
            const csvData = [];

            // Add header
            csvData.push(['SL No.', 'Reference', 'Account Name', 'Contact Person', 'Sales Person', 'Amount', 'Status', 'Created Date']);

            // Add data rows
            reportData.forEach((item, index) => {
                csvData.push([
                    (index + 1).toString().padStart(2, '0'),
                    item.reference || 'N/A',
                    item.accountName,
                    item.contactPerson,
                    item.salesPerson,
                    item.amount,
                    item.status,
                    item.createdAt
                ]);
            });

            // Convert to CSV string
            const csvContent = csvData.map(row => row.join(',')).join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `client-reports-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Failed to export as CSV. Please try again.');
        }
    };



    const getStatusBadge = (status: string) => {
        const statusConfig = {
            draft: { variant: 'secondary' as const, text: 'Draft' },
            pending: { variant: 'default' as const, text: 'Pending' },
            approved: { variant: 'default' as const, text: 'Approved' },
            rejected: { variant: 'destructive' as const, text: 'Rejected' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        return <Badge variant={config.variant}>{config.text}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client-Based Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Client-Based Reports</h1>
                        <p className="text-muted-foreground">
                            View detailed reports by client, estimate status, and conversion rates
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* Export buttons */}
                        <Button variant="outline" onClick={printReport} className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={exportAsCSV} className="flex items-center gap-2">
                            <FileDown className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Performance Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div ref={reportsContainerRef} className="space-y-4">
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
                                            <div className="date-input-wrapper">
                                                <Input type="date" placeholder="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                            </div>
                                            <div className="date-input-wrapper">
                                                <Input type="date" placeholder="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount Range */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Amount Range (₹)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input type="number" placeholder="From" value={amountFrom} onChange={(e) => setAmountFrom(e.target.value)} />
                                            <Input type="number" placeholder="To" value={amountTo} onChange={(e) => setAmountTo(e.target.value)} />
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

                        {/* Table */}
                        <div className="mt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">SL No.</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Account Name</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Sales Person</TableHead>
                                        <TableHead>Amount (₹)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((item, index) => {
                                        // Calculate serial number based on current page and items per page
                                        const serialNumber = ((pagination.current_page - 1) * pagination.per_page) + index + 1;

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {serialNumber.toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.reference || 'N/A'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.accountName}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.contactPerson}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.salesPerson}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    ₹{(item.amount || 0).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(item.status)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.createdAt}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {pagination.from || 1} to {pagination.to || reportData.length} of {pagination.total} records
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (pagination.current_page > 1) {
                                                router.get('/reports/client-based', {
                                                    search: searchTerm || undefined,
                                                    status: statusFilter === 'All' ? undefined : statusFilter,
                                                    dateFrom: dateFrom || undefined,
                                                    dateTo: dateTo || undefined,
                                                    amountFrom: amountFrom || undefined,
                                                    amountTo: amountTo || undefined,
                                                    account: accountFilter === 'All' ? undefined : accountFilter,
                                                    salesPerson: salesPersonFilter === 'All' ? undefined : salesPersonFilter,
                                                    page: pagination.current_page - 1
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        disabled={pagination.current_page <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (pagination.current_page < pagination.last_page) {
                                                router.get('/reports/client-based', {
                                                    search: searchTerm || undefined,
                                                    status: statusFilter === 'All' ? undefined : statusFilter,
                                                    dateFrom: dateFrom || undefined,
                                                    dateTo: dateTo || undefined,
                                                    amountFrom: amountFrom || undefined,
                                                    amountTo: amountTo || undefined,
                                                    account: accountFilter === 'All' ? undefined : accountFilter,
                                                    salesPerson: salesPersonFilter === 'All' ? undefined : salesPersonFilter,
                                                    page: pagination.current_page + 1
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        disabled={pagination.current_page >= pagination.last_page}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
