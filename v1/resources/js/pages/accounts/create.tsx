import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { type FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Accounts', href: '/accounts' },
    { title: 'Create Account', href: '#' },
];

interface CreateAccountProps {
    industry_types: Record<string, string>;
    statuses: Record<string, string>;
}

const CreateAccount: FC<CreateAccountProps> = ({ industry_types, statuses }) => {
    const { data, setData, post, processing, errors } = useForm({
        business_name: '',
        gst_number: '',
        industry_type: '',
        billing_address: '',
        billing_location: '',
        billing_city: '',
        billing_zip_code: '',
        shipping_address: '',
        shipping_location: '',
        shipping_city: '',
        shipping_zip_code: '',
        same_as_billing: false,
        status: 'active',
        region: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('accounts.store'));
    };

    const handleSameAsBilling = (checked: boolean | "indeterminate") => {
        const isChecked = checked === true;
        setData('same_as_billing', isChecked as any);
        if (isChecked) {
            setData('shipping_address', data.billing_address);
            setData('shipping_location', data.billing_location);
            setData('shipping_city', data.billing_city);
            setData('shipping_zip_code', data.billing_zip_code);
        } else {
            setData('shipping_address', '');
            setData('shipping_location', '');
            setData('shipping_city', '');
            setData('shipping_zip_code', '');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Account" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business_name">Business Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="business_name"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        placeholder="Enter business name"
                                    />
                                    {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gst_number">GST Number</Label>
                                    <Input
                                        id="gst_number"
                                        value={data.gst_number}
                                        onChange={(e) => setData('gst_number', e.target.value)}
                                        placeholder="Enter GST number"
                                    />
                                    {errors.gst_number && <p className="text-sm text-red-500">{errors.gst_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry_type">Industry Type</Label>
                                    <Select value={data.industry_type} onValueChange={(value) => setData('industry_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(industry_types).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry_type && <p className="text-sm text-red-500">{errors.industry_type}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="billing_address">Billing Address</Label>
                                <Textarea
                                    id="billing_address"
                                    value={data.billing_address}
                                    onChange={(e) => setData('billing_address', e.target.value)}
                                    placeholder="Enter billing address"
                                />
                                {errors.billing_address && <p className="text-sm text-red-500">{errors.billing_address}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="billing_location">Billing Location</Label>
                                    <Input
                                        id="billing_location"
                                        value={data.billing_location}
                                        onChange={(e) => setData('billing_location', e.target.value)}
                                        placeholder="Enter location"
                                    />
                                    {errors.billing_location && <p className="text-sm text-red-500">{errors.billing_location}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="billing_city">Billing City</Label>
                                    <Input
                                        id="billing_city"
                                        value={data.billing_city}
                                        onChange={(e) => setData('billing_city', e.target.value)}
                                        placeholder="Enter city"
                                    />
                                    {errors.billing_city && <p className="text-sm text-red-500">{errors.billing_city}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="billing_zip_code">Billing ZIP Code</Label>
                                    <Input
                                        id="billing_zip_code"
                                        value={data.billing_zip_code}
                                        onChange={(e) => setData('billing_zip_code', e.target.value)}
                                        placeholder="Enter ZIP code"
                                    />
                                    {errors.billing_zip_code && <p className="text-sm text-red-500">{errors.billing_zip_code}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="same_as_billing"
                                    checked={data.same_as_billing}
                                    onCheckedChange={handleSameAsBilling}
                                />
                                <Label htmlFor="same_as_billing">Shipping address same as billing</Label>
                            </div>

                            {!data.same_as_billing && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_address">Shipping Address</Label>
                                        <Textarea
                                            id="shipping_address"
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            placeholder="Enter shipping address"
                                        />
                                        {errors.shipping_address && <p className="text-sm text-red-500">{errors.shipping_address}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_location">Shipping state</Label>
                                            <Input
                                                id="shipping_location"
                                                value={data.shipping_location}
                                                onChange={(e) => setData('shipping_location', e.target.value)}
                                                placeholder="Enter location"
                                            />
                                            {errors.shipping_location && <p className="text-sm text-red-500">{errors.shipping_location}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_city">Shipping City</Label>
                                            <Input
                                                id="shipping_city"
                                                value={data.shipping_city}
                                                onChange={(e) => setData('shipping_city', e.target.value)}
                                                placeholder="Enter city"
                                            />
                                            {errors.shipping_city && <p className="text-sm text-red-500">{errors.shipping_city}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_zip_code">Shipping ZIP Code</Label>
                                            <Input
                                                id="shipping_zip_code"
                                                value={data.shipping_zip_code}
                                                onChange={(e) => setData('shipping_zip_code', e.target.value)}
                                                placeholder="Enter ZIP code"
                                            />
                                            {errors.shipping_zip_code && <p className="text-sm text-red-500">{errors.shipping_zip_code}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    value={data.region}
                                    onChange={e => setData('region', e.target.value)}
                                    placeholder="Enter region (if applicable)"
                                />
                                {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CreateAccount;
