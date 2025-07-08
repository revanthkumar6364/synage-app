import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
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
    product: Product;
}

const Show: FC<ShowProps> = ({ product }) => {
    const formatPrice = (price: number | null | undefined): string => {
        if (!price) return 'N/A';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `₹${numPrice.toFixed(2)}`;
    };

    const formatProductType = (type: string | undefined): string => {
        if (!type) return 'N/A';
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
                            {/* Basic Information */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Name:</span>
                                        <p className="font-medium">{product.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">SKU:</span>
                                        <p>{product.sku || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Category:</span>
                                        <p>{product.category?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Product Type:</span>
                                        <p>{formatProductType(product.product_type)}</p>
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

                            {/* Pricing Information */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Pricing</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Base Price:</span>
                                        <p className="font-medium">{formatPrice(product.price)}</p>
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
                                    <div>
                                        <span className="text-sm text-gray-500">Unit:</span>
                                        <p>{product.unit || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                                <div className="space-y-3">
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
                                    <div>
                                        <span className="text-sm text-gray-500">Pixel Pitch (If applicable):</span>
                                        <p>{product.pixel_pitch ? `${product.pixel_pitch} mm` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Refresh Rate (If applicable):</span>
                                        <p>{product.refresh_rate ? `${product.refresh_rate} Hz` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Cabinet Type (If applicable):</span>
                                        <p>{product.cabinet_type || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Dimensions</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Size:</span>
                                        <p>{product.size || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Size (Inches):</span>
                                        <p>{product.size_inch || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Height (mm):</span>
                                        <p>{product.h_mm || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Width (mm):</span>
                                        <p>{product.w_mm || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Up to Pixels:</span>
                                        <p>{product.upto_pix || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Unit Size (Calculated) */}
                            {product.unit_size && (
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold text-lg mb-3">Unit Size</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Width (mm):</span>
                                            <p>{product.unit_size.width_mm}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Height (mm):</span>
                                            <p>{product.unit_size.height_mm}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Width (ft):</span>
                                            <p>{product.unit_size.width_ft}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Height (ft):</span>
                                            <p>{product.unit_size.height_ft}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap">{product.description}</p>
                                    </div>
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
