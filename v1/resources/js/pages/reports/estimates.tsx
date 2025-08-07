import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Search, Filter, Calendar, DollarSign, Download, FileDown, Printer } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Estimate Analytics', href: '#' },
];

interface EstimateData {
    id: number;
    reference: string;
    clientName: string;
    salesPerson: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface Analytics {
    totalEstimates: number;
    approvedEstimates: number;
    pendingEstimates: number;
    rejectedEstimates: number;
    draftEstimates: number;
    totalAmount: number;
    approvedAmount: number;
    averageResponseTime: number;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    estimateData: EstimateData[];
    pagination: Pagination;
    analytics: Analytics;
    filters: {
        search?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        amountFrom?: string;
        amountTo?: string;
    };
}

export default function EstimateAnalytics({ estimateData, pagination, analytics, filters }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [amountFrom, setAmountFrom] = useState(filters.amountFrom || '');
    const [amountTo, setAmountTo] = useState(filters.amountTo || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const estimatesContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/estimates', {
                search: searchTerm || undefined,
                status: statusFilter === 'All' ? undefined : statusFilter,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
                amountFrom: amountFrom || undefined,
                amountTo: amountTo || undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, statusFilter, dateFrom, dateTo, amountFrom, amountTo]);

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDateFrom('');
        setDateTo('');
        setAmountFrom('');
        setAmountTo('');

        // Trigger reset request
        router.get('/reports/estimates', {}, {
            preserveState: false,
            replace: true
        });
    };

    const printReport = async () => {
        if (!estimatesContainerRef.current) {
            alert('No content to print. Please try again.');
            return;
        }

        try {
            // Use browser's built-in print
            window.print();
        } catch (error) {
            console.error('Error printing report:', error);
            alert('Failed to print report. Please use browser print function (Ctrl+P).');
        }
    };

    const exportAsCSV = () => {
        try {
            // Create CSV data from estimates data
            const csvData = [];

            // Add analytics summary
            csvData.push(['Analytics Summary']);
            csvData.push(['Metric', 'Value']);
            csvData.push(['Total Estimates', analytics.totalEstimates]);
            csvData.push(['Approved Estimates', analytics.approvedEstimates]);
            csvData.push(['Pending Estimates', analytics.pendingEstimates]);
            csvData.push(['Rejected Estimates', analytics.rejectedEstimates]);
            csvData.push(['Draft Estimates', analytics.draftEstimates]);
            csvData.push(['Total Amount', analytics.totalAmount]);
            csvData.push(['Approved Amount', analytics.approvedAmount]);
            csvData.push(['Average Response Time', analytics.averageResponseTime]);

            // Add estimates data
            csvData.push([]);
            csvData.push(['Estimate Details']);
            csvData.push(['SL No.', 'Reference', 'Client Name', 'Sales Person', 'Amount', 'Status', 'Created Date']);
            estimateData.forEach((item, index) => {
                csvData.push([
                    (index + 1).toString().padStart(2, '0'),
                    item.reference || 'N/A',
                    item.clientName,
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
            link.setAttribute('download', `estimates-report-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting as CSV:', error);
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

    const conversionRate = analytics.totalEstimates > 0 ? ((analytics.approvedEstimates / analytics.totalEstimates) * 100).toFixed(1) : '0.0';
    const averageEstimateValue = analytics.totalEstimates > 0 ? (analytics.totalAmount / analytics.totalEstimates).toFixed(2) : '0.00';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estimate Analytics" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Estimate Analytics</h1>
                        <p className="text-muted-foreground">
                            Detailed analytics on estimate performance and trends
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* Always show print and CSV buttons */}
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

                {/* Analytics Cards */}
                <div ref={estimatesContainerRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                All estimates created
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.approvedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {conversionRate}% success rate
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.pendingEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting response
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.rejectedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.totalEstimates > 0 ? ((analytics.rejectedEstimates / analytics.totalEstimates) * 100).toFixed(1) : '0'}% rejection rate
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{(analytics.totalAmount || 0).toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Combined estimate value
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{(analytics.approvedAmount || 0).toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Revenue from approved estimates
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Draft Estimates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.draftEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                In progress estimates
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.averageResponseTime.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground">
                                Average approval time
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estimate Performance Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Basic Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search estimates, clients, or sales persons..."
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
                                            <Input type="date" placeholder="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                            <Input type="date" placeholder="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
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
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Sales Person</TableHead>
                                        <TableHead>Amount (₹)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {estimateData.map((item, index) => {
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
                                                    {item.clientName}
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
                            {pagination.last_page > 1 && (
                                <div className="flex items-center justify-between space-x-2 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/reports/estimates', { ...filters, page: pagination.current_page - 1 })}
                                            disabled={pagination.current_page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <div className="text-sm">
                                            Page {pagination.current_page} of {pagination.last_page}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/reports/estimates', { ...filters, page: pagination.current_page + 1 })}
                                            disabled={pagination.current_page === pagination.last_page}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
