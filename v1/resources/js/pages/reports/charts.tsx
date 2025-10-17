import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    AreaChart,
    Printer,
    DollarSign,
    Users,
    FileText
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '/reports' },
    { title: 'Visual Charts', href: '#' },
];

interface ChartData {
    estimatesData: Array<{
        month: string;
        series1: number;
        series2: number;
        series3: number;
    }>;
    proformaData: Array<{
        month: string;
        value: number;
    }>;
    conversionData: Array<{
        category: string;
        value: number;
        percentage: number;
    }>;
}

interface Props {
    chartData: ChartData;
    filters: {
        status?: string;
        category?: string;
        session?: string;
    };
}

export default function VisualCharts({ chartData, filters }: Props) {

    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'All');
    const [sessionFilter, setSessionFilter] = useState(filters.session || 'monthly');
    const chartsContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filterParams = {
                status: statusFilter === 'All' ? undefined : statusFilter,
                category: categoryFilter === 'All' ? undefined : categoryFilter,
                session: sessionFilter,
            };

            router.get('/reports/charts', filterParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, categoryFilter, sessionFilter]);

    // Calculate chart data
    const maxValue = Math.max(1, ...chartData.estimatesData.flatMap(data => [data.series1, data.series2, data.series3]));
    const maxProformaValue = Math.max(1, ...chartData.proformaData.map(data => data.value));

    // Calculate revenue path for line chart with better scaling for low data
    const maxRevenueForScale = Math.max(maxProformaValue, 1000); // Minimum scale of 1000 for revenue
    const revenuePath = chartData.proformaData.map((data, index) => {
        const x = (index / (chartData.proformaData.length - 1)) * 80 + 10;
        const y = 90 - ((data.value / maxRevenueForScale) * 80);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ` L ${(chartData.proformaData.length - 1) / (chartData.proformaData.length - 1) * 80 + 10} 90 L 10 90 Z`;

    // Calculate total revenue
    const totalRevenue = chartData.proformaData.reduce((sum, data) => sum + data.value, 0);

    // Calculate cumulative data for area chart with better scaling
    let cumulative = 0;
    const cumulativeData = chartData.proformaData.map(data => {
        cumulative += data.value;
        return { ...data, cumulative };
    });
    const maxCumulative = Math.max(1, ...cumulativeData.map(d => d.cumulative));
    const maxCumulativeForScale = Math.max(maxCumulative, 1000); // Minimum scale of 1000 for cumulative

    // Calculate cumulative path
    const cumulativePath = cumulativeData.map((data, index) => {
        const x = (index / (cumulativeData.length - 1)) * 80 + 10;
        const y = 90 - ((data.cumulative / maxCumulativeForScale) * 80);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ` L ${(cumulativeData.length - 1) / (cumulativeData.length - 1) * 80 + 10} 90 L 10 90 Z`;

    // Calculate cumulative revenue
    const cumulativeRevenue = cumulativeData[cumulativeData.length - 1]?.cumulative || 0;

    const resetFilters = () => {
        setStatusFilter('All');
        setCategoryFilter('All');
        setSessionFilter('monthly'); // Reset session filter
    };

    const printCharts = async () => {
        try {
            // Check if we have content to print
            if (!chartsContainerRef.current) {
                alert('No content to print. Please try again.');
                return;
            }

            // Check if charts container has any visible content
            const container = chartsContainerRef.current;
            const hasContent = container.children.length > 0 &&
                             (container.querySelectorAll('svg, .text-2xl, .text-sm, .text-3xl, .text-lg').length > 0 ||
                              (container.textContent && container.textContent.trim().length > 0));

            if (!hasContent) {
                alert('No content to print. Please try again.');
                return;
            }

            // Use browser's built-in print
            window.print();
        } catch (error) {
            console.error('Error printing charts:', error);
            alert('Failed to print charts. Please use browser print function (Ctrl+P).');
        }
    };

    const exportCSV = () => {
        try {
            // Create CSV data from chart data
            const csvData = [];

            // Add estimates data
            csvData.push(['Month', 'Total Estimates', 'Approved', 'Pending']);
            chartData.estimatesData.forEach(data => {
                csvData.push([data.month, data.series1, data.series2, data.series3]);
            });

            // Add proforma data
            csvData.push([]);
            csvData.push(['Month', 'Proforma Value']);
            chartData.proformaData.forEach(data => {
                csvData.push([data.month, data.value]);
            });

            // Add conversion data
            csvData.push([]);
            csvData.push(['Category', 'Value', 'Percentage']);
            chartData.conversionData.forEach(data => {
                csvData.push([data.category, data.value, data.percentage]);
            });

            // Convert to CSV string
            const csvContent = csvData.map(row => row.join(',')).join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `charts-data-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting as CSV:', error);
            alert('Failed to export as CSV. Please try again.');
        }
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visual Charts" />
            <div ref={chartsContainerRef} className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Visual Charts</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Interactive analytics and performance insights with real-time filtering
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={printCharts} variant="outline" size="lg">
                            <Printer className="h-5 w-5 mr-2" />
                            Print Charts
                        </Button>
                        <Button onClick={exportCSV} variant="outline" size="lg">
                            <FileText className="h-5 w-5 mr-2" />
                            Export as CSV
                        </Button>
                    </div>
                </div>

                {/* Filters Section */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Chart Filters</CardTitle>
                        <p className="text-sm text-muted-foreground">Customize your chart data with these filters</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Status Filter</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Statuses</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category Filter</label>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        <SelectItem value="unilumin">Unilumin</SelectItem>
                                        <SelectItem value="absen">Absen</SelectItem>
                                        <SelectItem value="radiant_synage">Radiant Synage</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Time Period</label>
                                <Select value={sessionFilter} onValueChange={setSessionFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <Button onClick={resetFilters} variant="outline" size="sm">
                                Reset Filters
                            </Button>
                            {(statusFilter !== 'All' || categoryFilter !== 'All') && (
                                <div className="flex gap-2">
                                    {statusFilter !== 'All' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            Status: {statusFilter}
                                        </span>
                                    )}
                                    {categoryFilter !== 'All' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Category: {categoryFilter}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Status Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Approved</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series2, 0)}
                                    </p>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Rejected</p>
                                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">0</p>
                                </div>
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Pending</p>
                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series3, 0)}
                                    </p>
                                </div>
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Draft</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series1, 0) -
                                         chartData.estimatesData.reduce((sum, data) => sum + data.series2, 0) -
                                         chartData.estimatesData.reduce((sum, data) => sum + data.series3, 0)}
                                    </p>
                                </div>
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="space-y-6">
                    {/* Estimates Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Estimates Trend
                            </CardTitle>
                            <CardDescription>Weekly estimates breakdown by status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-80 overflow-y-auto space-y-2">
                                <div className="space-y-2">
                                    {chartData.estimatesData.map((data, index) => {
                                        // Use a minimum scale to ensure bars are visible even with low data
                                        const maxValueForScale = Math.max(maxValue, 5); // Minimum scale of 5
                                        const totalHeight = (data.series1 / maxValueForScale) * 100;
                                        const approvedHeight = (data.series2 / maxValueForScale) * 100;
                                        const pendingHeight = (data.series3 / maxValueForScale) * 100;

                                        return (
                                            <div key={index} className="flex items-end gap-4 h-14 border-b border-gray-200 pb-2">
                                                <div className="flex items-end gap-2 flex-1">
                                                    <div
                                                        className="bg-blue-500 rounded-t border border-blue-600"
                                                        style={{
                                                            height: `${Math.max(totalHeight, 12)}%`,
                                                            minHeight: '12px',
                                                            width: '35px'
                                                        }}
                                                        title={`Total: ${data.series1} (${totalHeight.toFixed(1)}%)`}
                                                    ></div>
                                                    <div
                                                        className="bg-green-500 rounded-t border border-green-600"
                                                        style={{
                                                            height: `${Math.max(approvedHeight, 12)}%`,
                                                            minHeight: '12px',
                                                            width: '35px'
                                                        }}
                                                        title={`Approved: ${data.series2} (${approvedHeight.toFixed(1)}%)`}
                                                    ></div>
                                                    <div
                                                        className="bg-yellow-500 rounded-t border border-yellow-600"
                                                        style={{
                                                            height: `${Math.max(pendingHeight, 12)}%`,
                                                            minHeight: '12px',
                                                            width: '35px'
                                                        }}
                                                        title={`Pending: ${data.series3} (${pendingHeight.toFixed(1)}%)`}
                                                    ></div>
                                                </div>
                                                <div className="flex flex-col items-center min-w-[110px] max-w-[130px]">
                                                    <span className="text-sm text-muted-foreground truncate w-full text-center font-medium">
                                                        {data.month}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate w-full text-center mt-1">
                                                        T:{data.series1} A:{data.series2} P:{data.series3}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className="font-medium">Total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span className="font-medium">Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                    <span className="font-medium">Pending</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Revenue Trend
                            </CardTitle>
                            <CardDescription>Weekly revenue from approved estimates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 relative">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={revenuePath}
                                        fill="url(#revenueGradient)"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        className="transition-all duration-300 hover:stroke-2"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            ₹{totalRevenue.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between text-xs text-muted-foreground dark:text-gray-300 px-4">
                                {chartData.proformaData.map((data, index) => (
                                    <span key={index} className="px-2 truncate max-w-[80px] text-center font-medium">
                                        {data.month}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-purple-600" />
                                Status Distribution
                            </CardTitle>
                            <CardDescription>Breakdown of estimates by status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 flex items-center justify-center">
                                <div className="relative w-56 h-56">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {chartData.conversionData.map((data, index) => {
                                            const total = chartData.conversionData.reduce((sum, item) => sum + item.value, 0);
                                            const startAngle = chartData.conversionData
                                                .slice(0, index)
                                                .reduce((sum, item) => sum + (item.value / total) * 360, 0);
                                            const endAngle = startAngle + (data.value / total) * 360;
                                            const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];
                                            const color = colors[index % colors.length];

                                            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                                            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                                            const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                                            const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);

                                            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

                                            const pathData = [
                                                `M 50 50`,
                                                `L ${x1} ${y1}`,
                                                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                                'Z'
                                            ].join(' ');

                                            return (
                                                <g key={index}>
                                                    <path
                                                        d={pathData}
                                                        fill={color}
                                                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                    />
                                                </g>
                                            );
                                        })}
                                        <circle cx="50" cy="50" r="20" fill="white" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-700">
                                                {chartData.conversionData.reduce((sum, item) => sum + item.value, 0)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {chartData.conversionData.map((data, index) => {
                                    const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{data.category}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{data.value}</div>
                                                <div className="text-xs text-muted-foreground">({data.percentage}%)</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Overview Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AreaChart className="h-5 w-5 text-indigo-600" />
                                Revenue Overview
                            </CardTitle>
                            <CardDescription>Cumulative revenue trends over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 relative">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="cumulativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={cumulativePath}
                                        fill="url(#cumulativeGradient)"
                                        stroke="#6366f1"
                                        strokeWidth="2"
                                        className="transition-all duration-300 hover:stroke-2"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            ₹{cumulativeRevenue.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground dark:text-gray-300">Cumulative Revenue</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between text-xs text-muted-foreground dark:text-gray-300 px-4">
                                {chartData.proformaData.map((data, index) => (
                                    <span key={index} className="px-2 truncate max-w-[80px] text-center font-medium">
                                        {data.month}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
