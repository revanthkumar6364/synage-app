import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreVertical, PencilIcon, PlusIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function CategoriesIndex({ categories, filters, statuses }: {
    categories: any;
    filters: any;
    statuses: Record<string, string>;
}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleStatusChange = (value: string) => {
        setData('status', value);
        applyFilters();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('search', e.target.value);
    };

    const applyFilters = () => {
        router.get(route('categories.index'), {
            search: data.search,
            status: data.status
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (category: any) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCategory) {
            router.delete(route('categories.destroy', selectedCategory.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedCategory(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Categories</CardTitle>
                            <Link href={route('categories.create')}>
                                <Button>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Create Category
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-4 space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <Input
                                    placeholder="Search by name"
                                    value={data.search}
                                    onChange={handleSearchChange}
                                    className="md:max-w-sm"
                                />
                                <Select value={data.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="md:w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit">
                                    <SearchIcon className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                            </div>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.map((category: any) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>{category.parent?.name || '-'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    category.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {category.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(category.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div className="inline-flex">
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {category.can.edit && (
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('categories.edit', category.id)}>
                                                                <PencilIcon className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                    {category.can.delete && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(category)}
                                                            className="text-red-600"
                                                        >
                                                            <TrashIcon className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {categories.meta.links.map((link: any, i: number) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationPrevious
                                                    href={link.url}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }

                                    if (link.label.includes('Next')) {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationNext
                                                    href={link.url}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }

                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                                className={link.active ? 'bg-primary text-primary-foreground' : ''}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot
                                be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
