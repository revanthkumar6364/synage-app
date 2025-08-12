import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Toaster, toast } from 'sonner';
import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { MessageCircle, Facebook, Instagram, Youtube, Linkedin, Globe } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'View Quotation', href: '#' },
];

interface Props {
    quotation: any;
    commonFiles: QuotationMedia[];
    quotationFiles: QuotationMedia[];
}

interface QuotationMedia {
    id: number;
    name: string;
    full_url: string;
}

interface FormData {
    [key: string]: string | undefined;
    status: string;
    rejection_reason: string;
}

export default function Show({ quotation, commonFiles, quotationFiles }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const form = useForm<FormData>({
        status: 'pending',
        rejection_reason: '',
    });

    const getStatusBadgeStyle = (status: string) => {
        const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case 'draft':
                return `${baseStyle} bg-muted text-muted-foreground`;
            case 'pending':
                return `${baseStyle} bg-yellow-500 text-white`;
            case 'approved':
                return `${baseStyle} bg-green-500 text-white`;
            case 'rejected':
                return `${baseStyle} bg-red-500 text-white`;
            default:
                return `${baseStyle} bg-muted text-muted-foreground`;
        }
    };

    const handleApprove = () => {
        setLoading(true);
        form.post(route('quotations.approve', quotation.id), {
            onSuccess: () => {
                toast.success('Quotation approved successfully');
                router.visit(route('quotations.index'));
            },
            onError: (errors: any) => {
                toast.error('Failed to approve quotation');
                console.error('Form errors:', errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const handleReject = () => {
        if (!comments.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setLoading(true);
        form.setData('rejection_reason', comments);
        form.post(route('quotations.reject', quotation.id), {
            onSuccess: () => {
                toast.success('Quotation cancelled successfully');
                router.visit(route('quotations.index'));
            },
            onError: (errors: any) => {
                toast.error('Failed to cancel quotation');
                console.error('Form errors:', errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const calculateSubtotal = (item: any) => {
        const proposedPrice = parseFloat(item.proposed_unit_price) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        return proposedPrice * quantity;
    };

    const calculateDiscountAmount = (item: any) => {
        const subtotal = calculateSubtotal(item);
        const discountPercentage = parseFloat(item.discount_percentage) || 0;
        return subtotal * (discountPercentage / 100);
    };

    const calculateTaxableAmount = (item: any) => {
        const subtotal = calculateSubtotal(item);
        const discountAmount = calculateDiscountAmount(item);
        return subtotal - discountAmount;
    };

    const calculateTax = (item: any) => {
        const taxableAmount = calculateTaxableAmount(item);
        const taxPercentage = parseFloat(item.tax_percentage) || 0;
        return taxableAmount * (taxPercentage / 100);
    };

    const calculateTotal = (item: any) => {
        const taxableAmount = calculateTaxableAmount(item);
        const tax = calculateTax(item);
        return taxableAmount + tax;
    };

    const totalSubtotal = quotation.items.reduce((sum: number, item: any) => sum + calculateSubtotal(item), 0);
    const totalTax = quotation.items.reduce((sum: number, item: any) => sum + calculateTax(item), 0);
    const grandTotal = totalSubtotal + totalTax;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Quotation" />
            <Toaster position="top-right" />

            <div className="container mx-auto py-6 space-y-6">
                {/* Approval Actions - moved to top */}
                {quotation.status === 'pending' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Approval Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add comments (required for cancellation)"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <div className="flex justify-end gap-4">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={loading}
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        {loading ? 'Processing...' : 'Approve Quotation'}
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={loading || !comments.trim()}
                                        variant="destructive"
                                    >
                                        {loading ? 'Processing...' : 'Cancel Quotation'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                        <div>
                            <CardTitle className="text-2xl">View Quotation</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-muted-foreground">Reference: {quotation.reference}</p>
                                <div className={getStatusBadgeStyle(quotation.status)}>
                                    {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {quotation.status === 'draft' && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(route('quotations.edit', quotation.id))}
                                >
                                    Edit
                                </Button>
                            )}
                            {(quotation.status === 'pending' || quotation.status === 'approved') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setLoading(true);
                                        router.post(route('quotations.create-version', quotation.id), {}, {
                                            onSuccess: () => {
                                                toast.success('New version created successfully');
                                            },
                                            onError: () => {
                                                toast.error('Failed to create new version');
                                            },
                                            onFinish: () => {
                                                setLoading(false);
                                            }
                                        });
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Make New Version'}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => window.open(route('quotations.pdf', quotation.id), '_blank')}
                            >
                                Download PDF
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg">
                            <div ref={contentRef} className="w-[210mm] mx-auto bg-background p-8 shadow-sm">
                                {/* Active Print Settings */}
                                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-6">
                                    <h4 className="text-sm font-medium text-primary mb-2">Active Print Settings:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {quotation.show_hsn_code ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✓ HSN Code
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                ✗ HSN Code
                                            </span>
                                        )}
                                        {quotation.show_no_of_pixels ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✓ Number of Pixels
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                ✗ Number of Pixels
                                            </span>
                                        )}
                                        {quotation.show_billing_in_print ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✓ Billing Address
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                ✗ Billing Address
                                            </span>
                                        )}
                                        {quotation.show_shipping_in_print ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✓ Shipping Address
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                ✗ Shipping Address
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Header with Logo and Company Info */}
                                <div className="flex items-start justify-between pb-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="flex flex-col items-start gap-3">
                                            <img src={'/images/logo.png'} alt="Radiant Synage Logo" className="h-14 object-contain" />
                                            <div className="text-sm font-medium text-primary">
                                                Reference: {quotation.reference}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-lg font-semibold text-primary mb-2">Radiant Synage Pvt Ltd</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            317, 2nd Floor, East of NGEF Layout<br />
                                            Kasthuri Nagar, Bangalore - 560 043
                                        </p>
                                        <p className="text-sm text-primary hover:underline mt-2">
                                            <a href="mailto:murali.krishna@radiantsynage.com">
                                                murali.krishna@radiantsynage.com
                                            </a>
                                        </p>
                                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                            <p><span className="font-medium">GSTIN/UIN:</span> 29AAHCR7203C1ZJ</p>
                                            <p><span className="font-medium">CIN:</span> U74999KA2016PTC092481</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />



                                {/* Title and Date Section */}
                                <div className="my-8 space-y-6">
                                    <div className="flex items-center justify-end">
                                        <div className="text-sm text-muted-foreground">
                                            Date: {quotation.estimate_date ? new Date(quotation.estimate_date).toLocaleDateString('en-IN') : ''}
                                        </div>
                                    </div>

                                    <div className="text-center space-y-3">
                                        <h2 className="text-2xl font-semibold text-primary tracking-tight">{quotation.title}</h2>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Kind Attn: {quotation.account_contact?.name}
                                                <br />
                                                {quotation.account_contact?.role}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{quotation.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Billing and Shipping */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3 bg-muted/30 p-5 rounded-lg border border-border/50">
                                        <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">Bill To</h3>
                                        <div className="text-sm space-y-2">
                                            <p className="font-medium text-foreground">{quotation.account?.business_name}</p>
                                            <div className="text-muted-foreground space-y-1">
                                                <p>{quotation.billing_address}</p>
                                                <p>{quotation.billing_city}, {quotation.billing_location} {quotation.billing_zip_code}</p>
                                                <p className="font-medium mt-2">GST NO: {quotation.account?.gst_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-muted/30 p-5 rounded-lg border border-border/50">
                                        <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">Ship To</h3>
                                        <div className="text-sm space-y-2">
                                            <p className="font-medium text-foreground">{quotation.account_contact?.name}</p>
                                            <div className="text-muted-foreground space-y-1">
                                                <p>{quotation.shipping_address}</p>
                                                <p>{quotation.shipping_city}, {quotation.shipping_location} {quotation.shipping_zip_code}</p>
                                                <p className="font-medium mt-2">GST NO: {quotation.account?.gst_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Product Specifications */}
                                <div className="space-y-6">
                                    {/* <div className="bg-muted/30 p-5 rounded-lg border border-border/50 space-y-4">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium text-primary uppercase tracking-wide">Size available at location</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {quotation.available_size_width_mm} mm W x {quotation.available_size_height_mm} mm H
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium text-primary uppercase tracking-wide">Resolution</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    512 x {Number(quotation.proposed_size_width_mm)} = {Number(quotation.proposed_size_width_mm) * 512} Pixels
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">Proposed Size</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {quotation.proposed_size_width_mm} mm W x {quotation.proposed_size_height_mm} mm H |
                                                {quotation.proposed_size_width_ft} ft W x {quotation.proposed_size_height_ft} ft H =
                                                {quotation.proposed_size_sqft} Sq ft |
                                                {(() => {
                                                    const width = parseInt(quotation.proposed_size_width_mm);
                                                    const height = parseInt(quotation.proposed_size_height_mm);
                                                    const rows = Math.ceil(height/160);
                                                    const cols = Math.ceil(width/320);
                                                    return `${rows} R x ${cols} C of 320 W x 160 H mm`;
                                                })()}
                                            </p>
                                        </div>
                                    </div> */}

                                    {/* Per-Item Product Specifications for LED Products */}
                                    {quotation.items.map((item: any, index: number) => {
                                        const isIndoorOutdoor = item.product && (item.product.product_type === 'indoor_led' || item.product.product_type === 'outdoor_led');

                                        if (!isIndoorOutdoor) return null;

                                        // Use per-item available size if present, else fallback to main quotation
                                        const availableWidthMm = item.available_size_width_mm ? parseFloat(item.available_size_width_mm) : parseFloat(quotation.available_size_width_mm || '0');
                                        const availableHeightMm = item.available_size_height_mm ? parseFloat(item.available_size_height_mm) : parseFloat(quotation.available_size_height_mm || '0');
                                        const availableWidthFt = availableWidthMm / 304.8;
                                        const availableHeightFt = availableHeightMm / 304.8;
                                        const availableSqft = availableWidthFt * availableHeightFt;

                                        // Get product unit size
                                        const unitWidthMm = item.product.unit_size?.width_mm || item.product.w_mm || 320;
                                        const unitHeightMm = item.product.unit_size?.height_mm || item.product.h_mm || 160;

                                        // Use the item's selected quantity
                                        const quantity = parseFloat(item.quantity) || 0;
                                        const boxesInWidth = unitWidthMm > 0 ? Math.floor(availableWidthMm / unitWidthMm) : 0;
                                        const boxesInHeight = unitHeightMm > 0 ? Math.floor(availableHeightMm / unitHeightMm) : 0;
                                        const maxPossibleBoxes = boxesInWidth * boxesInHeight;

                                        // Proposed width/height based on selected quantity (fill rows first)
                                        const proposedWidthMm = boxesInWidth > 0 ? unitWidthMm * Math.min(boxesInWidth, quantity) : 0;
                                        const proposedHeightMm = boxesInWidth > 0 ? unitHeightMm * Math.ceil(quantity / Math.max(boxesInWidth, 1)) : 0;
                                        const proposedWidthFt = proposedWidthMm / 304.8;
                                        const proposedHeightFt = proposedHeightMm / 304.8;
                                        const proposedSqft = proposedWidthFt * proposedHeightFt;

                                        return (
                                            <div key={item.id} className="bg-muted/30 p-5 rounded-lg border border-border/50 space-y-4">
                                                <h3 className="text-lg font-semibold text-primary">Product Specifications - {item.product.name}</h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">SIZE AVAILABLE AT LOCATION</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {availableWidthMm.toFixed(2)} mm W x {availableHeightMm.toFixed(2)} mm H
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">PROPOSED SIZE</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {proposedWidthMm.toFixed(2)} mm W x {proposedHeightMm.toFixed(2)} mm H |
                                                                {proposedWidthFt.toFixed(2)} ft W x {proposedHeightFt.toFixed(2)} ft H =
                                                                {proposedSqft.toFixed(2)} Sq ft |
                                                                {boxesInHeight} R x {boxesInWidth} C of {unitWidthMm} W x {unitHeightMm} H mm
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">RESOLUTION</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {Math.round(proposedWidthMm * 512)} Pixels
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">BRAND NAME</h4>
                                                                <p className="text-sm text-muted-foreground">{item.product.brand || '-'}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">PIXEL PITCH</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.product.pixel_pitch ? `${item.product.pixel_pitch} mm` : 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">REFRESH RATE</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.product.refresh_rate ? `${item.product.refresh_rate} Hz` : 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">CABINET</h4>
                                                                <p className="text-sm text-muted-foreground">{item.product.cabinet_type || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="w-[40px] text-center">#</TableHead>
                                                    <TableHead>Product Description</TableHead>
                                                    <TableHead>HSN</TableHead>
                                                    <TableHead className="text-right">Unit</TableHead>
                                                    <TableHead className="text-right">Unit Price</TableHead>
                                                    <TableHead className="text-right">Tax %</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {quotation.items.map((item: any, index: number) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <p className="font-medium">{item.product.name}</p>
                                                                {item.notes && (
                                                                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.product.hsn_code}</TableCell>
                                                        <TableCell className="text-right">
                                                            {item.available_size_width_mm && item.available_size_height_mm
                                                                ? `${item.quantity} sqft`
                                                                : `${item.quantity} qty`
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(item.proposed_unit_price || 0)}</TableCell>
                                                        <TableCell className="text-right">{item.tax_percentage}%</TableCell>
                                                        <TableCell className="text-right font-medium">{formatCurrency(calculateTotal(item))}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="w-72 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal:</span>
                                                <span className="font-medium">{formatCurrency(totalSubtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax Total:</span>
                                                <span className="font-medium">{formatCurrency(totalTax)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-base font-medium">
                                                <span>Total Amount:</span>
                                                <span className="text-primary">{formatCurrency(grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                                            <span className="font-medium">Note:</span> {quotation.notes}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Terms and Conditions */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-primary">Terms and Conditions</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Taxes</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.taxes_terms}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Warranty</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.warranty_terms}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Electrical Points and Installation</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.electrical_terms}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Delivery Terms</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.delivery_terms}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Payment Terms</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.payment_terms}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Footer */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">For any information or clarifications</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-sm">For Radiant Synage Pvt Ltd.,</p>
                                            <p className="text-sm font-semibold text-primary">{auth.user.name}</p>
                                            <p className="text-sm font-semibold text-primary">EMAIL: {auth.user.email}</p>
                                            <p className="text-sm font-semibold text-primary">MOBILE: {auth.user.mobile}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Generated on</p>
                                            <p className="text-sm">{new Date().toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                <div className="flex items-center gap-4 mt-6">
                                    {/* WhatsApp */}
                                    <a href={`https://wa.me/${auth.user.mobile}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-green-600 hover:text-green-700 text-xl">
                                        <MessageCircle className="h-6 w-6 text-green-600 hover:text-green-700" />
                                    </a>
                                    {/* Facebook */}
                                    <a href="https://www.facebook.com/radiantsynage" target="_blank" rel="noopener noreferrer" title="Facebook">
                                        <Facebook className="h-6 w-6 text-blue-600 hover:text-blue-800" />
                                    </a>
                                    {/* Instagram */}
                                    <a href="https://www.instagram.com/radiant_synage/" target="_blank" rel="noopener noreferrer" title="Instagram">
                                        <Instagram className="h-6 w-6 text-pink-500 hover:text-pink-700" />
                                    </a>
                                    {/* YouTube */}
                                    <a href="https://youtube.com/@radiantsynage6751?si=1IP2exl9OX5rY7i9" target="_blank" rel="noopener noreferrer" title="YouTube">
                                        <Youtube className="h-6 w-6 text-red-600 hover:text-red-800" />
                                    </a>
                                    {/* LinkedIn */}
                                    <a href="https://www.linkedin.com/company/radiant-synage-pvt-ltd/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                        <Linkedin className="h-6 w-6 text-blue-700 hover:text-blue-900" />
                                    </a>
                                    {/* Website */}
                                    <a href="https://radiantsynage.com" target="_blank" rel="noopener noreferrer" title="Website">
                                        <Globe className="h-6 w-6 text-gray-700 hover:text-black" />
                                    </a>
                                </div>

                                {/* Attachments */}
                                {(commonFiles.length > 0 || quotationFiles.length > 0) && (
                                    <div className="mt-8 space-y-6">
                                        <Separator />
                                        {commonFiles.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <img src={'/images/logo.png'} alt="Radiant Synage Logo" className="h-6 object-contain opacity-30" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {commonFiles.map((file) => (
                                                        <img
                                                            key={file.id}
                                                            src={file.full_url}
                                                            alt={file.name}
                                                            className="rounded-lg shadow-sm h-30 w-30 object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {quotationFiles.length > 0 && (
                                            <>
                                                <Separator />
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <img src={'/images/logo.png'} alt="Radiant Synage Logo" className="h-6 object-contain opacity-30" />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {quotationFiles.map((file) => (
                                                            <img
                                                                key={file.id}
                                                                src={file.full_url}
                                                                alt={file.name}
                                                                className="rounded-lg shadow-sm h-100 w-100 object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>


                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(route('quotations.index'))}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
