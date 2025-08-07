import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, FileText, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports and Analytics', href: '#' },
];

interface Props {
    summaryStats: {
        totalEstimates: number;
        convertedEstimates: number;
        conversionRate: number;
        totalRevenue: number;
    };
}

export default function ReportsIndex({ summaryStats }: Props) {
    const { auth } = usePage<{ auth: any }>().props;

    const reportCategories = [
        {
            title: 'Client-Based Reports',
            description: 'View detailed reports by client, estimate status, and conversion rates',
            href: '/reports/client-based',
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Sales Reports',
            description: 'Analyze sales performance by category, user, project, and industry',
            href: '/reports/sales',
            icon: TrendingUp,
            color: 'bg-green-500',
        },
        {
            title: 'Visual Charts',
            description: 'Interactive charts for estimates, proforma invoices, and conversion ratios',
            href: '/reports/charts',
            icon: BarChart3,
            color: 'bg-purple-500',
        },
        {
            title: 'Estimate Analytics',
            description: 'Detailed analytics on estimate performance and trends',
            href: '/reports/estimates',
            icon: FileText,
            color: 'bg-orange-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports and Analytics" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports and Analytics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive insights into your business performance
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {reportCategories.map((category) => (
                        <Link key={category.href} href={category.href}>
                            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold">
                                        {category.title}
                                    </CardTitle>
                                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                                        <category.icon className="h-6 w-6" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.totalEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                All estimates in system
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Converted</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.convertedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Successful conversions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryStats.conversionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Overall success rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{summaryStats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                From converted estimates
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
