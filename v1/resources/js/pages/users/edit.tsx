import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { type FC, useState, useEffect } from 'react';

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
    accounts: any[];
    contacts: any[];
}

const EditUser: FC<EditUserProps> = ({ user, roles, statuses, country_codes, accounts, contacts }) => {
    const [accountContacts, setAccountContacts] = useState<any[]>([]);

    const { data, setData, put, processing, errors } = useForm({
        name: user.data.name,
        email: user.data.email,
        role: user.data.role,
        status: user.data.status,
        country_code: user.data.country_code,
        mobile: user.data.mobile,
        account_id: user.data.account_id,
        account_contact_id: user.data.account_contact_id
    });

    useEffect(() => {
        if (data.account_id) {
            const selectedAccount = accounts.find(account => account.id === data.account_id);
            if (selectedAccount) {
                setAccountContacts(selectedAccount.contacts || []);
            }
        }
    }, [data.account_id, accounts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.data.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Edit User</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter user name"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter user email"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="account">Account</Label>
                                    <Select value={data.account_id?.toString()} onValueChange={(value) => setData('account_id', parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {account.business_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_id && <p className="text-sm text-red-500">{errors.account_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact">Contact</Label>
                                    <Select
                                        value={data.account_contact_id?.toString()}
                                        onValueChange={(value) => setData('account_contact_id', parseInt(value))}
                                        disabled={!data.account_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountContacts?.map((contact) => (
                                                <SelectItem key={contact.id} value={contact.id.toString()}>
                                                    {contact.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_contact_id && <p className="text-sm text-red-500">{errors.account_contact_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country_code">Country Code <span className="text-red-500">*</span></Label>
                                    <Select value={data.country_code} onValueChange={(value) => setData('country_code', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(country_codes || {}).map(([code, country]) => (
                                                <SelectItem key={code} value={code}>
                                                    {code} - {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_code && <p className="text-sm text-red-500">{errors.country_code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="mobile"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        placeholder="Enter mobile number"
                                    />
                                    {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(roles || {}).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuses || {}).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update User
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default EditUser;
