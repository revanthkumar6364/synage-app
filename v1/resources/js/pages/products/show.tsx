import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
        title: 'View Product',
        href: '#',
    },
];

interface ShowProps {
    product: {
        id: number;
        category_id: number;
        name: string;
        sku: string;
        description: string;
        price: number;
        min_price: number | null;
        max_price: number | null;
        price_per_sqft: number | null;
        brand: string;
        type: string | null;
        gst_percentage: number | null;
        hsn_code: string | null;
        status: 'active' | 'inactive';
        category?: {
            name: string;
        };
        can: {
            update: boolean;
            delete: boolean;
        };
    };
}

const Show: FC<ShowProps> = ({ product }) => {
    const formatPrice = (price: number | null): string => {
        if (!price) return 'N/A';
        // Convert price to number to ensure toFixed works
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `₹${numPrice.toFixed(2)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Product Details</CardTitle>
                            <div className="flex gap-2">
                                <Link href={route('products.index')}>
                                    <Button variant="outline">
                                        <ArrowLeftIcon className="h-4 w-4" /> Back to Products
                                    </Button>
                                </Link>
                                {product.can.update && (
                                    <Link href={route('products.edit', product.id)}>
                                        <Button>Edit Product</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold">Basic Information</h3>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Name:</span>
                                        <p>{product.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">SKU:</span>
                                        <p>{product.sku}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Category:</span>
                                        <p>{product.category?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Status:</span>
                                        <span className={`rounded-full px-2 py-1 text-xs ${
                                            product.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold">Pricing</h3>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Base Price:</span>
                                        <p>{formatPrice(product.price)}</p>
                                    </div>
                                    {(product.min_price || product.max_price) && (
                                        <div>
                                            <span className="text-sm text-gray-500">Price Range:</span>
                                            <p>{formatPrice(product.min_price)} - {formatPrice(product.max_price)}</p>
                                        </div>
                                    )}
                                    {product.price_per_sqft && (
                                        <div>
                                            <span className="text-sm text-gray-500">Price per Sq.Ft:</span>
                                            <p>{formatPrice(product.price_per_sqft)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold">Additional Details</h3>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Brand:</span>
                                        <p>{product.brand || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Type:</span>
                                        <p>{product.type || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">GST Percentage:</span>
                                        <p>{product.gst_percentage ? `${product.gst_percentage}%` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">HSN Code:</span>
                                        <p>{product.hsn_code || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {product.description && (
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold">Description</h3>
                                    <p className="mt-2 whitespace-pre-wrap">{product.description}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Show;
