import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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
    available_size_width_mm?: number | '';
    available_size_height_mm?: number | '';
}

interface SelectedProduct {
    id: number;
    quantity: number;
    unit_price: number;
    proposed_unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    notes: string;
    available_size_width_mm?: number | '';
    available_size_height_mm?: number | '';
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
    const { auth } = usePage<{ auth: any }>().props;
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
                proposed_unit_price: item.proposed_unit_price || item.unit_price,
                discount_percentage: item.discount_percentage,
                tax_percentage: item.tax_percentage,
                notes: item.notes || '',
                available_size_width_mm: item.available_size_width_mm ?? '',
                available_size_height_mm: item.available_size_height_mm ?? ''
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
            notes: product.notes,
            available_size_width_mm: product.available_size_width_mm,
            available_size_height_mm: product.available_size_height_mm,
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

    const handleProductChange = (index: number, field: ProductField | 'available_size_width_mm' | 'available_size_height_mm', value: string | number) => {
        const newProducts = [...selectedProducts];
        const product = products.find(p => p.id === newProducts[index].id);

        let finalValue: any = value;

        if (field === 'proposed_unit_price') {
            if (product) {
                const numericValue = typeof value === 'string' ? parseFloat(value) : value;
                const minPrice = product.min_price || 0;

                // Remove any previous error
                delete newProducts[index].priceError;

                // For managers, show suggested range but don't enforce validation
                if (auth.user.role === 'manager') {
                    if (numericValue < minPrice) {
                        newProducts[index].priceError = `Suggested minimum: ₹${minPrice} (You can set any price as manager)`;
                    }
                } else {
                    // For other users, enforce validation
                    if (numericValue < minPrice) {
                        newProducts[index].priceError = `Price must not be less than ₹${minPrice}`;
                    }
                }

                finalValue = numericValue;
            }
        } else if (field === 'quantity') {
            finalValue = typeof value === 'string' ? parseInt(value) : value;
        } else if (field === 'available_size_width_mm' || field === 'available_size_height_mm') {
            finalValue = value === '' ? '' : parseFloat(value as string);
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

        // Check for any price errors before submitting (only for non-manager users)
        if (auth.user.role !== 'manager') {
            const hasErrors = selectedProducts.some(product => {
                const productDetails = products.find(p => p.id === product.id);
                if (productDetails) {
                    const minPrice = productDetails.min_price || 0;
                    const proposedPrice = parseFloat(product.proposed_unit_price.toString());
                    return proposedPrice < minPrice;
                }
                return false;
            });

            if (hasErrors) {
                toast.error("Please fix the price errors before submitting");
                return;
            }
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

    const handleSaveAndPreview = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            toast.error("Please add at least one product");
            return;
        }

        // Check for any price errors before submitting (only for non-manager users)
        if (auth.user.role !== 'manager') {
            const hasErrors = selectedProducts.some(product => {
                const productDetails = products.find(p => p.id === product.id);
                if (productDetails) {
                    const minPrice = productDetails.min_price || 0;
                    const proposedPrice = parseFloat(product.proposed_unit_price.toString());
                    return proposedPrice < minPrice;
                }
                return false;
            });

            if (hasErrors) {
                toast.error("Please fix the price errors before submitting");
                return;
            }
        }

        form.post(route('quotations.update.products', quotation.id) + '?action=save_and_preview', {
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
                                        <DialogDescription>
                                            Search and select products to add to this quotation. Click on a product to add it to the list.
                                        </DialogDescription>
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
                                                        <div className="text-sm text-gray-500">
                                                            {(() => {
                                                                switch (product.product_type) {
                                                                    case 'indoor_led':
                                                                        return product.description + ' ' + 'Indoor LED';
                                                                    case 'outdoor_led':
                                                                        return product.cabinet_type + ' ' + 'Outdoor LED';
                                                                    case 'kiosk':
                                                                        return product.description + ' ' + 'Kiosk';
                                                                    case 'controllers':
                                                                        return product.description + ' ' + 'Controllers';
                                                                    case 'tv_screens':
                                                                        return product.description + ' ' + 'TV Screens';
                                                                    default:
                                                                        return product.product_type;
                                                                }
                                                            })()}
                                                            {/* Show item box size for indoor/outdoor */}
                                                            {((product.product_type === 'indoor_led' || product.product_type === 'outdoor_led') && (product.unit_size?.width_mm && product.unit_size?.height_mm)) && (
                                                                <> • {product.unit_size.width_mm}×{product.unit_size.height_mm}mm</>
                                                            )}
                                                        </div>
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
                            {auth.user.role === 'manager' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <div className="text-blue-800 text-sm">
                                            <strong>Manager Note:</strong> You can set any price for products. The system will show suggested price ranges (₹min - ₹max) when you enter prices outside the normal range, but you are not restricted by these limits.
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead rowSpan={2}>Product Info</TableHead>

                                        <TableHead colSpan={2} className="text-center">Available size at location</TableHead>
                                        <TableHead rowSpan={2}>Unit Price</TableHead>
                                        <TableHead rowSpan={2}>Proposed Price</TableHead>
                                        <TableHead rowSpan={2}>Qty</TableHead>
                                        <TableHead rowSpan={2}>Total W/O GST (₹)</TableHead>
                                        <TableHead rowSpan={2}>GST %</TableHead>
                                        <TableHead rowSpan={2}>Total (₹)</TableHead>
                                        <TableHead rowSpan={2}>Action</TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className="text-center">Width (mm)</TableHead>
                                        <TableHead className="text-center">Height (mm)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProducts.map((product, index) => {
                                        const productDetails = products.find(p => p.id === product.id);
                                        const isIndoorOutdoor = productDetails && (productDetails.product_type === 'indoor_led' || productDetails.product_type === 'outdoor_led');
                                        // Calculation logic for proposed size and quantity
                                        let calc = null;
                                        if (isIndoorOutdoor) {
                                            // Use per-item available size if present, else fallback to product unit size
                                            const availableWidthMm = product.available_size_width_mm ? parseFloat(product.available_size_width_mm as any) : 0;
                                            const availableHeightMm = product.available_size_height_mm ? parseFloat(product.available_size_height_mm as any) : 0;
                                            const unitWidthMm = productDetails.unit_size?.width_mm || productDetails.w_mm || 320;
                                            const unitHeightMm = productDetails.unit_size?.height_mm || productDetails.h_mm || 160;
                                            const boxesInWidth = unitWidthMm > 0 ? Math.floor(availableWidthMm / unitWidthMm) : 0;
                                            const boxesInHeight = unitHeightMm > 0 ? Math.floor(availableHeightMm / unitHeightMm) : 0;
                                            const maxPossibleBoxes = boxesInWidth * boxesInHeight;
                                            const proposedWidthMm = unitWidthMm * boxesInWidth;
                                            const proposedHeightMm = unitHeightMm * (boxesInWidth > 0 ? Math.ceil(maxPossibleBoxes / boxesInWidth) : 0);
                                            const proposedWidthFt = (proposedWidthMm / 304.8).toFixed(2);
                                            const proposedHeightFt = (proposedHeightMm / 304.8).toFixed(2);
                                            const proposedSqft = ((proposedWidthMm / 304.8) * (proposedHeightMm / 304.8)).toFixed(2);
                                            calc = {
                                                proposedWidthMm: proposedWidthMm.toFixed(2),
                                                proposedHeightMm: proposedHeightMm.toFixed(2),
                                                proposedWidthFt,
                                                proposedHeightFt,
                                                proposedSqft,
                                                maxPossibleBoxes
                                            };
                                        }
                                        // Calculate subtotal (W/O GST)
                                        const subtotal = product.quantity * product.proposed_unit_price;
                                        return (
                                            <React.Fragment key={index}>
                                                <TableRow>
                                                    <TableCell style={{ minWidth: 180 }}>
                                                        <div style={{ fontWeight: 600 }}>{productDetails?.name}</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>Brand: {productDetails?.brand || '-'}</div>
                                                        <div style={{ fontSize: 12, color: '#888' }}>HSN: {productDetails?.hsn_code || '-'}</div>
                                                    </TableCell>

                                                    {isIndoorOutdoor ? (
                                                        <>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="w-20"
                                                                    placeholder="Width (mm)"
                                                                    value={product.available_size_width_mm ?? ''}
                                                                    onChange={e => handleProductChange(index, 'available_size_width_mm', e.target.value)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="w-20"
                                                                    placeholder="Height (mm)"
                                                                    value={product.available_size_height_mm ?? ''}
                                                                    onChange={e => handleProductChange(index, 'available_size_height_mm', e.target.value)}
                                                                />
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>-</TableCell>
                                                            <TableCell>-</TableCell>
                                                        </>
                                                    )}
                                                    <TableCell>
                                                        <div style={{ minWidth: 80 }}>
                                                            ₹{Number(product.unit_price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            className={`w-32 ${product.priceError ? 'border-red-500' : ''}`}
                                                            value={product.proposed_unit_price}
                                                            onChange={(e) => handleProductChange(index, 'proposed_unit_price', e.target.value)}
                                                            placeholder="Proposed"
                                                        />
                                                        {product.priceError && (
                                                            <div className="mt-1 w-48 text-xs text-red-500">
                                                                {product.priceError}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            className="w-16"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                            placeholder="Qty"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ minWidth: 100 }}>
                                                            ₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ minWidth: 50 }}>{product.tax_percentage}%</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ minWidth: 100 }}>
                                                            ₹{(product.quantity * product.proposed_unit_price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                        </div>
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
                                                {/* Show calculated proposed size and quantity below the row for indoor/outdoor */}
                                                {isIndoorOutdoor && calc && (
                                                    <tr>
                                                        <td colSpan={10} style={{ background: '#f9f9f9', padding: '8px 16px' }}>
                                                            <div style={{ fontSize: 13, color: '#333' }}>
                                                                <strong>Item Box Size:</strong> {productDetails.unit_size?.width_mm || productDetails.w_mm || 320} mm W × {productDetails.unit_size?.height_mm || productDetails.h_mm || 160} mm H
                                                                &nbsp;|&nbsp;
                                                                <strong>Proposed Size:</strong> {calc.proposedWidthMm} mm W × {calc.proposedHeightMm} mm H
                                                                &nbsp;|&nbsp; {calc.proposedWidthFt} ft × {calc.proposedHeightFt} ft = {calc.proposedSqft} sq.ft
                                                                &nbsp;|&nbsp; <strong>Calculated Quantity:</strong> {calc.maxPossibleBoxes} units
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
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
                                <Button type="button" onClick={handleSaveAndPreview} disabled={form.processing}>
                                    {form.processing ? 'Saving...' : 'Save and Preview'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
