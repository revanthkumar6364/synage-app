import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Account, AccountContact, Quotation, type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { toast, Toaster } from "sonner";
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Edit Quotation', href: '#' },
];

interface Props {
    quotation: Quotation;
    accounts: Account[];
}

export default function Edit({ quotation, accounts }: Props) {
    const [accountContacts, setAccountContacts] = useState<AccountContact[]>([]);

    const { data, setData, put, processing, errors } = useForm({
        title: quotation.title,
        account_id: quotation.account_id,
        account_contact_id: quotation.account_contact_id,
        available_size_width: quotation.available_size_width || '',
        available_size_height: quotation.available_size_height || '',
        available_size_unit: quotation.available_size_unit || 'mm',
        proposed_size_width: quotation.proposed_size_width || '',
        proposed_size_height: quotation.proposed_size_height || '',
        proposed_size_unit: quotation.proposed_size_unit || 'mm',
        available_size_width_mm: quotation.available_size_width_mm,
        available_size_height_mm: quotation.available_size_height_mm,
        available_size_width_ft: quotation.available_size_width_ft,
        available_size_height_ft: quotation.available_size_height_ft,
        available_size_sqft: quotation.available_size_sqft,
        proposed_size_width_mm: quotation.proposed_size_width_mm,
        proposed_size_height_mm: quotation.proposed_size_height_mm,
        proposed_size_width_ft: quotation.proposed_size_width_ft,
        proposed_size_height_ft: quotation.proposed_size_height_ft,
        proposed_size_sqft: quotation.proposed_size_sqft,
        description: quotation.description,
        estimate_date: quotation.estimate_date ? new Date(quotation.estimate_date).toISOString().split('T')[0] : '',
        billing_address: quotation.billing_address,
        billing_location: quotation.billing_location,
        billing_city: quotation.billing_city,
        billing_zip_code: quotation.billing_zip_code,
        shipping_address: quotation.shipping_address,
        shipping_location: quotation.shipping_location,
        shipping_city: quotation.shipping_city,
        shipping_zip_code: quotation.shipping_zip_code,
        same_as_billing: false,
    });

    useEffect(() => {
        // Calculate derived measurements when width/height/unit changes
        const calculateMeasurements = () => {
            const width = parseFloat(data.available_size_width) || 0;
            const height = parseFloat(data.available_size_height) || 0;
            const unit = data.available_size_unit;

            let width_mm, height_mm, width_ft, height_ft, sqft;

            if (unit === 'mm') {
                width_mm = width;
                height_mm = height;
                width_ft = width / 304.8;
                height_ft = height / 304.8;
            } else { // ft
                width_ft = width;
                height_ft = height;
                width_mm = width * 304.8;
                height_mm = height * 304.8;
            }

            sqft = width_ft * height_ft;

            setData(prev => ({
                ...prev,
                available_size_width_mm: width_mm.toFixed(2),
                available_size_height_mm: height_mm.toFixed(2),
                available_size_width_ft: width_ft.toFixed(2),
                available_size_height_ft: height_ft.toFixed(2),
                available_size_sqft: sqft.toFixed(2)
            }));
        };

        calculateMeasurements();
    }, [data.available_size_width, data.available_size_height, data.available_size_unit]);

    useEffect(() => {
        // Similar calculation for proposed size
        const calculateProposedMeasurements = () => {
            const width = parseFloat(data.proposed_size_width) || 0;
            const height = parseFloat(data.proposed_size_height) || 0;
            const unit = data.proposed_size_unit;

            let width_mm, height_mm, width_ft, height_ft, sqft;

            if (unit === 'mm') {
                width_mm = width;
                height_mm = height;
                width_ft = width / 304.8;
                height_ft = height / 304.8;
            } else { // ft
                width_ft = width;
                height_ft = height;
                width_mm = width * 304.8;
                height_mm = height * 304.8;
            }

            sqft = width_ft * height_ft;

            setData(prev => ({
                ...prev,
                proposed_size_width_mm: width_mm.toFixed(2),
                proposed_size_height_mm: height_mm.toFixed(2),
                proposed_size_width_ft: width_ft.toFixed(2),
                proposed_size_height_ft: height_ft.toFixed(2),
                proposed_size_sqft: sqft.toFixed(2)
            }));
        };

        calculateProposedMeasurements();
    }, [data.proposed_size_width, data.proposed_size_height, data.proposed_size_unit]);

    useEffect(() => {
        if (data.account_id) {
            const selectedAccount = accounts.find(account => account.id === data.account_id);
            if (selectedAccount) {
                setAccountContacts(selectedAccount.contacts || []);
            }
        }
    }, [data.account_id, accounts]);

    const handleSameAsBillingChange = (checked: boolean) => {
        setData((prev: typeof data) => ({
            ...prev,
            same_as_billing: checked as false,
            shipping_address: checked ? prev.billing_address : prev.shipping_address,
            shipping_location: checked ? prev.billing_location : prev.shipping_location,
            shipping_city: checked ? prev.billing_city : prev.shipping_city,
            shipping_zip_code: checked ? prev.billing_zip_code : prev.shipping_zip_code
        }));
    };

    const handleAccountChange = (value: string) => {
        const selectedAccount = accounts.find(account => account.id.toString() === value);
        setData(prev => ({
            ...prev,
            account_id: Number(value),
            account_contact_id: undefined,
            billing_address: selectedAccount?.billing_address || '',
            billing_location: selectedAccount?.billing_location || '',
            billing_city: selectedAccount?.billing_city || '',
            billing_zip_code: selectedAccount?.billing_zip_code || '',
            shipping_address: data.same_as_billing ? (selectedAccount?.shipping_address || '') : prev.shipping_address,
            shipping_location: data.same_as_billing ? (selectedAccount?.shipping_location || '') : prev.shipping_location,
            shipping_city: data.same_as_billing ? (selectedAccount?.shipping_city || '') : prev.shipping_city,
            shipping_zip_code: data.same_as_billing ? (selectedAccount?.shipping_zip_code || '') : prev.shipping_zip_code
        }));

        if (selectedAccount) {
            setAccountContacts(selectedAccount.contacts || []);
        } else {
            setAccountContacts([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('quotations.update', quotation.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Quotation details updated successfully");
            },
            onError: () => {
                toast.error("Failed to update quotation details");
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Quotation Details" />
            <Toaster />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex gap-2">
                    <Button
                        variant='default'
                        onClick={() => router.visit(route('quotations.edit', quotation.id))}
                    >
                        Details
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => router.visit(route('quotations.products', quotation.id))}
                    >
                        Products
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => router.visit(route('quotations.preview', quotation.id))}
                    >
                        Preview
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight">Edit Quotation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                                </div>

                                <div>
                                    <Label>Account</Label>
                                    <Select
                                        value={data.account_id.toString()}
                                        onValueChange={handleAccountChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {account.business_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_id && <span className="text-red-500 text-sm">{errors.account_id}</span>}
                                </div>

                                <div>
                                    <Label>Contact Person</Label>
                                    <Select
                                        value={data.account_contact_id?.toString()}
                                        onValueChange={(value) => setData('account_contact_id', Number(value))}
                                        disabled={!data.account_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountContacts.map((contact) => (
                                                <SelectItem key={contact.id} value={contact.id.toString()}>
                                                    {contact.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_contact_id && <span className="text-red-500 text-sm">{errors.account_contact_id}</span>}
                                </div>

                                <div>
                                    <Label>Estimate Date</Label>
                                    <Input
                                        type="date"
                                        value={data.estimate_date}
                                        onChange={e => setData('estimate_date', e.target.value)}
                                        className={errors.estimate_date ? 'border-red-500' : ''}
                                    />
                                    {errors.estimate_date && <span className="text-red-500 text-sm">{errors.estimate_date}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium">Billing Details</h3>
                                    <div>
                                        <Label>Address</Label>
                                        <Textarea
                                            value={data.billing_address}
                                            onChange={e => setData('billing_address', e.target.value)}
                                            className={errors.billing_address ? 'border-red-500' : ''}
                                        />
                                        {errors.billing_address && <span className="text-red-500 text-sm">{errors.billing_address}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Location</Label>
                                            <Input
                                                value={data.billing_location}
                                                onChange={e => setData('billing_location', e.target.value)}
                                                className={errors.billing_location ? 'border-red-500' : ''}
                                            />
                                            {errors.billing_location && <span className="text-red-500 text-sm">{errors.billing_location}</span>}
                                        </div>

                                        <div>
                                            <Label>City</Label>
                                            <Input
                                                value={data.billing_city}
                                                onChange={e => setData('billing_city', e.target.value)}
                                                className={errors.billing_city ? 'border-red-500' : ''}
                                            />
                                            {errors.billing_city && <span className="text-red-500 text-sm">{errors.billing_city}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Zip Code</Label>
                                        <Input
                                            value={data.billing_zip_code}
                                            onChange={e => setData('billing_zip_code', e.target.value)}
                                            className={errors.billing_zip_code ? 'border-red-500' : ''}
                                        />
                                        {errors.billing_zip_code && <span className="text-red-500 text-sm">{errors.billing_zip_code}</span>}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Shipping Details</h3>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="same_as_billing"
                                                checked={data.same_as_billing}
                                                onCheckedChange={handleSameAsBillingChange}
                                            />
                                            <Label htmlFor="same_as_billing" className="text-sm">Same as billing</Label>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Address</Label>
                                        <Textarea
                                            value={data.shipping_address}
                                            onChange={e => setData('shipping_address', e.target.value)}
                                            className={errors.shipping_address ? 'border-red-500' : ''}
                                        />
                                        {errors.shipping_address && <span className="text-red-500 text-sm">{errors.shipping_address}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Location</Label>
                                            <Input
                                                value={data.shipping_location}
                                                onChange={e => setData('shipping_location', e.target.value)}
                                                className={errors.shipping_location ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping_location && <span className="text-red-500 text-sm">{errors.shipping_location}</span>}
                                        </div>

                                        <div>
                                            <Label>City</Label>
                                            <Input
                                                value={data.shipping_city}
                                                onChange={e => setData('shipping_city', e.target.value)}
                                                className={errors.shipping_city ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping_city && <span className="text-red-500 text-sm">{errors.shipping_city}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Zip Code</Label>
                                        <Input
                                            value={data.shipping_zip_code}
                                            onChange={e => setData('shipping_zip_code', e.target.value)}
                                            className={errors.shipping_zip_code ? 'border-red-500' : ''}
                                        />
                                        {errors.shipping_zip_code && <span className="text-red-500 text-sm">{errors.shipping_zip_code}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label>Available Size</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Input
                                                type="number"
                                                placeholder="Width"
                                                value={data.available_size_width}
                                                onChange={e => setData('available_size_width', e.target.value)}
                                                className={errors.available_size_width ? 'border-red-500' : ''}
                                            />
                                            {errors.available_size_width && <span className="text-red-500 text-sm">{errors.available_size_width}</span>}
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                placeholder="Height"
                                                value={data.available_size_height}
                                                onChange={e => setData('available_size_height', e.target.value)}
                                                className={errors.available_size_height ? 'border-red-500' : ''}
                                            />
                                            {errors.available_size_height && <span className="text-red-500 text-sm">{errors.available_size_height}</span>}
                                        </div>
                                        <div>
                                            <Select
                                                value={data.available_size_unit}
                                                onValueChange={(value) => setData('available_size_unit', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mm">mm</SelectItem>
                                                    <SelectItem value="ft">ft</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Calculated: {data.available_size_width_mm}mm x {data.available_size_height_mm}mm |
                                        {data.available_size_width_ft}ft x {data.available_size_height_ft}ft |
                                        Area: {data.available_size_sqft} sq.ft
                                    </div>
                                </div>

                                <div>
                                    <Label>Proposed Size</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Input
                                                type="number"
                                                placeholder="Width"
                                                value={data.proposed_size_width}
                                                onChange={e => setData('proposed_size_width', e.target.value)}
                                                className={errors.proposed_size_width ? 'border-red-500' : ''}
                                            />
                                            {errors.proposed_size_width && <span className="text-red-500 text-sm">{errors.proposed_size_width}</span>}
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                placeholder="Height"
                                                value={data.proposed_size_height}
                                                onChange={e => setData('proposed_size_height', e.target.value)}
                                                className={errors.proposed_size_height ? 'border-red-500' : ''}
                                            />
                                            {errors.proposed_size_height && <span className="text-red-500 text-sm">{errors.proposed_size_height}</span>}
                                        </div>
                                        <div>
                                            <Select
                                                value={data.proposed_size_unit}
                                                onValueChange={(value) => setData('proposed_size_unit', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mm">mm</SelectItem>
                                                    <SelectItem value="ft">ft</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Calculated: {data.proposed_size_width_mm}mm x {data.proposed_size_height_mm}mm |
                                        {data.proposed_size_width_ft}ft x {data.proposed_size_height_ft}ft |
                                        Area: {data.proposed_size_sqft} sq.ft
                                    </div>
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
