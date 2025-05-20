import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Account, BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Create Quotation', href: '#' },
];

interface Props {
    accounts: Account[];
}

interface FormData {
    reference: string;
    quotation_number: string;
    title: string;
    account_id: string;
    account_contact_id: string;
    available_size_width: string;
    available_size_height: string;
    available_size_unit: string;
    proposed_size_width: string;
    proposed_size_height: string;
    proposed_size_unit: string;
    available_size_width_mm: string;
    available_size_height_mm: string;
    proposed_size_width_mm: string;
    proposed_size_height_mm: string;
    available_size_width_ft: string;
    available_size_height_ft: string;
    proposed_size_width_ft: string;
    proposed_size_height_ft: string;
    available_size_sqft: string;
    proposed_size_sqft: string;
    description: string;
    estimate_date: string;
    billing_address: string;
    billing_location: string;
    billing_city: string;
    billing_zip_code: string;
    shipping_address: string;
    shipping_location: string;
    shipping_city: string;
    shipping_zip_code: string;
    same_as_billing: boolean;
    status: 'draft';
}

export default function Create({ accounts = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        reference: generateReference(),
        quotation_number: "",
        title: "",
        account_id: "",
        account_contact_id: "",
        available_size_width: "",
        available_size_height: "",
        available_size_unit: "mm",
        proposed_size_width: "",
        proposed_size_height: "",
        proposed_size_unit: "mm",
        available_size_width_mm: "",
        available_size_height_mm: "",
        proposed_size_width_mm: "",
        proposed_size_height_mm: "",
        available_size_width_ft: "",
        available_size_height_ft: "",
        proposed_size_width_ft: "",
        proposed_size_height_ft: "",
        available_size_sqft: "",
        proposed_size_sqft: "",
        description: "",
        estimate_date: "",
        billing_address: "",
        billing_location: "",
        billing_city: "",
        billing_zip_code: "",
        shipping_address: "",
        shipping_location: "",
        shipping_city: "",
        shipping_zip_code: "",
        same_as_billing: false,
        status: 'draft'
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

    const handleAccountChange = (val: string) => {
        const account = accounts.find(acc => acc.id.toString() === val);
        if (!account) return;

        setData({
            ...data,
            account_id: val,
            account_contact_id: "", // Reset contact when account changes
            billing_address: account.billing_address || '',
            billing_location: account.billing_location || '',
            billing_city: account.billing_city || '',
            billing_zip_code: account.billing_zip_code || '',
            ...(data.same_as_billing ? {
                shipping_address: account.shipping_address || '',
                shipping_location: account.shipping_location || '',
                shipping_city: account.shipping_city || '',
                shipping_zip_code: account.shipping_zip_code || '',
            } : {})
        });
    };

    const handleSameAsBillingChange = (checked: boolean) => {
        if (checked) {
            setData({
                ...data,
                same_as_billing: checked,
                shipping_address: data.billing_address,
                shipping_location: data.billing_location,
                shipping_city: data.billing_city,
                shipping_zip_code: data.billing_zip_code,
            });
        } else {
            setData({
                ...data,
                same_as_billing: checked,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quotations.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Quotation" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Create Quotation</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">Reference ID: {data.reference}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label>Choose Account <span className="text-red-500">*</span></Label>
                                    <Select value={data.account_id} onValueChange={handleAccountChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map(account => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {account.business_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_id && <p className="text-sm text-red-500">{errors.account_id}</p>}
                                </div>

                                {data.account_id && (
                                    <div>
                                        <Label>Contact Person</Label>
                                        <Select value={data.account_contact_id} onValueChange={(val) => setData('account_contact_id', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a contact" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.find(acc => acc.id.toString() === data.account_id)?.contacts?.map(contact => (
                                                    <SelectItem key={contact.id} value={contact.id.toString()}>
                                                        {contact.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.account_contact_id && <p className="text-sm text-red-500">{errors.account_contact_id}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Available Size <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="Width"
                                            value={data.available_size_width}
                                            onChange={(e) => setData('available_size_width', e.target.value)}
                                            required
                                        />
                                        <Input
                                            placeholder="Height"
                                            value={data.available_size_height}
                                            onChange={(e) => setData('available_size_height', e.target.value)}
                                            required
                                        />
                                        <Select value={data.available_size_unit} onValueChange={(val) => setData('available_size_unit', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mm">mm</SelectItem>
                                                <SelectItem value="ft">ft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {data.available_size_unit === 'mm' ? (
                                            <>
                                                {data.available_size_width_ft} ft x {data.available_size_height_ft} ft
                                                ({data.available_size_sqft} sq.ft)
                                            </>
                                        ) : (
                                            <>
                                                {data.available_size_width_mm} mm x {data.available_size_height_mm} mm
                                                ({data.available_size_sqft} sq.ft)
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label>Proposed Size <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="Width"
                                            value={data.proposed_size_width}
                                            onChange={(e) => setData('proposed_size_width', e.target.value)}
                                            required
                                        />
                                        <Input
                                            placeholder="Height"
                                            value={data.proposed_size_height}
                                            onChange={(e) => setData('proposed_size_height', e.target.value)}
                                            required
                                        />
                                        <Select value={data.proposed_size_unit} onValueChange={(val) => setData('proposed_size_unit', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mm">mm</SelectItem>
                                                <SelectItem value="ft">ft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {data.proposed_size_unit === 'mm' ? (
                                            <>
                                                {data.proposed_size_width_ft} ft x {data.proposed_size_height_ft} ft
                                                ({data.proposed_size_sqft} sq.ft)
                                            </>
                                        ) : (
                                            <>
                                                {data.proposed_size_width_mm} mm x {data.proposed_size_height_mm} mm
                                                ({data.proposed_size_sqft} sq.ft)
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Description <span className="text-red-500">*</span></Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div>
                                <Label>Estimate Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={data.estimate_date}
                                    onChange={(e) => setData('estimate_date', e.target.value)}
                                    required
                                />
                                {errors.estimate_date && <p className="text-sm text-red-500">{errors.estimate_date}</p>}
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium">Billing Address</h3>
                                <Textarea
                                    placeholder="Address"
                                    value={data.billing_address}
                                    onChange={(e) => setData('billing_address', e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Location"
                                        value={data.billing_location}
                                        onChange={(e) => setData('billing_location', e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="City"
                                        value={data.billing_city}
                                        onChange={(e) => setData('billing_city', e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="ZIP Code"
                                        value={data.billing_zip_code}
                                        onChange={(e) => setData('billing_zip_code', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="same_as_billing"
                                    checked={data.same_as_billing}
                                    onCheckedChange={handleSameAsBillingChange}
                                />
                                <Label htmlFor="same_as_billing">Same as Billing Address</Label>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium">Shipping Address</h3>
                                <Textarea
                                    placeholder="Address"
                                    value={data.same_as_billing ? data.billing_address : data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Location"
                                        value={data.same_as_billing ? data.billing_location : data.shipping_location}
                                        onChange={(e) => setData('shipping_location', e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="City"
                                        value={data.same_as_billing ? data.billing_city : data.shipping_city}
                                        onChange={(e) => setData('shipping_city', e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="ZIP Code"
                                        value={data.same_as_billing ? data.billing_zip_code : data.shipping_zip_code}
                                        onChange={(e) => setData('shipping_zip_code', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Next
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function generateReference() {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RSPL/${month}/${year}-${random}`;
}
