import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input as SearchInput } from "@/components/ui/input";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Edit Quotation', href: '#' },
];

interface QuotationItem {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    proposed_unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    notes: string | null;
}

interface SelectedProduct {
    id: number;
    quantity: number;
    unit_price: number;
    proposed_unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    notes: string;
    priceError?: string;
}

type ProductField = keyof SelectedProduct;

interface Props {
    quotation: {
        id: number;
        items: QuotationItem[];
        notes?: string;
        client_scope?: string;
    };
    products: Product[];
}

export default function QuotationProducts({ quotation, products }: Props) {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm({
        items: [] as any[],
        notes: quotation.notes || '',
        client_scope: quotation.client_scope || ''
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (quotation.items && quotation.items.length > 0) {
            const initialProducts = quotation.items.map(item => ({
                id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                proposed_unit_price: item.unit_price,
                discount_percentage: item.discount_percentage,
                tax_percentage: item.tax_percentage,
                notes: item.notes || ''
            }));
            setSelectedProducts(initialProducts);
        }
    }, [quotation]);

    useEffect(() => {
        const items = selectedProducts.map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            unit_price: product.unit_price,
            proposed_unit_price: product.proposed_unit_price,
            discount_percentage: product.discount_percentage,
            tax_percentage: product.tax_percentage,
            notes: product.notes
        }));
        form.setData('items', items);
    }, [selectedProducts]);

    const handleAddProduct = (product: Product) => {
        setSelectedProducts([...selectedProducts, {
            id: product.id,
            quantity: 1,
            unit_price: product.price,
            proposed_unit_price: product.price,
            discount_percentage: 0,
            tax_percentage: product.gst_percentage || 0,
            notes: ''
        }]);
        setIsDialogOpen(false);
        setSearchTerm('');
    };

    const handleRemoveProduct = (index: number) => {
        const newProducts = [...selectedProducts];
        newProducts.splice(index, 1);
        setSelectedProducts(newProducts);
    };

    const handleProductChange = (index: number, field: ProductField, value: string | number) => {
        const newProducts = [...selectedProducts];
        const product = products.find(p => p.id === newProducts[index].id);

        let finalValue: any = value;

        if (field === 'proposed_unit_price') {
            if (product) {
                const minPrice = product.min_price || 0;
                const maxPrice = product.max_price || Infinity;
                const numericValue = typeof value === 'string' ? parseFloat(value) : value;

                // Remove any previous error
                delete newProducts[index].priceError;

                // Check price limits and set error if outside range
                if (numericValue < minPrice || (maxPrice !== Infinity && numericValue > maxPrice)) {
                    newProducts[index].priceError = `Price must be between ₹${minPrice} and ₹${maxPrice}`;
                }

                finalValue = numericValue;
            }
        } else if (field === 'quantity') {
            finalValue = typeof value === 'string' ? parseInt(value) : value;
        }

        newProducts[index] = {
            ...newProducts[index],
            [field]: finalValue
        };
        setSelectedProducts(newProducts);
    };

    const calculateSubtotal = (product: any) => {
        const subtotal = product.quantity * product.proposed_unit_price;
        const discountAmount = (subtotal * product.discount_percentage) / 100;
        const taxAmount = ((subtotal - discountAmount) * product.tax_percentage) / 100;
        return (subtotal - discountAmount + taxAmount).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            toast.error("Please add at least one product");
            return;
        }

        // Check for any price errors before submitting
        const hasErrors = selectedProducts.some(product => {
            const productDetails = products.find(p => p.id === product.id);
            if (productDetails) {
                const minPrice = productDetails.min_price || 0;
                const maxPrice = productDetails.max_price || Infinity;
                const proposedPrice = parseFloat(product.proposed_unit_price);
                return proposedPrice < minPrice || (maxPrice !== Infinity && proposedPrice > maxPrice);
            }
            return false;
        });

        if (hasErrors) {
            toast.error("Please fix the price errors before submitting");
            return;
        }

        form.post(route('quotations.update.products', quotation.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Quotation products updated successfully");
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([key, value]) => {
                    toast.error(`${key}: ${value}`);
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Quotation Products" />
            <Toaster />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex gap-2">
                    <Button
                        variant='outline'
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
                        variant='default'
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
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Edit Products</CardTitle>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>Add Product</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Product</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <SearchInput
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {filteredProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAddProduct(product)}
                                                >
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.description}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div>₹{product.price}</div>
                                                        <div className="text-sm text-gray-500">GST: {product.gst_percentage}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Id</TableHead>
                                        <TableHead>Product Description</TableHead>
                                        <TableHead>HSN Code</TableHead>
                                        <TableHead>Unit Price (₹)</TableHead>
                                        <TableHead>Proposed Price (₹)</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total W/O GST (₹)</TableHead>
                                        <TableHead>GST %</TableHead>
                                        <TableHead>Total W/ GST (₹)</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProducts.map((product, index) => {
                                        const productDetails = products.find(p => p.id === product.id);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {productDetails?.id}
                                                </TableCell>
                                                <TableCell>
                                                    {productDetails?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {productDetails?.hsn_code}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-28"
                                                        value={product.unit_price}
                                                        readOnly
                                                        disabled
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            className={`w-28 ${product.priceError ? 'border-red-500' : ''}`}
                                                            value={product.proposed_unit_price}
                                                            onChange={(e) => handleProductChange(index, 'proposed_unit_price', e.target.value)}
                                                        />
                                                        {product.priceError && (
                                                            <div className="text-xs text-red-500">{product.priceError}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="w-20"
                                                        value={product.quantity}
                                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    ₹{(product.quantity * product.proposed_unit_price).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {product.tax_percentage}%
                                                </TableCell>
                                                <TableCell>
                                                    ₹{calculateSubtotal(product)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => handleRemoveProduct(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <div className="grid grid-cols-2 gap-4 my-4">
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Enter notes..."
                                        className="min-h-[100px]"
                                        value={form.data.notes}
                                        onChange={e => form.setData('notes', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_scope">Client Scope</Label>
                                    <Textarea
                                        id="client_scope"
                                        placeholder="Enter client scope..."
                                        className="min-h-[100px]"
                                        value={form.data.client_scope}
                                        onChange={e => form.setData('client_scope', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                                <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
