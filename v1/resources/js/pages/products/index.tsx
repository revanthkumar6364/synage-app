import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { type FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Products',
        href: '#',
    },
];

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number | string;
    min_price: number | null;
    max_price: number | null;
    unit: string;
    brand: string;
    type: string | null;
    gst_percentage: number | null;
    status: string;
    category: {
        name: string;
    };
}

interface IndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
    };
}

const Index: FC<IndexProps> = ({ products }) => {
    const formatPrice = (price: number | string | null | undefined): string => {
        if (!price) return 'N/A';
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `₹${numericPrice.toFixed(2)}`;
    };

    const handlePageChange = (page: number) => {
        router.get(route('products.index'), { page });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Products</CardTitle>
                            <Link href={route('products.create')}>
                                <Button>
                                    <PlusIcon className="h-4 w-4" /> Add Product
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>GST %</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.sku}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>
                                            {product.min_price && product.max_price
                                                ? `${formatPrice(product.min_price)} - ${formatPrice(product.max_price)}`
                                                : formatPrice(product.price)}
                                        </TableCell>
                                        <TableCell>{product.brand}</TableCell>
                                        <TableCell>{product.type || '-'}</TableCell>
                                        <TableCell>{product.gst_percentage ? `${product.gst_percentage}%` : '-'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    product.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={route('products.edit', product.id)}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <Pagination className="mt-4">
                            <PaginationContent>
                                {products.current_page > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(products.current_page - 1);
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === products.current_page}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {products.current_page < products.last_page && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(products.current_page + 1);
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Index;
