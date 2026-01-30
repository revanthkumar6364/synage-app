import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Account, AccountContact, Quotation, type BreadcrumbItem, Product } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { toast, Toaster } from "sonner";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Edit Quotation', href: '#' },
];

// Add categories constant
const CATEGORIES = {
    unilumin: 'Unilumin',
    absen: 'Absen',
    radiant_synage: 'Radiant Synage',
    custom: 'Custom',
} as const;

interface Props {
    quotation: Quotation;
    accounts: Account[];
    salesUsers: {
        id: number;
        name: string;
    }[];
    facadeTypes: Record<string, string>;
    productsByType: {
        indoor: Product[];
        outdoor: Product[];
        standard_led: Product[];
    };
}

interface FormData extends Record<string, any> {
    reference: string;
    title: string;
    account_id: number;
    account_contact_id: number | undefined;
    available_size_width: string;
    available_size_height: string;
    available_size_unit: string;
    proposed_size_width: string;
    proposed_size_height: string;
    proposed_size_unit: string;
    available_size_width_mm: string;
    available_size_height_mm: string;
    available_size_width_ft: string;
    available_size_height_ft: string;
    available_size_sqft: string;
    proposed_size_width_mm: string;
    proposed_size_height_mm: string;
    proposed_size_width_ft: string;
    proposed_size_height_ft: string;
    proposed_size_sqft: string;
    quantity: string;
    max_quantity: string;
    description: string;
    estimate_date: string;
    category: string;
    billing_address: string;
    billing_location: string;
    billing_city: string;
    billing_zip_code: string;
    shipping_address: string;
    shipping_location: string;
    shipping_city: string;
    shipping_zip_code: string;
    same_as_billing: boolean;
    show_hsn_code: boolean;
    show_no_of_pixels: boolean;
    show_billing_in_print: boolean;
    show_shipping_in_print: boolean;
    show_product_specs: boolean;
    product_type: string;
    selected_product_id: number | undefined;
}

