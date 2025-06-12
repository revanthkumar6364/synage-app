import { Head, Link, router, usePage } from '@inertiajs/react';
import { QuotationMedia } from '@/types/index';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatBytes } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotation Media', href: '/quotation-media' },
];

interface Props {
    media: {
        data: QuotationMedia[];
        current_page: number;
        per_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
}

export default function Index({ media, filters, categories }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        applyFilters();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const applyFilters = () => {
        router.get(
            route('quotation-media.index'),
            { search, category },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = (id: number) => {
        router.delete(route('quotation-media.destroy', id), {
            onSuccess: () => {
                toast.success('Media deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete media');
            },
        });
    };

    const renderPagination = () => {
        if (media.last_page <= 1) return null;

        const pages = [];
        for (let i = 1; i <= media.last_page; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            router.get(
                                route('quotation-media.index'),
                                { page: i, search, category },
                                { preserveState: true, preserveScroll: true }
                            );
                        }}
                        isActive={i === media.current_page}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return (
            <div className="mt-4">
                <div className="text-sm text-gray-500 mb-2">
                    Showing {media.from} to {media.to} of {media.total} results
                </div>
                <Pagination>
                    <PaginationContent>
                        {media.current_page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(
                                            route('quotation-media.index'),
                                            { page: media.current_page - 1, search, category },
                                            { preserveState: true, preserveScroll: true }
                                        );
                                    }}
                                />
                            </PaginationItem>
                        )}
                        {pages}
                        {media.current_page < media.last_page && (
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(
                                            route('quotation-media.index'),
                                            { page: media.current_page + 1, search, category },
                                            { preserveState: true, preserveScroll: true }
                                        );
                                    }}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotation Media" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Quotation Media</CardTitle>
                            {auth.can.quotationMedia.create && (
                                <Link href={route('quotation-media.create')}>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add New Media
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-4 flex gap-4">
                            <Input
                                placeholder="Search media..."
                                value={search}
                                onChange={handleSearchChange}
                                className="max-w-sm"
                            />
                            <Select value={category} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categories).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                <SearchIcon className="mr-2 h-4 w-4" />Search
                            </Button>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {media.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="relative group">
                                                <img
                                                    src={item.full_url}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <a
                                                    href={item.full_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded"
                                                >
                                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium">
                                                        View
                                                    </span>
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {categories[item.category]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatBytes(item.file_size)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.is_active ? "outline" : "secondary"}
                                            >
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {item.can.update && (
                                                <Link
                                                    href={route('quotation-media.edit', item.id)}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                            {item.can.delete && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">
                                                            <TrashIcon className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Media</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this media? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {media.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No media found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {renderPagination()}
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </AppLayout>
    );
}

