import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { type FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

interface EditUserProps {
    user: any;
    roles: Record<string, string>;
    statuses: Record<string, string>;
    country_codes: Record<string, string>;
}

const EditUser: FC<EditUserProps> = ({ user, roles, statuses, country_codes }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: user.data.name,
        email: user.data.email,
        role: user.data.role,
        status: user.data.status,
        country_code: user.data.country_code,
        mobile: user.data.mobile,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.data.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex h-full w-1/2 flex-1 flex-col gap-4 rounded-xl p-4 text-left">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Edit User</CardTitle>
                            <Link href={route('users.index')} className="text-sm text-gray-500 hover:text-gray-700">
                                <Button variant="outline">
                                    <ArrowLeftIcon className="h-4 w-4" /> Back to Users
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="country_code" className="block text-sm font-medium text-gray-700">
                                            Country Code
                                        </label>
                                        <select
                                            name="country_code"
                                            id="country_code"
                                            value={data.country_code}
                                            onChange={(e) => setData('country_code', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="+1">+1 (US/Canada)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+91">+91 (India)</option>
                                            {/* Add more country codes as needed */}
                                        </select>
                                        {errors.country_code && <p className="mt-2 text-sm text-red-600">{errors.country_code}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            id="mobile"
                                            value={data.mobile}
                                            onChange={(e) => setData('mobile', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="1234567890"
                                        />
                                        {errors.mobile && <p className="mt-2 text-sm text-red-600">{errors.mobile}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status}</p>}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                Update User
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default EditUser;
