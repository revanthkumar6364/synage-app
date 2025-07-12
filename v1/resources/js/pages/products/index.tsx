import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product, type Category } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { type FC, useState, useEffect } from 'react';

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

interface IndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
}

const Index: FC<IndexProps> = ({ products, categories, filters }) => {
    const { auth } = usePage<{ auth: any }>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    useEffect(() => {
        setSearchTerm(filters.search || '');
        setSelectedCategory(filters.category || '');
        // eslint-disable-next-line
    }, []); // Only run on mount

    // Add live search functionality
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params: any = { page: 1 };
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory) params.category = selectedCategory;
            router.get(route('products.index'), params, {
                preserveState: true,
                replace: true
            });
        }, 300); // 300ms delay to avoid too many requests

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory]);

    const formatPrice = (price: number | string | null | undefined): string => {
        if (!price) return 'N/A';
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `₹${numericPrice.toFixed(2)}`;
    };

    const formatProductType = (type: string | undefined): string => {
        if (!type) return '-';
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Remove debounced useEffect for search/category
    // Add a function to trigger search
    const handleSearch = () => {
        const params: any = { page: 1 };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        router.get(route('products.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === 'all' ? '' : value);
        // Optionally trigger search immediately on category change:
        const params: any = { page: 1 };
        if (searchTerm) params.search = searchTerm;
        if (value && value !== 'all') params.category = value;
        router.get(route('products.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handlePageChange = (page: number) => {
        const params: any = { page };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        router.get(route('products.index'), params, {
            preserveState: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedCategory('');
        router.get(route('products.index'), { page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Products</CardTitle>
                            {auth.can.products.create && (
                                <Link href={route('products.create')}>
                                    <Button>
                                        <PlusIcon className="h-4 w-4" /> Add Product
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                                    >
                                        <XIcon className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <div className="w-48">
                                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {(searchTerm || selectedCategory) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearSearch}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product, index) => {
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.sku || '-'}</TableCell>
                                            <TableCell>{product.category?.name || '-'}</TableCell>
                                            <TableCell>{formatProductType(product.product_type)}</TableCell>
                                            <TableCell>
                                                {product.min_price && product.max_price
                                                    ? `${formatPrice(product.min_price)} - ${formatPrice(product.max_price)}`
                                                    : formatPrice(product.price)}
                                            </TableCell>
                                            <TableCell>{product.unit || '-'}</TableCell>
                                            <TableCell>{product.brand || '-'}</TableCell>
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
                                                <div className="flex justify-end gap-2">
                                                    {product.can.view && (
                                                        <Link href={route('products.show', product.id)}>
                                                            <Button variant="outline" size="sm">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {product.can.update && (
                                                        <Link href={route('products.edit', product.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
