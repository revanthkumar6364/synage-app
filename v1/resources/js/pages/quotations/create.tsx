import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Account, BreadcrumbItem, Product } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Create Quotation', href: '#' },
];

interface Props {
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

interface FormData {
    quotation_number: string;
    title: string;
    account_id: string;
    account_contact_id: string;
    sales_user_id: string;
    product_type: 'indoor' | 'outdoor' | 'standard_led' | '';
    selected_product_id: string;
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
    quantity: string;
    max_quantity: string;
    description: string;
    category: string;
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
    show_hsn_code: boolean;
    status: 'draft';
    facade_type?: string;
    facade_notes?: string;
}

// Add categories constant
const CATEGORIES = {
    unilumin: 'Unilumin',
    absen: 'Absen',
    radiant_synage: 'Radiant Synage',
    custom: 'Custom',
} as const;

export default function Create({ accounts = [], salesUsers = [], facadeTypes = {}, productsByType }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        quotation_number: "",
        title: "",
        account_id: "",
        account_contact_id: "",
        sales_user_id: "",
        product_type: "",
        selected_product_id: "",
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
        quantity: "",
        max_quantity: "",
        description: "",
        category: "custom",
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
        show_hsn_code: false,
        status: 'draft',
        facade_type: undefined,
        facade_notes: undefined,
    });

    // Get available products based on selected type
    const getAvailableProducts = () => {
        if (!data.product_type) return [];
        return productsByType[data.product_type as keyof typeof productsByType] || [];
    };

    // Get selected product details
    const getSelectedProduct = () => {
        if (!data.selected_product_id) return null;
        return getAvailableProducts().find((p: Product) => p.id.toString() === data.selected_product_id);
    };

    // Get product type display name
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

    useEffect(() => {
        // Calculate derived measurements when width/height/unit changes
        const calculateMeasurements = () => {
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

            // Calculate how many boxes can fit in the width and height
            const boxesInWidth = Math.floor(width_mm / boxWidth);
            const boxesInHeight = Math.floor(height_mm / boxHeight);
            const maxPossibleBoxes = boxesInWidth * boxesInHeight;

            // Calculate proposed dimensions based on max boxes
            const proposedWidth = boxWidth * boxesInWidth;
            const proposedHeight = boxHeight * Math.ceil(maxPossibleBoxes / boxesInWidth);

            setData((prev: FormData) => ({
                ...prev,
                available_size_width_mm: width_mm.toFixed(2),
                available_size_height_mm: height_mm.toFixed(2),
                available_size_width_ft: width_ft.toFixed(2),
                available_size_height_ft: height_ft.toFixed(2),
                available_size_sqft: sqft.toFixed(2),
                max_quantity: maxPossibleBoxes.toString(),
                quantity: maxPossibleBoxes.toString(),
                proposed_size_width: proposedWidth.toString(),
                proposed_size_height: proposedHeight.toString(),
                proposed_size_unit: "mm",
                proposed_size_width_mm: proposedWidth.toFixed(2),
                proposed_size_height_mm: proposedHeight.toFixed(2),
                proposed_size_width_ft: (proposedWidth / 304.8).toFixed(2),
                proposed_size_height_ft: (proposedHeight / 304.8).toFixed(2),
                proposed_size_sqft: ((proposedWidth / 304.8) * (proposedHeight / 304.8)).toFixed(2)
            }));
        };

        calculateMeasurements();
    }, [data.available_size_width, data.available_size_height, data.available_size_unit, data.selected_product_id]);

    // Reset selected product when product type changes
    useEffect(() => {
        setData((prev: FormData) => ({
            ...prev,
            selected_product_id: ""
        }));
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

    const handleAccountChange = (val: string) => {
        setData('account_id', val);
        setData('account_contact_id', '');

        // Populate billing address based on selected account
        if (val) {
            const selectedAccount = accounts.find(acc => acc.id.toString() === val);
            if (selectedAccount) {
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
            }
        }
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
                                            <div className="text-sm text-gray-500">Indoor display panels</div>
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
                                            <div className="text-sm text-gray-500">Outdoor display panels</div>
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
                                            <div className="text-sm text-gray-500">Kiosks, controllers, TV screens</div>
                                        </Label>
                                    </div>
                                </div>
                                {errors.product_type && <p className="text-sm text-red-500">{errors.product_type}</p>}
                            </div>

                            {/* Product Selection */}
                            {data.product_type && (
                                <div>
                                    <Label>Select Product <span className="text-red-500">*</span></Label>
                                    <Select value={data.selected_product_id} onValueChange={(val) => setData('selected_product_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableProducts().map(product => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{product.name}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {product.brand} • {getProductTypeDisplayName(product.product_type || '')}
                                                            {product.unit_size && (
                                                                <> • {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>
                                                            )}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.selected_product_id && <p className="text-sm text-red-500">{errors.selected_product_id}</p>}

                                    {/* Selected Product Info */}
                                    {getSelectedProduct() && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm">
                                                <div className="font-medium">Selected Product: {getSelectedProduct()?.name}</div>
                                                <div className="text-gray-600">
                                                    Brand: {getSelectedProduct()?.brand} |
                                                    Type: {getProductTypeDisplayName(getSelectedProduct()?.product_type || '')} |
                                                    Unit Size: {getSelectedProduct()?.unit_size?.width_mm}×{getSelectedProduct()?.unit_size?.height_mm}mm
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Size fields - only show for indoor and outdoor LED */}
                            {data.product_type !== 'standard_led' && (
                                <>
                                    <div>
                                        <Label>Size available at location <span className="text-red-500">*</span></Label>
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
                                        <div className="mt-2 text-sm text-gray-500">
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
                                        <p className="mt-2 text-sm text-gray-500">
                                            Unit size: {getSelectedProduct()?.unit_size?.width_mm || 320}mm x {getSelectedProduct()?.unit_size?.height_mm || 160}mm
                                            {data.max_quantity && (
                                                <> | Total quantity: {data.max_quantity} units</>
                                            )}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
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
                                        <div className="mt-2 text-sm text-gray-500">
                                            {parseFloat(data.proposed_size_width_ft) || 0} ft x {parseFloat(data.proposed_size_height_ft) || 0} ft
                                            ({parseFloat(data.proposed_size_sqft) || 0} sq.ft)
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
                                            <span className="mt-1 text-xs text-gray-500">
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
                                            <span className="mt-1 text-xs text-gray-500">
                                                {parseFloat(data.proposed_size_width) || 0}mm × {parseFloat(data.proposed_size_height) || 0}mm
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Estimate Date <span className="text-red-500">*</span></Label>
                                    <DatePicker
                                        selected={data.estimate_date ? new Date(data.estimate_date) : null}
                                        onChange={date => setData('estimate_date', date ? date.toISOString().split('T')[0] : '')}
                                        dateFormat="yyyy-MM-dd"
                                        className={`w-full border rounded px-3 py-2 ${errors.estimate_date ? 'border-red-500' : ''}`}
                                        placeholderText="Select estimate date"
                                    />
                                    {errors.estimate_date && <p className="text-sm text-red-500">{errors.estimate_date}</p>}

                                </div>

                                <div>
                                    <Label>Category <span className="text-red-500">*</span></Label>
                                    <Select value={data.category} onValueChange={(val) => setData('category', val)}>
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
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                    <p className="mt-2 text-sm text-gray-500">
                                        Select a category to organize quotation files
                                    </p>
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

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="show_hsn_code"
                                    checked={data.show_hsn_code}
                                    onCheckedChange={(checked) => setData('show_hsn_code', checked as boolean)}
                                />
                                <Label htmlFor="show_hsn_code">Show HSN Code in Printout</Label>
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

                            {/* Sales Person Selection - Only for admin and manager */}
                            {auth.user.role !== 'sales' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="sales_user_id">Sales Person <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.sales_user_id}
                                        onValueChange={(value) => setData('sales_user_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sales person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.sales_user_id && (
                                        <p className="text-sm text-red-500">{errors.sales_user_id}</p>
                                    )}
                                </div>
                            )}

                            {/* Facade Type Dropdown and Facade Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Installation Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.facade_type || ''}
                                        onValueChange={val => setData('facade_type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select installation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(facadeTypes).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.facade_type && <p className="text-sm text-red-500">{errors.facade_type}</p>}
                                </div>
                                <div>
                                    <Label>Installation Notes</Label>
                                    <Input
                                        value={data.facade_notes || ''}
                                        onChange={e => setData('facade_notes', e.target.value)}
                                        placeholder="Enter notes for Installation"
                                    />
                                    {errors.facade_notes && <p className="text-sm text-red-500">{errors.facade_notes}</p>}
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


