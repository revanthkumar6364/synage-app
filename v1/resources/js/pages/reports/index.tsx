import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, FileText, TrendingUp, Users, PieChart, Activity, Target, DollarSign } from 'lucide-react';

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
            title: 'Visual Charts',
            description: 'Interactive charts for estimates, proforma invoices, and conversion ratios with real-time filtering',
            href: '/reports/charts',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-purple-100',
            textColor: 'text-purple-700',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Client-Based Reports',
            description: 'Detailed reports by client, estimate status, and conversion rates with comprehensive analytics',
            href: '/reports/client-based',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-100',
            textColor: 'text-blue-700',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Sales Reports',
            description: 'Analyze sales performance by category, user, project, and industry with detailed breakdowns',
            href: '/reports/sales',
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            bgColor: 'from-green-50 to-green-100',
            textColor: 'text-green-700',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Estimate Analytics',
            description: 'Detailed analytics on estimate performance, trends, and comprehensive business insights',
            href: '/reports/estimates',
            icon: FileText,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'from-orange-50 to-orange-100',
            textColor: 'text-orange-700',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports and Analytics" />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Reports and Analytics</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Comprehensive insights into your business performance and growth metrics
                        </p>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Estimates</CardTitle>
                            <FileText className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{summaryStats.totalEstimates.toLocaleString()}</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                All estimates in system
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Converted</CardTitle>
                            <Target className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{summaryStats.convertedEstimates.toLocaleString()}</div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Successful conversions
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Conversion Rate</CardTitle>
                            <PieChart className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{summaryStats.conversionRate}%</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                Overall success rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Revenue</CardTitle>
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">₹{summaryStats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                From converted estimates
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Categories */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Available Reports</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {reportCategories.map((category) => (
                            <Link key={category.href} href={category.href} className="group">
                                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl ${category.iconBg} dark:bg-gray-700`}>
                                                <category.icon className={`h-8 w-8 ${category.iconColor} dark:text-gray-300`} />
                                            </div>
                                            <div>
                                                <CardTitle className={`text-xl font-semibold ${category.textColor} dark:text-gray-100`}>
                                                    {category.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {category.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                            <span>View Report</span>
                                            <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/reports/charts" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Charts
                        </Link>
                        <Link href="/reports/client-based" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            <Users className="h-4 w-4 mr-2" />
                            Client Reports
                        </Link>
                        <Link href="/reports/sales" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Sales Reports
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
