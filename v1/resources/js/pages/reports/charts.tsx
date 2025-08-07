import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, Download, Printer, FileDown, TrendingUp, PieChart, LineChart, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    const { auth } = usePage<{ auth: any }>().props;
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

            console.log('Sending filters:', filterParams);

            router.get('/reports/charts', filterParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, categoryFilter, sessionFilter]);

    const maxValue = Math.max(1, ...chartData.estimatesData.map(d => Math.max(d.series1, d.series2, d.series3)));
    const maxProformaValue = Math.max(1, ...chartData.proformaData.map(d => d.value));

    // Debug logging
    console.log('Chart Data:', chartData);
    console.log('Max Value:', maxValue);
    console.log('Max Proforma Value:', maxProformaValue);

    const resetFilters = () => {
        setStatusFilter('All');
        setCategoryFilter('All');
        setSessionFilter('monthly'); // Reset session filter
    };

    const printCharts = async () => {
        if (!chartsContainerRef.current) {
            alert('No content to print. Please try again.');
            return;
        }

        try {
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
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6">
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
                            <FileDown className="h-5 w-5 mr-2" />
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

                {/* Data Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Estimates</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series1, 0)}
                                    </p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Approved</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series2, 0)}
                                    </p>
                                </div>
                                <Activity className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                                        {chartData.estimatesData.reduce((sum, data) => sum + data.series3, 0)}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Revenue</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        ₹{chartData.proformaData.reduce((sum, data) => sum + data.value, 0).toLocaleString()}
                                    </p>
                                </div>
                                <PieChart className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div ref={chartsContainerRef} className="grid gap-8 lg:grid-cols-2">
                    {/* Estimates Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estimates Trend (Bar Chart)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span>Total</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Approved</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span>Pending</span>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="h-80 space-y-2 overflow-x-auto">
                                    {/* Debug Info */}
                                    <div className="text-xs text-gray-500 mb-2">
                                        Debug: Max Value = {maxValue}, Data Points = {chartData.estimatesData.length}
                                    </div>
                                    <div className="min-w-[600px]">
                                        {chartData.estimatesData.map((data, index) => {
                                            const totalHeight = (data.series1 / maxValue) * 100;
                                            const approvedHeight = (data.series2 / maxValue) * 100;
                                            const pendingHeight = (data.series3 / maxValue) * 100;

                                            // Debug logging for each bar
                                            console.log(`${data.month}: Total=${data.series1} (${totalHeight.toFixed(1)}%), Approved=${data.series2} (${approvedHeight.toFixed(1)}%), Pending=${data.series3} (${pendingHeight.toFixed(1)}%)`);

                                            return (
                                                <div key={index} className="flex items-end gap-2 h-12 border-b border-gray-200">
                                                    <div className="flex items-end gap-1 flex-1">
                                                        <div
                                                            className="bg-blue-500 rounded-t border border-blue-600"
                                                            style={{
                                                                height: `${Math.max(totalHeight, 8)}%`,
                                                                minHeight: '8px',
                                                                width: '30px'
                                                            }}
                                                            title={`Total: ${data.series1} (${totalHeight.toFixed(1)}%)`}
                                                        ></div>
                                                        <div
                                                            className="bg-green-500 rounded-t border border-green-600"
                                                            style={{
                                                                height: `${Math.max(approvedHeight, 8)}%`,
                                                                minHeight: '8px',
                                                                width: '30px'
                                                            }}
                                                            title={`Approved: ${data.series2} (${approvedHeight.toFixed(1)}%)`}
                                                        ></div>
                                                        <div
                                                            className="bg-yellow-500 rounded-t border border-yellow-600"
                                                            style={{
                                                                height: `${Math.max(pendingHeight, 8)}%`,
                                                                minHeight: '8px',
                                                                width: '30px'
                                                            }}
                                                            title={`Pending: ${data.series3} (${pendingHeight.toFixed(1)}%)`}
                                                        ></div>
                                                    </div>
                                                    <div className="flex flex-col items-center min-w-[100px] max-w-[120px]">
                                                        <span className="text-xs text-muted-foreground truncate w-full text-center">
                                                            {data.month}
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate w-full text-center">
                                                            T:{data.series1} A:{data.series2} P:{data.series3}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proforma Invoice Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LineChart className="h-5 w-5" />
                                Proforma Invoice Value (Line Chart)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 relative">
                                {/* Line Chart */}
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    {/* Grid Lines */}
                                    {[0, 25, 50, 75, 100].map((y, i) => (
                                        <line
                                            key={i}
                                            x1="0"
                                            y1={y}
                                            x2="100"
                                            y2={y}
                                            stroke="#e5e7eb"
                                            strokeWidth="0.5"
                                        />
                                    ))}

                                    {/* Data Line */}
                                    <polyline
                                        points={chartData.proformaData.map((data, index) => {
                                            const x = (index / (chartData.proformaData.length - 1)) * 80 + 10;
                                            const y = 90 - ((data.value / maxProformaValue) * 80);
                                            return `${x},${y}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                    />

                                    {/* Data Points */}
                                    {chartData.proformaData.map((data, index) => {
                                        const x = (index / (chartData.proformaData.length - 1)) * 80 + 10;
                                        const y = 90 - ((data.value / maxProformaValue) * 80);
                                        return (
                                            <circle
                                                key={index}
                                                cx={x}
                                                cy={y}
                                                r="2"
                                                fill="#3b82f6"
                                            />
                                        );
                                    })}
                                </svg>

                                {/* Month Labels */}
                                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                                    {chartData.proformaData.map((data, index) => (
                                        <span key={index} className="truncate max-w-[60px] text-center">
                                            {data.month}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Area Chart - Monthly Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Monthly Trends (Area Chart)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 relative">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    {/* Area Chart for Approved Estimates */}
                                    <path
                                        d={chartData.estimatesData.map((data, index) => {
                                            const x = (index / (chartData.estimatesData.length - 1)) * 80 + 10;
                                            const y = 90 - ((data.series2 / maxValue) * 80);
                                            return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                        }).join(' ') + ' L 90 90 L 10 90 Z'}
                                        fill="rgba(34, 197, 94, 0.2)"
                                        stroke="#22c55e"
                                        strokeWidth="1"
                                    />

                                    {/* Data Points */}
                                    {chartData.estimatesData.map((data, index) => {
                                        const x = (index / (chartData.estimatesData.length - 1)) * 80 + 10;
                                        const y = 90 - ((data.series2 / maxValue) * 80);
                                        return (
                                            <circle
                                                key={index}
                                                cx={x}
                                                cy={y}
                                                r="1.5"
                                                fill="#22c55e"
                                            />
                                        );
                                    })}
                                </svg>

                                {/* Month Labels */}
                                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                                    {chartData.estimatesData.map((data, index) => (
                                        <span key={index} className="truncate max-w-[60px] text-center">
                                            {data.month}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pie Chart - Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Status Distribution (Pie Chart)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center space-x-8">
                                {/* Pie Chart */}
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {/* Pie Chart Segments */}
                                        {chartData.conversionData.map((item, index) => {
                                            const startAngle = chartData.conversionData
                                                .slice(0, index)
                                                .reduce((sum, d) => sum + d.percentage, 0) * 3.6;
                                            const endAngle = startAngle + (item.percentage * 3.6);

                                            const colors = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'];

                                            return (
                                                <circle
                                                    key={index}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke={colors[index]}
                                                    strokeWidth="20"
                                                    strokeDasharray={`${item.percentage * 3.6} ${360 - item.percentage * 3.6}`}
                                                    strokeDashoffset={90 - startAngle}
                                                />
                                            );
                                        })}

                                        {/* Center Text */}
                                        <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-sm font-medium fill-current">
                                            {chartData.conversionData.reduce((sum, item) => sum + item.value, 0)}
                                        </text>
                                    </svg>
                                </div>

                                {/* Legend */}
                                <div className="space-y-4">
                                    {chartData.conversionData.map((item, index) => {
                                        const colors = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'];
                                        return (
                                            <div key={index} className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: colors[index] }}
                                                ></div>
                                                <div>
                                                    <div className="text-sm font-medium">{item.category}</div>
                                                    <div className="text-xs text-muted-foreground">{item.value} ({item.percentage}%)</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
