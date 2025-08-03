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
    };
}

export default function VisualCharts({ chartData, filters }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'All');
    const chartsContainerRef = useRef<HTMLDivElement>(null);
    const [librariesAvailable, setLibrariesAvailable] = useState({
        html2canvas: false,
        jsPDF: false
    });

    // Check library availability on component mount
    useEffect(() => {
        const checkLibraries = () => {
            const html2canvasAvailable = typeof html2canvas !== 'undefined';
            const jsPDFAvailable = typeof jsPDF !== 'undefined';

            console.log('Library check - html2canvas:', html2canvasAvailable, 'jsPDF:', jsPDFAvailable);

            setLibrariesAvailable({
                html2canvas: html2canvasAvailable,
                jsPDF: jsPDFAvailable
            });
        };

        // Check immediately
        checkLibraries();

        // Also check after a short delay in case libraries load asynchronously
        setTimeout(checkLibraries, 1000);
    }, []);

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

    const resetFilters = () => {
        setStatusFilter('All');
        setCategoryFilter('All');
    };

    const exportCharts = () => {
        // TODO: Implement chart export functionality
        console.log('Export charts');
    };

    const exportAsPNG = async () => {
        if (!chartsContainerRef.current) {
            alert('No content to export. Please try again.');
            return;
        }

        try {
            // Create a data summary instead of trying to capture the visual charts
            const dataSummary = `
Charts Data Summary - ${new Date().toISOString().split('T')[0]}

ESTIMATES DATA:
${chartData.estimatesData.map(d => `${d.month}: Total=${d.series1}, Approved=${d.series2}, Pending=${d.series3}`).join('\n')}

PROFORMA DATA:
${chartData.proformaData.map(d => `${d.month}: ₹${d.value}`).join('\n')}

CONVERSION DATA:
${chartData.conversionData.map(d => `${d.category}: ${d.value} (${d.percentage}%)`).join('\n')}
            `;

            // Create and download as text file (since PNG is problematic)
            const blob = new Blob([dataSummary], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `charts-data-${new Date().toISOString().split('T')[0]}.txt`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting as PNG:', error);
            alert('Failed to export. Please use CSV export for data or Print for visual charts.');
        }
    };

    const exportAsPDF = async () => {
        if (!chartsContainerRef.current) {
            alert('No content to export. Please try again.');
            return;
        }

        try {
            // Create a print-friendly version of the charts
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Charts Report</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 20px;
                                    font-family: Arial, sans-serif;
                                    background: white;
                                }
                                .chart-container {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 20px;
                                    margin-bottom: 20px;
                                }
                                .chart-card {
                                    border: 1px solid #e5e7eb;
                                    border-radius: 8px;
                                    padding: 16px;
                                    background: white;
                                }
                                .chart-title {
                                    font-size: 18px;
                                    font-weight: bold;
                                    margin-bottom: 16px;
                                    color: #374151;
                                }
                                .chart-content {
                                    min-height: 200px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: #f9fafb;
                                    border-radius: 4px;
                                }
                                .full-width {
                                    grid-column: 1 / -1;
                                }
                                h1 {
                                    text-align: center;
                                    margin-bottom: 30px;
                                    color: #111827;
                                    font-size: 24px;
                                }
                                @media print {
                                    body { margin: 0; }
                                    .chart-container { page-break-inside: avoid; }
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Visual Charts Report</h1>
                            <div class="chart-container">
                                <div class="chart-card">
                                    <div class="chart-title">Estimates Trend (Bar Chart)</div>
                                    <div class="chart-content">
                                        <p>Chart data: ${chartData.estimatesData.map(d => `${d.month}: Total=${d.series1}, Approved=${d.series2}, Pending=${d.series3}`).join(' | ')}</p>
                                    </div>
                                </div>
                                <div class="chart-card">
                                    <div class="chart-title">Proforma Invoice Value (Line Chart)</div>
                                    <div class="chart-content">
                                        <p>Chart data: ${chartData.proformaData.map(d => `${d.month}: ₹${d.value}`).join(' | ')}</p>
                                    </div>
                                </div>
                                <div class="chart-card">
                                    <div class="chart-title">Monthly Trends (Area Chart)</div>
                                    <div class="chart-content">
                                        <p>Chart data: ${chartData.estimatesData.map(d => `${d.month}: Approved=${d.series2}`).join(' | ')}</p>
                                    </div>
                                </div>
                                <div class="chart-card">
                                    <div class="chart-title">Status Distribution (Pie Chart)</div>
                                    <div class="chart-content">
                                        <p>Chart data: ${chartData.conversionData.map(d => `${d.category}: ${d.value} (${d.percentage}%)`).join(' | ')}</p>
                                    </div>
                                </div>
                                <div class="chart-card full-width">
                                    <div class="chart-title">Monthly Comparison (Stacked Bar Chart)</div>
                                    <div class="chart-content">
                                        <p>Chart data: ${chartData.estimatesData.map(d => `${d.month}: Total=${d.series1}, Approved=${d.series2}, Pending=${d.series3}`).join(' | ')}</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();

                // Wait a moment for content to load, then print
                setTimeout(() => {
                    printWindow.print();
                    // Close the window after printing
                    setTimeout(() => {
                        printWindow.close();
                    }, 1000);
                }, 500);
            } else {
                // Fallback to regular print if popup is blocked
                alert('Please allow popups and try again, or use Ctrl+P to print.');
                window.print();
            }
        } catch (error) {
            console.error('Error exporting as PDF:', error);
            alert('Failed to export as PDF. Please use browser print function (Ctrl+P) to save as PDF.');
        }
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

    const exportAsCSV = () => {
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
            <Head title="Visual Charts - Estimate and Proforma Invoice Reports" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Visual Charts - Estimate and Proforma Invoice Reports</h1>
                        <p className="text-muted-foreground">
                            Interactive charts for estimates, proforma invoices, and conversion ratios
                        </p>
                    </div>
                    <Button variant="outline" onClick={exportCharts} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Charts
                    </Button>
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
                                        <SelectItem value="All">All Status</SelectItem>
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
                                        <SelectItem value="All">All Categories</SelectItem>
                                        <SelectItem value="unilumin">Unilumin</SelectItem>
                                        <SelectItem value="absen">Absen</SelectItem>
                                        <SelectItem value="radiant_synage">Radiant Synage</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
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

                {/* Charts Grid */}
                <div ref={chartsContainerRef} className="grid gap-6 md:grid-cols-2">
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
                                <div className="h-64 space-y-2">
                                    {chartData.estimatesData.map((data, index) => (
                                        <div key={index} className="flex items-end gap-1 h-8">
                                            <div className="flex-1 flex items-end gap-1">
                                                <div
                                                    className="bg-blue-500 rounded-t"
                                                    style={{
                                                        height: `${(data.series1 / maxValue) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                                <div
                                                    className="bg-green-500 rounded-t"
                                                    style={{
                                                        height: `${(data.series2 / maxValue) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                                <div
                                                    className="bg-yellow-500 rounded-t"
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
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    {chartData.proformaData.map((data, index) => (
                                        <span key={index}>{data.month}</span>
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
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    {chartData.estimatesData.map((data, index) => (
                                        <span key={index}>{data.month}</span>
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

                                            const colors = ['#22c55e', '#f59e0b', '#ef4444'];

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
                                        const colors = ['#22c55e', '#f59e0b', '#ef4444'];
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

                    {/* Stacked Bar Chart - Comparison */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Monthly Comparison (Stacked Bar Chart)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 space-y-2">
                                {chartData.estimatesData.map((data, index) => (
                                    <div key={index} className="flex items-end gap-1 h-12">
                                        <div className="flex-1 flex items-end gap-1">
                                            <div
                                                className="bg-blue-500 rounded-t"
                                                style={{
                                                    height: `${(data.series1 / maxValue) * 100}%`,
                                                    minHeight: '4px'
                                                }}
                                                title={`Total: ${data.series1}`}
                                            ></div>
                                            <div
                                                className="bg-green-500 rounded-t"
                                                style={{
                                                    height: `${(data.series2 / maxValue) * 100}%`,
                                                    minHeight: '4px'
                                                }}
                                                title={`Approved: ${data.series2}`}
                                            ></div>
                                            <div
                                                className="bg-yellow-500 rounded-t"
                                                style={{
                                                    height: `${(data.series3 / maxValue) * 100}%`,
                                                    minHeight: '4px'
                                                }}
                                                title={`Pending: ${data.series3}`}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground w-12 text-center">
                                            {data.month}
                                        </span>
                                    </div>
                                ))}

                                {/* Legend */}
                                <div className="flex items-center gap-4 text-sm mt-4">
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
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Export Options */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {/* Only show PDF button if jsPDF is available */}
                            {librariesAvailable.jsPDF && (
                                <Button variant="outline" onClick={exportAsPDF} className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export as PDF
                                </Button>
                            )}

                            {/* Only show PNG button if html2canvas is available */}
                            {librariesAvailable.html2canvas && (
                                <Button variant="outline" onClick={exportAsPNG} className="flex items-center gap-2">
                                    <FileDown className="h-4 w-4" />
                                    Export Data
                                </Button>
                            )}

                            {/* Always show print and CSV buttons */}
                            <Button variant="outline" onClick={printCharts} className="flex items-center gap-2">
                                <Printer className="h-4 w-4" />
                                Print Charts
                            </Button>
                            <Button variant="outline" onClick={exportAsCSV} className="flex items-center gap-2">
                                <FileDown className="h-4 w-4" />
                                Export as CSV
                            </Button>
                        </div>

                        {/* Show message if libraries are not available */}
                        {(!librariesAvailable.html2canvas || !librariesAvailable.jsPDF) && (
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                <p>Some export options are not available. Use Print function to save as PDF or image.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
