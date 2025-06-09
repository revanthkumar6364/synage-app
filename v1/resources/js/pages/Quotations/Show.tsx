import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Toaster, toast } from 'sonner';
import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'View Quotation', href: '#' },
];

interface Props {
    quotation: any;
    logo: QuotationMedia | null;
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

export default function Show({ quotation, logo, commonFiles, quotationFiles }: Props) {
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
                toast.success('Quotation rejected successfully');
                router.visit(route('quotations.index'));
            },
            onError: (errors: any) => {
                toast.error('Failed to reject quotation');
                console.error('Form errors:', errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const calculateSubtotal = (item: any) => {
        const unitPrice = parseFloat(item.unit_price) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        return unitPrice * quantity;
    };

    const calculateTax = (item: any) => {
        const subtotal = calculateSubtotal(item);
        const taxPercentage = parseFloat(item.tax_percentage) || 0;
        return subtotal * (taxPercentage / 100);
    };

    const calculateTotal = (item: any) => {
        const subtotal = calculateSubtotal(item);
        const tax = calculateTax(item);
        return subtotal + tax;
    };

    const totalSubtotal = quotation.items.reduce((sum: number, item: any) => sum + calculateSubtotal(item), 0);
    const totalTax = quotation.items.reduce((sum: number, item: any) => sum + calculateTax(item), 0);
    const grandTotal = totalSubtotal + totalTax;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Quotation" />
            <Toaster position="top-right" />

            <div className="container mx-auto py-6 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-4">
                            <CardTitle>View Quotation</CardTitle>
                            <div className={getStatusBadgeStyle(quotation.status)}>
                                {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
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
                            {quotation.status === 'pending' && (
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border">
                            <div ref={contentRef} className="w-[210mm] mx-auto bg-background p-8 shadow-sm">
                                {/* Header with Logo and Company Info */}
                                <div className="flex items-start justify-between pb-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-12 object-contain" />
                                            <p className="text-sm font-medium text-muted-foreground">Ref: {quotation.reference}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-semibold text-primary">Radiant Synage Pvt Ltd</p>
                                        <p className="text-muted-foreground mt-1">
                                            317, 2nd Floor, East of NGEF Layout<br />
                                            Kasthuri Nagar, Bangalore - 560 043
                                        </p>
                                        <p className="text-primary hover:underline mt-1">
                                            <a href="mailto:murali.krishna@radiantsynage.com">
                                                murali.krishna@radiantsynage.com
                                            </a>
                                        </p>
                                        <div className="text-muted-foreground mt-1">
                                            <p><span className="font-medium">GSTIN/UIN:</span> 29AAHCR7203C1ZJ</p>
                                            <p><span className="font-medium">CIN:</span> U74999KA2016PTC092481</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Title Section */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-semibold text-primary">{quotation.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Kind Attn: {quotation.account_contact?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{quotation.description}</p>
                                </div>

                                <Separator className="my-6" />

                                {/* Billing and Shipping */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-primary">Bill To</h3>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p className="font-medium">{quotation.account?.business_name}</p>
                                            <p>{quotation.billing_address}</p>
                                            <p>{quotation.billing_city}, {quotation.billing_location} {quotation.billing_zip_code}</p>
                                            <p>GST NO: {quotation.account?.gst_number}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-primary">Ship To</h3>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p className="font-medium">{quotation.account_contact?.name}</p>
                                            <p>{quotation.shipping_address}</p>
                                            <p>{quotation.shipping_city}, {quotation.shipping_location} {quotation.shipping_zip_code}</p>
                                            <p>GST NO: {quotation.account?.gst_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Date</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(quotation.estimate_date).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-8 object-contain opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Product Specifications */}
                                <div className="bg-primary/5 p-4 rounded-lg space-y-3 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-primary">Available Size</h3>
                                            <p className="text-sm">{quotation.available_size_width_mm} mm W x {quotation.available_size_height_mm} mm H</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-primary">Resolution</h3>
                                            <p className="text-sm">512 x {Number(quotation.proposed_size_width_mm)} = {Number(quotation.proposed_size_width_mm) * 512} Pixels</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h3 className="text-sm font-medium text-primary mb-2">Proposed Size</h3>
                                        <p className="text-sm">
                                            {quotation.proposed_size_width_mm} mm W x {quotation.proposed_size_height_mm} mm H
                                            {(() => {
                                                const width = parseInt(quotation.proposed_size_width_mm);
                                                const height = parseInt(quotation.proposed_size_height_mm);
                                                const rows = Math.ceil(height/160);
                                                const cols = Math.ceil(width/320);
                                                return ` | ${quotation.proposed_size_width_ft} ft W x ${quotation.proposed_size_height_ft} ft H = ${quotation.proposed_size_sqft} Sq ft | ${rows} R x ${cols} C of 320 W x 160 H mm`;
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                {/* Product Details Table */}
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left">Item</th>
                                            <th className="py-2 text-left">Description</th>
                                            <th className="py-2 text-right">HSN Code</th>
                                            <th className="py-2 text-right">Unit Rate</th>
                                            <th className="py-2 text-right">QTY</th>
                                            <th className="py-2 text-right">Total</th>
                                            <th className="py-2 text-right">GST %</th>
                                            <th className="py-2 text-right">GST Amt</th>
                                            <th className="py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotation.items.map((item: any, index: number) => (
                                            <tr key={item.id} className="border-b">
                                                <td className="py-2">{index + 1}</td>
                                                <td className="py-2">{item.product.name}</td>
                                                <td className="py-2 text-right">{item.product.hsn_code}</td>
                                                <td className="py-2 text-right">{Number(item.unit_price).toFixed(2)}</td>
                                                <td className="py-2 text-right">{Number(item.quantity)}</td>
                                                <td className="py-2 text-right">{calculateSubtotal(item).toFixed(2)}</td>
                                                <td className="py-2 text-right">{Number(item.tax_percentage)}%</td>
                                                <td className="py-2 text-right">{calculateTax(item).toFixed(2)}</td>
                                                <td className="py-2 text-right">{calculateTotal(item).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t font-semibold">
                                            <td colSpan={5} className="py-2 text-right">Total:</td>
                                            <td className="py-2 text-right">{totalSubtotal.toFixed(2)}</td>
                                            <td className="py-2 text-right">GST</td>
                                            <td className="py-2 text-right">{totalTax.toFixed(2)}</td>
                                            <td className="py-2 text-right">{grandTotal.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="rounded-lg border p-4">
                                    <p className="text-sm text-muted-foreground whitespace-pre-line"><span className="font-medium">Note:</span> {quotation.notes}</p>
                                </div>

                                <Separator className="my-6" />

                                {/* Terms and Conditions */}
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="font-medium">Taxes</p>
                                        <p>{quotation.taxes_terms}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="font-medium">Warranty</p>
                                        <p>{quotation.warranty_terms}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="font-medium">Delivery Terms</p>
                                        <p>{quotation.delivery_terms}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="font-medium">Payment Terms</p>
                                        <p>{quotation.payment_terms}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="font-medium">Electrical Points and Installation</p>
                                        <p>{quotation.electrical_terms}</p>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Footer */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">For any information or clarifications</p>
                                            <p className="text-sm font-medium">Contact: 8884491377</p>
                                        </div>
                                        <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-8 object-contain opacity-50" />
                                    </div>
                                    <Separator />
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-sm">For Radiant Synage Pvt Ltd.,</p>
                                            <img
                                                alt="Blue signature stamp of Radiant Synage Pvt Ltd."
                                                className="my-2"
                                                height="40"
                                                width="60"
                                                src="/placeholder.svg?height=40&width=60"
                                            />
                                            <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-8 object-contain opacity-50 mt-2" />
                                            <p className="text-sm font-semibold text-primary">Dhanunjay Reddy D</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Generated on</p>
                                            <p className="text-sm">{new Date().toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                {(commonFiles.length > 0 || quotationFiles.length > 0) && (
                                    <div className="mt-8 space-y-6">
                                        <Separator />
                                        {commonFiles.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-6 object-contain opacity-30" />
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
                                                        <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-6 object-contain opacity-30" />
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

                {/* Approval Actions */}
                {quotation.status === 'pending' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Approval Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add comments (required for rejection)"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <div className="flex gap-4">
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
                                        {loading ? 'Processing...' : 'Reject Quotation'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
