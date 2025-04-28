import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
        price: '',
        min_price: '',
        max_price: '',
        price_per_sqft: '',
        brand: '',
        type: '',
        gst_percentage: '',
        hsn_code: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
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
                                    <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Enter price"
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_price">Min Price</Label>
                                    <Input
                                        id="min_price"
                                        type="number"
                                        value={data.min_price}
                                        onChange={(e) => setData('min_price', e.target.value)}
                                        placeholder="Enter min price"
                                    />
                                    {errors.min_price && <p className="text-sm text-red-500">{errors.min_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_price">Max Price</Label>
                                    <Input
                                        id="max_price"
                                        type="number"
                                        value={data.max_price}
                                        onChange={(e) => setData('max_price', e.target.value)}
                                        placeholder="Enter max price"
                                    />
                                    {errors.max_price && <p className="text-sm text-red-500">{errors.max_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price_per_sqft">Price per Square Foot</Label>
                                    <Input
                                        id="price_per_sqft"
                                        type="number"
                                        value={data.price_per_sqft}
                                        onChange={(e) => setData('price_per_sqft', e.target.value)}
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
                                    <Label htmlFor="gst_percentage">GST Percentage</Label>
                                    <Input
                                        id="gst_percentage"
                                        type="number"
                                        value={data.gst_percentage}
                                        onChange={(e) => setData('gst_percentage', e.target.value)}
                                        placeholder="Enter GST percentage"
                                    />
                                    {errors.gst_percentage && <p className="text-sm text-red-500">{errors.gst_percentage}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hsn_code">HSN Code</Label>
                                    <Input
                                        id="hsn_code"
                                        value={data.hsn_code}
                                        onChange={(e) => setData('hsn_code', e.target.value)}
                                        placeholder="Enter HSN Code"
                                    />
                                    {errors.hsn_code && <p className="text-sm text-red-500">{errors.hsn_code}</p>}
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

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product description"
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
