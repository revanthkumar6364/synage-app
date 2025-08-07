import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Search, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Sales Reports', href: '#' },
];

interface SalesData {
    id: number;
    type: string;
    salesCategory: string;
    estimates: number;
    converted: number;
    conversionPercentage: number;
    totalSales: number;
}

interface Props {
    salesData: SalesData[];
    summaryStats: {
        totalEstimates: number;
        totalConverted: number;
        overallConversionRate: number;
        totalSales: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
}

export default function SalesReports({ salesData, summaryStats, filters }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'All');

    // Get unique types for filter dropdown
    const uniqueTypes = [...new Set(salesData.map(item => item.type))].sort();

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/sales', {
                search: searchTerm,
                category: categoryFilter === 'All' ? undefined : categoryFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, categoryFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
                        <p className="text-muted-foreground">
                            Analyze sales performance by category, user, project, and industry
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search sales categories..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {uniqueTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.totalEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all categories
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Converted</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.totalConverted.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Successful conversions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.overallConversionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Overall success rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{summaryStats.totalSales.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Total revenue generated
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Performance by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">SL No.</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Sales Category</TableHead>
                                        <TableHead className="text-right">Estimates</TableHead>
                                        <TableHead className="text-right">Converted</TableHead>
                                        <TableHead className="text-right">Conversion %</TableHead>
                                        <TableHead className="text-right">Total Sales (₹)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesData.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.type}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.salesCategory}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.estimates}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.converted}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-medium ${
                                                    item.conversionPercentage >= 80 ? 'text-green-600' :
                                                    item.conversionPercentage >= 60 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                    {item.conversionPercentage}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{(item.totalSales || 0).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {salesData.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No sales data found for the selected filters.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
