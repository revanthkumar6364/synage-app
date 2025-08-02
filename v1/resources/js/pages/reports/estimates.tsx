import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Search, TrendingUp, FileText, Clock, CheckCircle, XCircle, Filter, Calendar, DollarSign, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Estimate Analytics', href: '#' },
];

interface EstimateData {
    id: number;
    estimateNumber: string;
    clientName: string;
    salesPerson: string;
    amount: number;
    status: string;
    createdAt: string;
    validUntil: string;
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

interface Props {
    estimateData: EstimateData[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
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

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/estimates', {
                search: searchTerm,
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

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status.toLowerCase()) {
            case 'draft':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/reports/estimates', {
            search: searchTerm,
            status: statusFilter === 'All' ? undefined : statusFilter,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            amountFrom: amountFrom || undefined,
            amountTo: amountTo || undefined,
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
    };

    const exportReport = () => {
        // TODO: Implement export functionality
        console.log('Export report');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estimate Analytics" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Estimate Analytics</h1>
                        <p className="text-muted-foreground">
                            Detailed analytics on estimate performance and trends
                        </p>
                    </div>
                    <Button variant="outline" onClick={exportReport} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Report
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
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                All estimates
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{analytics.approvedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.totalEstimates > 0 ? Math.round((analytics.approvedEstimates / analytics.totalEstimates) * 100) : 0}% success rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{analytics.pendingEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{analytics.rejectedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.totalEstimates > 0 ? Math.round((analytics.rejectedEstimates / analytics.totalEstimates) * 100) : 0}% rejection rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Analytics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{analytics.totalAmount.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Combined estimate value
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Value</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">₹{analytics.approvedAmount.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Revenue from approved estimates
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Draft Estimates</CardTitle>
                            <FileText className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{analytics.draftEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                In progress estimates
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estimate Performance Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Estimate No.</TableHead>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Sales Person</TableHead>
                                        <TableHead className="text-right">Amount (₹)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {estimateData.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {((pagination.current_page - 1) * pagination.per_page + index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.estimateNumber}
                                            </TableCell>
                                            <TableCell>{item.clientName}</TableCell>
                                            <TableCell>{item.salesPerson}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{(item.amount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <span className={getStatusBadge(item.status)}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                            <TableCell>{item.validUntil}</TableCell>
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

                        {/* Summary Stats */}
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-muted-foreground">Average Response Time</div>
                                    <div className="text-2xl font-bold">{analytics.averageResponseTime} days</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                                    <div className="text-2xl font-bold">
                                        {analytics.totalEstimates > 0 ? Math.round((analytics.approvedEstimates / analytics.totalEstimates) * 100) : 0}%
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-muted-foreground">Average Estimate Value</div>
                                    <div className="text-2xl font-bold">
                                        ₹{analytics.totalEstimates > 0 ? Math.round(analytics.totalAmount / analytics.totalEstimates).toLocaleString() : 0}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
