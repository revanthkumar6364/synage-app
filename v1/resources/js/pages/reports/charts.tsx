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
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Estimates Trend
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Monthly estimates breakdown by status</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 space-y-2">
                                {/* Debug Info */}
                                <div className="text-xs text-gray-500 mb-2">
                                    Debug: Max Value = {maxValue}, Data Points = {chartData.estimatesData.length}
                                </div>
                                <div className="space-y-2">
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
                            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span>Total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span>Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                    <span>Pending</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proforma Line Chart */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <LineChart className="h-5 w-5 text-green-600" />
                                Revenue Trend
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Monthly revenue from approved estimates</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 relative">
                                <svg className="w-full h-full" viewBox="0 0 400 300">
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={chartData.proformaData.map((data, index) => {
                                            const x = (index / (chartData.proformaData.length - 1)) * 350 + 25;
                                            const y = 275 - ((data.value / maxProformaValue) * 250);
                                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                        }).join(' ')}
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                    <path
                                        d={chartData.proformaData.map((data, index) => {
                                            const x = (index / (chartData.proformaData.length - 1)) * 350 + 25;
                                            const y = 275 - ((data.value / maxProformaValue) * 250);
                                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                        }).join(' ') + ` L ${(chartData.proformaData.length - 1) / (chartData.proformaData.length - 1) * 350 + 25} 275 L 25 275 Z`}
                                        fill="url(#lineGradient)"
                                    />
                                    {chartData.proformaData.map((data, index) => {
                                        const x = (index / (chartData.proformaData.length - 1)) * 350 + 25;
                                        const y = 275 - ((data.value / maxProformaValue) * 250);
                                        return (
                                            <circle
                                                key={index}
                                                cx={x}
                                                cy={y}
                                                r="4"
                                                fill="#10b981"
                                                className="hover:r-6 transition-all"
                                            />
                                        );
                                    })}
                                </svg>
                                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-6">
                                    {chartData.proformaData.map((data, index) => (
                                        <span key={index} className="px-2 truncate max-w-[60px] text-center">
                                            {data.month}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversion Pie Chart */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-purple-600" />
                                Status Distribution
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Breakdown of estimates by status</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {chartData.conversionData.map((data, index) => {
                                            const total = chartData.conversionData.reduce((sum, item) => sum + item.value, 0);
                                            const percentage = total > 0 ? (data.value / total) * 100 : 0;
                                            const radius = 40;
                                            const circumference = 2 * Math.PI * radius;
                                            const strokeDasharray = circumference;
                                            const strokeDashoffset = circumference - (percentage / 100) * circumference;
                                            const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];
                                            const startAngle = chartData.conversionData.slice(0, index).reduce((sum, item) => {
                                                const itemTotal = chartData.conversionData.reduce((s, i) => s + i.value, 0);
                                                const itemPercentage = itemTotal > 0 ? (item.value / itemTotal) * 100 : 0;
                                                return sum + (itemPercentage / 100) * 360;
                                            }, 0);
                                            const endAngle = startAngle + (percentage / 100) * 360;
                                            const x1 = 50 + radius * Math.cos(startAngle * Math.PI / 180);
                                            const y1 = 50 + radius * Math.sin(startAngle * Math.PI / 180);
                                            const x2 = 50 + radius * Math.cos(endAngle * Math.PI / 180);
                                            const y2 = 50 + radius * Math.sin(endAngle * Math.PI / 180);
                                            const largeArcFlag = percentage > 50 ? 1 : 0;

                                            return (
                                                <g key={index}>
                                                    <path
                                                        d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                                        fill={colors[index]}
                                                        className="hover:opacity-80 transition-opacity"
                                                    />
                                                </g>
                                            );
                                        })}
                                        <circle cx="50" cy="50" r="15" fill="white" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{chartData.conversionData.reduce((sum, data) => sum + data.value, 0)}</div>
                                            <div className="text-xs text-muted-foreground">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {chartData.conversionData.map((data, index) => {
                                    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];
                                    return (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[index] }}></div>
                                            <span className="flex-1">{data.category}</span>
                                            <span className="font-medium">{data.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Area Chart */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-emerald-600" />
                                Revenue Overview
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Cumulative revenue trends over time</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 relative">
                                <svg className="w-full h-full" viewBox="0 0 400 300">
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#059669" stopOpacity="0.4"/>
                                            <stop offset="100%" stopColor="#059669" stopOpacity="0.1"/>
                                        </linearGradient>
                                    </defs>
                                    {/* Calculate cumulative data */}
                                    {(() => {
                                        let cumulative = 0;
                                        const cumulativeData = chartData.proformaData.map(data => {
                                            cumulative += data.value;
                                            return { ...data, cumulative };
                                        });
                                        const maxCumulative = Math.max(...cumulativeData.map(d => d.cumulative));

                                        return (
                                            <>
                                                <path
                                                    d={cumulativeData.map((data, index) => {
                                                        const x = (index / (cumulativeData.length - 1)) * 350 + 25;
                                                        const y = 275 - ((data.cumulative / maxCumulative) * 250);
                                                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                                    }).join(' ') + ` L ${(cumulativeData.length - 1) / (cumulativeData.length - 1) * 350 + 25} 275 L 25 275 Z`}
                                                    fill="url(#areaGradient)"
                                                />
                                                <path
                                                    d={cumulativeData.map((data, index) => {
                                                        const x = (index / (cumulativeData.length - 1)) * 350 + 25;
                                                        const y = 275 - ((data.cumulative / maxCumulative) * 250);
                                                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                                                    }).join(' ')}
                                                    stroke="#059669"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                                {cumulativeData.map((data, index) => {
                                                    const x = (index / (cumulativeData.length - 1)) * 350 + 25;
                                                    const y = 275 - ((data.cumulative / maxCumulative) * 250);
                                                    return (
                                                        <circle
                                                            key={index}
                                                            cx={x}
                                                            cy={y}
                                                            r="3"
                                                            fill="#059669"
                                                            className="hover:r-5 transition-all"
                                                        />
                                                    );
                                                })}
                                            </>
                                        );
                                    })()}
                                </svg>
                                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-6">
                                    {chartData.proformaData.map((data, index) => (
                                        <span key={index} className="px-2 truncate max-w-[60px] text-center">
                                            {data.month}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                <span className="font-medium">Total Cumulative Revenue: </span>
                                ₹{chartData.proformaData.reduce((sum, data) => sum + data.value, 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
