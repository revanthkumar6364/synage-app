import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Users, ShoppingCart, Folder } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: any }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
                <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                    <Link href={route('quotations.index')} className="bg-white dark:bg-gray-800 relative aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <FileText className="size-14 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Quotations</span>
                        </div>
                    </Link>
                    {auth.can.products.viewAny && (
                        <Link href={route('products.index')} className="bg-white dark:bg-gray-800 relative aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <ShoppingCart className="size-14 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Products</span>
                            </div>
                        </Link>
                    )}
                    {auth.can.accounts.viewAny && (
                        <Link href={route('accounts.index')} className="bg-white dark:bg-gray-800 relative aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <Users className="size-14 text-purple-600 dark:text-purple-400 group-hover:text-purple-500 transition-colors" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Accounts</span>
                            </div>
                        </Link>
                    )}
                    {auth.can.categories.viewAny && (
                        <Link href={route('categories.index')} className="bg-white dark:bg-gray-800 relative aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <Folder className="size-14 text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Categories</span>
                            </div>
                        </Link>
                    )}
                    {auth.can.users.viewAny && (
                        <Link href={route('users.index')} className="bg-white dark:bg-gray-800 relative aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <Users className="size-14 text-red-600 dark:text-red-400 group-hover:text-red-500 transition-colors" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Users</span>
                            </div>
                        </Link>
                    )}
                </div>
                <div className="bg-white dark:bg-gray-800 relative min-h-[100vh] flex-1 overflow-hidden rounded-xl shadow-lg md:min-h-min">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/20" />
                </div>
            </div>
        </AppLayout>
    );
}
