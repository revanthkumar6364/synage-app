import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, Download, Printer, FileDown } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    };
}

export default function VisualCharts({ chartData, filters }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'All');

    // Debounced filter updates
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/reports/charts', {
                status: statusFilter === 'All' ? undefined : statusFilter,
                category: categoryFilter === 'All' ? undefined : categoryFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, categoryFilter]);

    const maxValue = Math.max(...chartData.estimatesData.map(d => Math.max(d.series1, d.series2, d.series3)));
    const maxProformaValue = Math.max(...chartData.proformaData.map(d => d.value));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visual Charts - Estimate and Proforma Invoice Reports" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Visual Charts - Estimate and Proforma Invoice Reports</h1>
                        <p className="text-muted-foreground">
                            Interactive charts for estimates, proforma invoices, and conversion ratios
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="unilumin">Unilumin</SelectItem>
                                        <SelectItem value="absen">Absen</SelectItem>
                                        <SelectItem value="radiant_synage">Radiant Synage</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setStatusFilter('All');
                                        setCategoryFilter('All');
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Estimates Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estimates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Total</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                        <span>Approved</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                                        <span>Pending</span>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="h-64 space-y-2">
                                    {chartData.estimatesData.map((data, index) => (
                                        <div key={index} className="flex items-end gap-1 h-8">
                                            <div className="flex-1 flex items-end gap-1">
                                                <div
                                                    className="bg-green-500 rounded-t"
                                                    style={{
                                                        height: `${(data.series1 / maxValue) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                                <div
                                                    className="bg-green-600 rounded-t"
                                                    style={{
                                                        height: `${(data.series2 / maxValue) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                                <div
                                                    className="bg-green-700 rounded-t"
                                                    style={{
                                                        height: `${(data.series3 / maxValue) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8 text-center">
                                                {data.month}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proforma Invoice Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Proforma Invoice
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 space-y-2">
                                {chartData.proformaData.map((data, index) => (
                                    <div key={index} className="flex items-end gap-1 h-8">
                                        <div className="flex-1">
                                            <div
                                                className="bg-green-500 rounded-t"
                                                style={{
                                                    height: `${(data.value / maxProformaValue) * 100}%`,
                                                    minHeight: '4px'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground w-8 text-center">
                                            {data.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estimate Conversion Ratios Chart */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estimate Conversion Ratios
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

                                            return (
                                                <circle
                                                    key={index}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="20"
                                                    className={`text-${
                                                        index === 0 ? 'green-500' :
                                                        index === 1 ? 'green-600' : 'green-700'
                                                    }`}
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
                                    {chartData.conversionData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${
                                                index === 0 ? 'bg-green-500' :
                                                index === 1 ? 'bg-green-600' : 'bg-green-700'
                                            }`}></div>
                                            <div>
                                                <div className="text-sm font-medium">{item.category}</div>
                                                <div className="text-xs text-muted-foreground">{item.value} ({item.percentage}%)</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Export Options */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export Charts PDF
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <FileDown className="h-4 w-4" />
                                Export as PNG
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Printer className="h-4 w-4" />
                                Print Charts
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