export default function Edit({ quotation, accounts = [], salesUsers = [], facadeTypes = {}, productsByType }: Props) {
    const [accountContacts, setAccountContacts] = useState<AccountContact[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { data, setData, put, processing, errors } = useForm<FormData>({
        reference: quotation.reference,
        title: quotation.title,
        account_id: quotation.account_id,
        account_contact_id: quotation.account_contact_id,
        available_size_width: quotation.available_size_width || '',
        available_size_height: quotation.available_size_height || '',
        available_size_unit: quotation.available_size_unit || 'mm',
        proposed_size_width: quotation.proposed_size_width || '',
        proposed_size_height: quotation.proposed_size_height || '',
        proposed_size_unit: quotation.proposed_size_unit || 'mm',
        available_size_width_mm: quotation.available_size_width_mm || '',
        available_size_height_mm: quotation.available_size_height_mm || '',
        available_size_width_ft: quotation.available_size_width_ft || '',
        available_size_height_ft: quotation.available_size_height_ft || '',
        available_size_sqft: quotation.available_size_sqft || '',
        proposed_size_width_mm: quotation.proposed_size_width_mm || '',
        proposed_size_height_mm: quotation.proposed_size_height_mm || '',
        proposed_size_width_ft: quotation.proposed_size_width_ft || '',
        proposed_size_height_ft: quotation.proposed_size_height_ft || '',
        proposed_size_sqft: quotation.proposed_size_sqft || '',
        quantity: quotation.quantity?.toString() || '',
        max_quantity: quotation.max_quantity?.toString() || '',
        description: quotation.description || '',
        estimate_date: quotation.estimate_date ? new Date(quotation.estimate_date).toISOString().split('T')[0] : '',
        billing_address: quotation.billing_address || '',
        billing_location: quotation.billing_location || '',
        billing_city: quotation.billing_city || '',
        billing_zip_code: quotation.billing_zip_code || '',
        shipping_address: quotation.shipping_address || '',
        shipping_location: quotation.shipping_location || '',
        shipping_city: quotation.shipping_city || '',
        shipping_zip_code: quotation.shipping_zip_code || '',
        category: quotation.category || 'custom',
        same_as_billing: false,
        show_hsn_code: quotation.show_hsn_code || false,
        show_no_of_pixels: quotation.show_no_of_pixels ?? true,
        show_billing_in_print: quotation.show_billing_in_print ?? true,
        show_shipping_in_print: quotation.show_shipping_in_print ?? true,
        show_product_specs: quotation.show_product_specs ?? true,
        product_type: quotation.product_type || '',
        selected_product_id: quotation.selected_product_id,
    });

    // Reset selected product when product type changes (but not on initial load)
    useEffect(() => {
        if (!isInitialLoad) {
            setData((prev: FormData) => ({
                ...prev,
                selected_product_id: undefined
            }));
        } else {
            setIsInitialLoad(false);
        }
    }, [data.product_type]);

    // Update shipping address when billing address changes and same_as_billing is true
    useEffect(() => {
        if (data.same_as_billing) {
            setData({
                ...data,
                shipping_address: data.billing_address,
                shipping_location: data.billing_location,
                shipping_city: data.billing_city,
                shipping_zip_code: data.billing_zip_code,
            });
        }
    }, [data.billing_address, data.billing_location, data.billing_city, data.billing_zip_code, data.same_as_billing]);

    useEffect(() => {
        const width = parseFloat(data.available_size_width) || 0;
        const height = parseFloat(data.available_size_height) || 0;
        const unit = data.available_size_unit;
        const selectedProduct = getSelectedProduct();
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
        // Use product-specific unit size if available, otherwise fallback to default
        const unitSize = selectedProduct?.unit_size || { width_mm: 320, height_mm: 160 };
        const boxWidth = unitSize.width_mm;
        const boxHeight = unitSize.height_mm;
        const boxesInWidth = Math.floor(width_mm / boxWidth) || 0;
        const boxesInHeight = Math.floor(height_mm / boxHeight) || 0;
        const maxPossibleBoxes = boxesInWidth * boxesInHeight;
        const proposedWidth = boxWidth * boxesInWidth;
        const proposedHeight = boxesInWidth > 0 ? boxHeight * Math.ceil(maxPossibleBoxes / boxesInWidth) : 0;
        setData((prev: any) => ({
            ...prev,
            available_size_width_mm: (isNaN(width_mm) ? 0 : width_mm).toFixed(2),
            available_size_height_mm: (isNaN(height_mm) ? 0 : height_mm).toFixed(2),
            available_size_width_ft: (isNaN(width_ft) ? 0 : width_ft).toFixed(2),
            available_size_height_ft: (isNaN(height_ft) ? 0 : height_ft).toFixed(2),
            available_size_sqft: (isNaN(sqft) ? 0 : sqft).toFixed(2),
            max_quantity: (isNaN(maxPossibleBoxes) ? 0 : maxPossibleBoxes).toString(),
            quantity: (isNaN(maxPossibleBoxes) ? 0 : maxPossibleBoxes).toString(),
            proposed_size_width: (isNaN(proposedWidth) ? 0 : proposedWidth).toString(),
            proposed_size_height: (isNaN(proposedHeight) ? 0 : proposedHeight).toString(),
            proposed_size_unit: "mm",
            proposed_size_width_mm: (isNaN(proposedWidth) ? 0 : proposedWidth).toFixed(2),
            proposed_size_height_mm: (isNaN(proposedHeight) ? 0 : proposedHeight).toFixed(2),
            proposed_size_width_ft: (isNaN(proposedWidth) ? 0 : (proposedWidth / 304.8)).toFixed(2),
            proposed_size_height_ft: (isNaN(proposedHeight) ? 0 : (proposedHeight / 304.8)).toFixed(2),
            proposed_size_sqft: (isNaN(proposedWidth) || isNaN(proposedHeight) ? 0 : ((proposedWidth / 304.8) * (proposedHeight / 304.8))).toFixed(2)
        }));
    }, [data.available_size_width, data.available_size_height, data.available_size_unit, data.selected_product_id, data.product_type]);

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
        setData('account_id', Number(value));
        setData('account_contact_id', undefined);

        // Generate suggested reference number and populate billing address based on selected account
        if (value) {
            const selectedAccount = accounts.find(acc => acc.id.toString() === value);
            if (selectedAccount) {
                // Generate suggested reference number
                const clientName = selectedAccount.business_name.substring(0, 4).toUpperCase();
                const today = new Date().toISOString().split('T')[0];
                const suggestedReference = `RSPL/${clientName}/MUM - ${today}/001`;
                setData('reference', suggestedReference);

                // Populate billing address
                setData('billing_address', selectedAccount.billing_address || '');
                setData('billing_location', selectedAccount.billing_location || '');
                setData('billing_city', selectedAccount.billing_city || '');
                setData('billing_zip_code', selectedAccount.billing_zip_code || '');

                // Populate shipping address if same as billing is checked
                if (data.same_as_billing) {
                    setData('shipping_address', selectedAccount.shipping_address || '');
                    setData('shipping_location', selectedAccount.shipping_location || '');
                    setData('shipping_city', selectedAccount.shipping_city || '');
                    setData('shipping_zip_code', selectedAccount.shipping_zip_code || '');
                }

                // Set account contacts
                setAccountContacts(selectedAccount.contacts || []);
            }
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

    const handleSaveAndNext = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('quotations.update', quotation.id) + '?action=save_and_next', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Quotation details updated successfully");
            },
            onError: () => {
                toast.error("Failed to update quotation details");
            }
        });
    };

    // Utility functions (copy from create.tsx)
    const getAvailableProducts = () => {
        if (!data.product_type) return [];
        return productsByType[data.product_type as keyof typeof productsByType] || [];
    };
    const getSelectedProduct = () => {
        if (!data.selected_product_id) return null;
        return getAvailableProducts().find((p: Product) => p.id.toString() === data.selected_product_id?.toString());
    };
    const getProductTypeDisplayName = (productType: string) => {
        switch (productType) {
            case 'indoor_led':
                return 'Indoor LED';
            case 'outdoor_led':
                return 'Outdoor LED';
            case 'kiosk':
            case 'controllers':
            case 'tv_screens':
                return 'Standard LED';
            default:
                return productType;
        }
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
                        onClick={() => router.visit(route('quotations.files', quotation.id))}
                    >
                        Files
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
                                    <Label>Reference ID <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={data.reference}
                                        onChange={e => setData('reference', e.target.value)}
                                        placeholder="RSPL/CLNT/MUM - 2024-01-15/001"
                                        className={errors.reference ? 'border-red-500' : ''}
                                        required
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Format: RSPL/4characters of Client name/MUM - region/Date-5
                                    </p>
                                    {errors.reference && <span className="text-red-500 text-sm">{errors.reference}</span>}
                                </div>

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
                                        value={data.account_id ? data.account_id.toString() : ''}
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
                                        value={data.account_contact_id ? data.account_contact_id.toString() : ''}
                                        onValueChange={(value) => setData('account_contact_id', Number(value))}
                                        disabled={!data.account_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountContacts.length > 0 ? (
                                                accountContacts.map((contact) => (
                                                    <SelectItem key={contact.id} value={contact.id.toString()}>
                                                        {contact.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300">
                                                    No contacts found for this account. Add contacts first.
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {accountContacts.length === 0 && data.account_id && (
                                        <p className="text-sm text-amber-600 mt-1">
                                            No contacts found in this account. Please add contacts first for this account then select.
                                        </p>
                                    )}
                                    {errors.account_contact_id && <span className="text-red-500 text-sm">{errors.account_contact_id}</span>}
                                </div>

                                <div>
                                    <Label>Estimate Date</Label>
                                    <DatePicker
                                        selected={data.estimate_date ? new Date(data.estimate_date) : null}
                                        onChange={date => setData('estimate_date', date ? date.toISOString().split('T')[0] : '')}
                                        dateFormat="yyyy-MM-dd"
                                        className={`w-full border rounded px-3 py-2 ${errors.estimate_date ? 'border-red-500' : ''}`}
                                        placeholderText="Select estimate date"
                                    />
                                    {errors.estimate_date && <span className="text-red-500 text-sm">{errors.estimate_date}</span>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium">Billing Details (Optional)</h3>
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
                                        <h3 className="text-lg font-medium">Shipping Details (Optional)</h3>
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
                            {/* Print Options */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Print Options</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_hsn_code"
                                            checked={data.show_hsn_code}
                                            onCheckedChange={(checked) => setData('show_hsn_code', checked as boolean)}
                                        />
                                        <Label htmlFor="show_hsn_code" className="text-sm">Show HSN Code in Printout</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_no_of_pixels"
                                            checked={data.show_no_of_pixels}
                                            onCheckedChange={(checked) => setData('show_no_of_pixels', checked as boolean)}
                                        />
                                        <Label htmlFor="show_no_of_pixels" className="text-sm">Show Number of Pixels</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_billing_in_print"
                                            checked={data.show_billing_in_print}
                                            onCheckedChange={(checked) => setData('show_billing_in_print', checked as boolean)}
                                        />
                                        <Label htmlFor="show_billing_in_print" className="text-sm">Show Billing in Print</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_shipping_in_print"
                                            checked={data.show_shipping_in_print}
                                            onCheckedChange={(checked) => setData('show_shipping_in_print', checked as boolean)}
                                        />
                                        <Label htmlFor="show_shipping_in_print" className="text-sm">Show Shipping in Print</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_product_specs"
                                            checked={data.show_product_specs}
                                            onCheckedChange={(checked) => setData('show_product_specs', checked as boolean)}
                                        />
                                        <Label htmlFor="show_product_specs" className="text-sm">Show Product Specifications in Print</Label>
                                    </div>
                                </div>
                            </div>
                            {/* Product Type Selection */}
                            <div className="space-y-4">
                                <Label>LED Display Type <span className="text-red-500">*</span></Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="indoor"
                                            name="product_type"
                                            value="indoor"
                                            checked={data.product_type === 'indoor'}
                                            onChange={(e) => setData('product_type', e.target.value as 'indoor')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <Label htmlFor="indoor" className="cursor-pointer">
                                            <div className="font-medium">Indoor LED</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">Indoor display panels</div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="outdoor"
                                            name="product_type"
                                            value="outdoor"
                                            checked={data.product_type === 'outdoor'}
                                            onChange={(e) => setData('product_type', e.target.value as 'outdoor')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <Label htmlFor="outdoor" className="cursor-pointer">
                                            <div className="font-medium">Outdoor LED</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">Outdoor display panels</div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="standard_led"
                                            name="product_type"
                                            value="standard_led"
                                            checked={data.product_type === 'standard_led'}
                                            onChange={(e) => setData('product_type', e.target.value as 'standard_led')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <Label htmlFor="standard_led" className="cursor-pointer">
                                            <div className="font-medium">Display And Other</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">Kiosks, controllers, TV screens and other</div>
                                        </Label>
                                    </div>
                                </div>
                                {errors.product_type && <p className="text-sm text-red-500">{errors.product_type}</p>}
                            </div>

                            {/* Product Selection */}
                            {data.product_type && (
                                <div>
                                    <Label>Select Product <span className="text-red-500">*</span></Label>
                                    <Select value={data.selected_product_id ? data.selected_product_id.toString() : ''} onValueChange={(val) => setData('selected_product_id', Number(val))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableProducts().map((product: Product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{product.name}</span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {product.brand} • {getProductTypeDisplayName(product.product_type || '')}
                                                            {(() => {
                                                                if (product.product_type === 'tv_screens' && product.size_inch) {
                                                                    return <> • {product.size_inch}" Inch</>;
                                                                }
                                                                if (product.product_type === 'kiosk' && product.size_inch) {
                                                                    return <> • {product.size_inch}" Inch</>;
                                                                }
                                                                if (product.product_type === 'controllers' && product.upto_pix) {
                                                                    return <> • Up to {product.upto_pix.toLocaleString()} pixels</>;
                                                                }
                                                                if (product.product_type === 'indoor_led' && product.unit_size) {
                                                                    return <> • {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>;
                                                                }
                                                                if (product.product_type === 'outdoor_led' && product.unit_size) {
                                                                    return <> • {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>;
                                                                }
                                                                return null;
                                                            })()}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.selected_product_id && <p className="text-sm text-red-500">{errors.selected_product_id}</p>}
                                    {/* Selected Product Info */}
                                    {getSelectedProduct() && (
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Selected Product: {getSelectedProduct()?.name}</div>
                                                <div className="text-gray-600 dark:text-gray-300">
                                                    Brand: {getSelectedProduct()?.brand} |
                                                    Type: {getProductTypeDisplayName(getSelectedProduct()?.product_type || '')} |
                                                    {(() => {
                                                        const product = getSelectedProduct();
                                                        if (!product) return null;

                                                        if (product.product_type === 'tv_screens' && product.size_inch) {
                                                            return <>Size: {product.size_inch}" Inch</>;
                                                        }
                                                        if (product.product_type === 'kiosk' && product.size_inch) {
                                                            return <>Size: {product.size_inch}" Inch</>;
                                                        }
                                                        if (product.product_type === 'controllers' && product.upto_pix) {
                                                            return <>Up to: {product.upto_pix.toLocaleString()} pixels</>;
                                                        }
                                                        if (product.product_type === 'indoor_led' && product.unit_size) {
                                                            return <>Unit Size: {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>;
                                                        }
                                                        if (product.product_type === 'outdoor_led' && product.unit_size) {
                                                            return <>Unit Size: {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>;
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        {(() => {
                                            const product = getSelectedProduct();
                                            if (!product) return null;

                                            if (product.product_type === 'tv_screens' && product.size_inch) {
                                                return <>Size: {product.size_inch}" Inch</>;
                                            }
                                            if (product.product_type === 'kiosk' && product.size_inch) {
                                                return <>Size: {product.size_inch}" Inch</>;
                                            }
                                            if (product.product_type === 'controllers' && product.upto_pix) {
                                                return <>Up to: {product.upto_pix.toLocaleString()} pixels</>;
                                            }
                                            if (product.product_type === 'indoor_led' && product.unit_size) {
                                                return <>Unit size: {product.unit_size.width_mm}mm x {product.unit_size.height_mm}mm</>;
                                            }
                                            if (product.product_type === 'outdoor_led' && product.unit_size) {
                                                return <>Unit size: {product.unit_size.width_mm}mm x {product.unit_size.height_mm}mm</>;
                                            }
                                            return <>Unit size: 320mm x 160mm</>;
                                        })()}
                                        {data.max_quantity && (
                                            <> | Total Panels : {data.max_quantity} units</>
                                        )}
                                    </p>
                                </div>
                            )}


                            <div className="space-y-6">
                                {/* Size fields - only show for indoor and outdoor LED */}
                                {data.product_type !== 'standard_led' && (
                                    <>
                                        <div>
                                            <Label>Size available at location</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label>Width</Label>
                                                    <Input
                                                        value={data.available_size_width}
                                                        onChange={(e) => setData('available_size_width', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Height</Label>
                                                    <Input
                                                        value={data.available_size_height}
                                                        onChange={(e) => setData('available_size_height', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Unit</Label>
                                                    <Select value={data.available_size_unit} onValueChange={(val) => setData('available_size_unit', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="mm">mm</SelectItem>
                                                            <SelectItem value="ft">ft</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                {parseFloat(data.available_size_width_ft) || 0} ft x {parseFloat(data.available_size_height_ft) || 0} ft
                                                ({parseFloat(data.available_size_sqft) || 0} sq.ft)
                                                {data.available_size_unit === 'ft' && (
                                                    <>
                                                        <br />
                                                        <span className="text-xs text-gray-400">
                                                            ({parseFloat(data.available_size_width_mm) || 0} mm × {parseFloat(data.available_size_height_mm) || 0} mm)
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Suggested Size (Auto-calculated)</Label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label>Width</Label>
                                                    <Input
                                                        value={data.proposed_size_width}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Height</Label>
                                                    <Input
                                                        value={data.proposed_size_height}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Unit</Label>
                                                    <Input
                                                        value={data.proposed_size_unit}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                Calculated: {parseFloat(data.proposed_size_width_mm) || 0}mm x {parseFloat(data.proposed_size_height_mm) || 0}mm ({parseFloat(data.proposed_size_width_ft) || 0}ft x {parseFloat(data.proposed_size_height_ft) || 0}ft) |
                                                Area: {parseFloat(data.proposed_size_sqft) || 0} sq.ft
                                            </div>
                                        </div>

                                        {/* Visual Size Comparison */}
                                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-6">
                                            <div className="flex flex-col items-center">
                                                <span className="mb-2 text-sm font-semibold">Size available at location</span>
                                                <svg width={160} height={160} style={{ border: '1px solid #ccc', background: '#f9f9f9' }}>
                                                    <rect
                                                        x={10}
                                                        y={10}
                                                        width={Math.max(40, Math.min(140, (parseFloat(data.available_size_width_mm) || 0) / 10))}
                                                        height={Math.max(40, Math.min(140, (parseFloat(data.available_size_height_mm) || 0) / 10))}
                                                        fill="#b3e5fc"
                                                        stroke="#0288d1"
                                                        strokeWidth={2}
                                                    />
                                                </svg>
                                                <span className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                                                    {parseFloat(data.available_size_width_mm) || 0}mm × {parseFloat(data.available_size_height_mm) || 0}mm
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="mb-2 text-sm font-semibold">Proposed Size</span>
                                                <svg width={160} height={160} style={{ border: '1px solid #ccc', background: '#f9f9f9' }}>
                                                    <rect
                                                        x={10}
                                                        y={10}
                                                        width={Math.max(40, Math.min(140, (parseFloat(data.proposed_size_width) || 0) / 10))}
                                                        height={Math.max(40, Math.min(140, (parseFloat(data.proposed_size_height) || 0) / 10))}
                                                        fill="#c8e6c9"
                                                        stroke="#388e3c"
                                                        strokeWidth={2}
                                                    />
                                                </svg>
                                                <span className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                                                    {parseFloat(data.proposed_size_width) || 0}mm × {parseFloat(data.proposed_size_height) || 0}mm
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}



                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(CATEGORIES).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Button type="button" onClick={handleSaveAndNext} disabled={processing}>
                                    {processing ? 'Saving...' : 'Save and Next'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
