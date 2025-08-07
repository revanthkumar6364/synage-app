import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Users, ShoppingCart, Folder, Plus, TrendingUp, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    totalQuotations: number;
    approvedQuotations: number;
    pendingQuotations: number;
    draftQuotations: number;
    totalRevenue: number;
    conversionRate: number;
}

interface Props {
    stats: DashboardStats;
    permissions: {
        canCreateQuotations: boolean;
        canViewQuotations: boolean;
        canViewAccounts: boolean;
        canCreateAccounts: boolean;
        canViewProducts: boolean;
        canCreateProducts: boolean;
        canViewUsers: boolean;
        canViewReports: boolean;
    };
}

export default function Dashboard({ stats, permissions }: Props) {
    const { auth } = usePage<{ auth: any }>().props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
            case 'draft':
                return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
            case 'rejected':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'draft':
                return <FileText className="h-4 w-4" />;
            case 'rejected':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {auth.user.name}!</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Here's what's happening with your quotations today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {permissions.canCreateQuotations && (
                            <Button size="lg" asChild>
                                <Link href={route('quotations.create')}>
                                    <Plus className="h-5 w-5 mr-2" />
                                    New Quotation
                                </Link>
                            </Button>
                        )}
                        {permissions.canViewReports && (
                            <Button variant="outline" size="lg" asChild>
                                <Link href={route('reports.charts')}>
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    View Reports
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Statistics Cards */}
                {permissions.canViewQuotations && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Quotations</CardTitle>
                                <FileText className="h-5 w-5 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalQuotations}</div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    All time quotations
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Approved</CardTitle>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.approvedQuotations}</div>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    {stats.conversionRate}% conversion rate
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Pending</CardTitle>
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pendingQuotations}</div>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                    Awaiting approval
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Revenue</CardTitle>
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">₹{stats.totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                    From approved quotations
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-1 border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                            <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {permissions.canCreateQuotations && (
                                <Button asChild className="w-full justify-start h-12 text-base">
                                    <Link href={route('quotations.create')}>
                                        <Plus className="h-5 w-5 mr-3" />
                                        Create Quotation
                                    </Link>
                                </Button>
                            )}
                            {permissions.canCreateAccounts && (
                                <Button variant="outline" asChild className="w-full justify-start h-12 text-base">
                                    <Link href={route('accounts.create')}>
                                        <Users className="h-5 w-5 mr-3" />
                                        Add Account
                                    </Link>
                                </Button>
                            )}
                            {permissions.canCreateProducts && (
                                <Button variant="outline" asChild className="w-full justify-start h-12 text-base">
                                    <Link href={route('products.create')}>
                                        <ShoppingCart className="h-5 w-5 mr-3" />
                                        Add Product
                                    </Link>
                                </Button>
                            )}
                            {permissions.canViewReports && (
                                <Button variant="outline" asChild className="w-full justify-start h-12 text-base">
                                    <Link href={route('reports.index')}>
                                        <BarChart3 className="h-5 w-5 mr-3" />
                                        View Reports
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation Cards */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-6">Navigate to Sections</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Link href={route('quotations.index')} className="group">
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Quotations</h3>
                                                <p className="text-sm text-blue-600 dark:text-blue-400">Manage all quotations</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            {permissions.canViewProducts && (
                                <Link href={route('products.index')} className="group">
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                                                    <ShoppingCart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Products</h3>
                                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Manage product catalog</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )}
                            {permissions.canViewAccounts && (
                                <Link href={route('accounts.index')} className="group">
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Accounts</h3>
                                                    <p className="text-sm text-purple-600 dark:text-purple-400">Manage client accounts</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )}
                            {permissions.canViewReports && (
                                <Link href={route('reports.index')} className="group">
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-lg">
                                                    <BarChart3 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Reports</h3>
                                                    <p className="text-sm text-amber-600 dark:text-amber-400">View analytics & reports</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
