import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { type FC } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Create Product',
        href: '#',
    },
];

interface CreateProps {
    categories: Array<{
        id: number;
        name: string;
    }>;
}

const Create: FC<CreateProps> = ({ categories }) => {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        sku: '',
        description: '',
        size: '',
        h_mm: 0,
        w_mm: 0,
        size_inch: '',
        upto_pix: 0,
        price: '',
        unit: '',
        price_per_sqft: 0,
        brand: '',
        type: '',
        gst_percentage: 0,
        hsn_code: '',
        min_price: 0,
        max_price: 0,
        status: 'active',
        pixel_pitch: '',
        refresh_rate: '',
        cabinet_type: '',
        specification_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'), {
            forceFormData: true,
            // Backend will redirect with flash message, no need to manually visit
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    toast.error('Please fix the validation errors');
                } else {
                    toast.error('Failed to create product');
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Create Product</CardTitle>
                            <Link href={route('products.index')} className="text-sm text-gray-500 hover:text-gray-700">
                                <Button variant="outline">
                                    <ArrowLeftIcon className="h-4 w-4" /> Back to Products
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                </div>



                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="Enter SKU"
                                    />
                                    {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Base Price (sq. ft/unit) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Enter price"
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        placeholder="Enter unit (e.g., piece, sqft)"
                                    />
                                    {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_price">Min Price (sq. ft/unit)</Label>
                                    <Input
                                        id="min_price"
                                        type="number"
                                        step="0.01"
                                        value={data.min_price}
                                        onChange={(e) => setData('min_price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                        placeholder="Enter min price"
                                    />
                                    {errors.min_price && <p className="text-sm text-red-500">{errors.min_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_price">Max Price (sq. ft/unit)</Label>
                                    <Input
                                        id="max_price"
                                        type="number"
                                        step="0.01"
                                        value={data.max_price}
                                        onChange={(e) => setData('max_price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                        placeholder="Enter max price"
                                    />
                                    {errors.max_price && <p className="text-sm text-red-500">{errors.max_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price_per_sqft">Price (sq. ft/unit)</Label>
                                    <Input
                                        id="price_per_sqft"
                                        type="number"
                                        step="0.01"
                                        value={data.price_per_sqft}
                                        onChange={(e) => setData('price_per_sqft', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                        placeholder="Enter price per square foot"
                                    />
                                    {errors.price_per_sqft && <p className="text-sm text-red-500">{errors.price_per_sqft}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        placeholder="Enter brand name"
                                    />
                                    {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        placeholder="Enter product type"
                                    />
                                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gst_percentage">GST Percentage (required if applicable, default 0)</Label>
                                    <Input
                                        id="gst_percentage"
                                        type="number"
                                        step="0.01"
                                        value={data.gst_percentage}
                                        onChange={(e) => setData('gst_percentage', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                        placeholder="Enter GST percentage"
                                    />
                                    {errors.gst_percentage && <p className="text-sm text-red-500">{errors.gst_percentage}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hsn_code">HSN Code</Label>
                                    <Input
                                        id="hsn_code"
                                        value={data.hsn_code}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setData('hsn_code', value);
                                        }}
                                        placeholder="Enter HSN Code (exactly 5 digits)"
                                        maxLength={5}
                                    />
                                    <p className="text-xs text-muted-foreground">Exactly 5 digits required</p>
                                    {errors.hsn_code && <p className="text-sm text-red-500">{errors.hsn_code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specification_image">Specification Image (Optional)</Label>
                                    <Input
                                        id="specification_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData('specification_image', file as any);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">Upload product specification image (auto-attached to quotations)</p>
                                    {errors.specification_image && <p className="text-sm text-red-500">{errors.specification_image}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </div>

                            {/* Dimensions Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dimensions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="size">Size (mm) Width X Height (If applicable)</Label>
                                        <Input
                                            id="size"
                                            value={data.size}
                                            onChange={(e) => setData('size', e.target.value)}
                                            placeholder="Enter size (e.g., 500 mm X 1000 mm)"
                                        />
                                        {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="size_inch">Size (Inches) (If applicable)</Label>
                                        <Input
                                            id="size_inch"
                                            value={data.size_inch}
                                            onChange={(e) => setData('size_inch', e.target.value)}
                                            placeholder="Enter size in inches"
                                        />
                                        {errors.size_inch && <p className="text-sm text-red-500">{errors.size_inch}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="h_mm">Height (mm) (If applicable)</Label>
                                        <Input
                                            id="h_mm"
                                            type="number"
                                            step="0.01"
                                            value={data.h_mm}
                                            onChange={(e) => setData('h_mm', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                            placeholder="Enter height in mm"
                                        />
                                        {errors.h_mm && <p className="text-sm text-red-500">{errors.h_mm}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="w_mm">Width (mm) (If applicable)</Label>
                                        <Input
                                            id="w_mm"
                                            type="number"
                                            step="0.01"
                                            value={data.w_mm}
                                            onChange={(e) => setData('w_mm', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                            placeholder="Enter width in mm"
                                        />
                                        {errors.w_mm && <p className="text-sm text-red-500">{errors.w_mm}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="upto_pix">Up to Pixels (If applicable)</Label>
                                        <Input
                                            id="upto_pix"
                                            type="number"
                                            step="0.01"
                                            value={data.upto_pix}
                                            onChange={(e) => setData('upto_pix', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                            placeholder="Enter up to pixels"
                                        />
                                        {errors.upto_pix && <p className="text-sm text-red-500">{errors.upto_pix}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pixel_pitch">Pixel Pitch (mm) (If applicable)</Label>
                                        <Input
                                            id="pixel_pitch"
                                            type="number"
                                            step="0.01"
                                            value={data.pixel_pitch}
                                            onChange={(e) => setData('pixel_pitch', e.target.value)}
                                            placeholder="Enter pixel pitch in mm"
                                        />
                                        {errors.pixel_pitch && <p className="text-sm text-red-500">{errors.pixel_pitch}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="refresh_rate">Refresh Rate (Hz) (If applicable)</Label>
                                        <Input
                                            id="refresh_rate"
                                            type="number"
                                            step="1"
                                            value={data.refresh_rate}
                                            onChange={(e) => setData('refresh_rate', e.target.value)}
                                            placeholder="Enter refresh rate in Hz"
                                        />
                                        {errors.refresh_rate && <p className="text-sm text-red-500">{errors.refresh_rate}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cabinet_type">Cabinet Type (If applicable)</Label>
                                        <Input
                                            id="cabinet_type"
                                            value={data.cabinet_type}
                                            onChange={(e) => setData('cabinet_type', e.target.value)}
                                            placeholder="Enter cabinet type"
                                        />
                                        {errors.cabinet_type && <p className="text-sm text-red-500">{errors.cabinet_type}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product description"
                                    rows={4}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Product'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
