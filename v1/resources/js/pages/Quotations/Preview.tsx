import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Product, BreadcrumbItem, QuotationMedia, Quotation } from '@/types';
import { Toaster, toast } from 'sonner';
import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Preview', href: '#' },
];

interface QuotationItem {
    id: number;
    product_id: number;
    product: {
        id: number;
        name: string;
        hsn_code: string;
    };
    quantity: number;
    unit_price: number;
    proposed_unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    notes: string | null;
}

interface Props {
    quotation: Quotation;
    products: Product[];
    logo: QuotationMedia | null;
    commonFiles: QuotationMedia[];
    quotationFiles: QuotationMedia[];
}

export default function Preview({ quotation, logo, commonFiles, quotationFiles }: Props) {
    const { auth } = usePage<{ auth: any }>().props;
    const contentRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { theme } = useTheme();

    const form = useForm({
        notes: quotation.notes || '',
        client_scope: quotation.client_scope || '',
        status: 'pending',
        taxes: quotation.taxes_terms || '',
        warranty: quotation.warranty_terms || '',
        delivery_terms: quotation.delivery_terms || '',
        payment_terms: quotation.payment_terms || '',
        electrical_terms: quotation.electrical_terms || '',
    });

    const handleSubmitForApproval = () => {
        form.post(route('quotations.update-overview', quotation.id), {
            onSuccess: () => {
                toast.success('Quotation submitted for approval successfully');
                setIsEditing(false);
                router.visit(route('quotations.index'));
            },
            onError: (errors) => {
                toast.error('Failed to submit quotation for approval');
                console.error('Form errors:', errors);
            }
        });
    };

    const handleSaveTerms = () => {
        form.post(route('quotations.save-terms', quotation.id), {
            onSuccess: () => {
                toast.success('Terms and conditions saved successfully');
                setIsEditing(false);
            },
            onError: (errors) => {
                toast.error('Failed to save terms and conditions');
                console.error('Form errors:', errors);
            }
        });
    };

    const calculateSubtotal = (item: any) => {
        const proposedPrice = parseFloat(item.proposed_unit_price) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        return proposedPrice * quantity;
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

    const totalSubtotal = quotation.items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
    const totalTax = quotation.items.reduce((sum, item) => sum + calculateTax(item), 0);
    const grandTotal = totalSubtotal + totalTax;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Quotation" />
            <Toaster position="top-right" />

            <div className="container mx-auto py-6 space-y-6">
                <Card className="border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                        <div>
                            <CardTitle className="text-2xl">Quotation Preview</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Reference: {quotation.reference}</p>
                        </div>
                        <div className="flex gap-2">
                            {isEditing && quotation.can.editTerms ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleSaveTerms}
                                        className="font-medium"
                                    >
                                        Save Terms
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => setIsEditing(false)}
                                        className="font-medium"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="font-medium"
                                >
                                    Edit Terms
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg">
                            <div ref={contentRef} className="w-[210mm] mx-auto bg-background p-8 shadow-sm">
                                {/* Header with Logo and Company Info */}
                                <div className="flex items-start justify-between pb-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="flex flex-col items-start gap-3">
                                            <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-14 object-contain" />
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

                                <Separator className="my-8" />

                                {/* Title Section */}
                                <div className="text-center space-y-3 mb-8">
                                    <h2 className="text-2xl font-semibold text-primary tracking-tight">{quotation.title}</h2>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Kind Attn: {quotation.account_contact?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{quotation.description}</p>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Billing and Shipping */}
                                <div className="grid grid-cols-3 gap-8">
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
                                    <div className="flex flex-col justify-between p-5 bg-muted/30 rounded-lg border border-border/50">
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Date</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {quotation.estimate_date ? new Date(quotation.estimate_date).toLocaleDateString('en-IN') : ''}
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <img src={logo?.full_url} alt="Radiant Synage Logo" className="h-8 object-contain opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Product Specifications */}
                                <div className="space-y-6">
                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="w-[40px] text-center">#</TableHead>
                                                    <TableHead>Product Description</TableHead>
                                                    <TableHead className="text-right">Qty</TableHead>
                                                    <TableHead className="text-right">Unit Price</TableHead>
                                                    <TableHead className="text-right">Tax %</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {quotation.items.map((item, index) => (
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
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">₹{Number(item.proposed_unit_price || 0).toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">{item.tax_percentage}%</TableCell>
                                                        <TableCell className="text-right font-medium">₹{calculateTotal(item).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <p className="text-sm text-muted-foreground whitespace-pre-line"><span className="font-medium">Note:</span> {quotation.notes}</p>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="w-72 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal:</span>
                                                <span className="font-medium">₹{totalSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax Total:</span>
                                                <span className="font-medium">₹{totalTax.toFixed(2)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-base font-medium">
                                                <span>Total Amount:</span>
                                                <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
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
                                                {isEditing ? (
                                                    <Textarea
                                                        value={form.data.taxes}
                                                        onChange={e => form.setData('taxes', e.target.value)}
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.taxes_terms}</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">Warranty</h4>
                                                {isEditing ? (
                                                    <Textarea
                                                        value={form.data.warranty}
                                                        onChange={e => form.setData('warranty', e.target.value)}
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.warranty_terms}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Delivery Terms</h4>
                                                {isEditing ? (
                                                    <Textarea
                                                        value={form.data.delivery_terms}
                                                        onChange={e => form.setData('delivery_terms', e.target.value)}
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.delivery_terms}</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">Payment Terms</h4>
                                                {isEditing ? (
                                                    <Textarea
                                                        value={form.data.payment_terms}
                                                        onChange={e => form.setData('payment_terms', e.target.value)}
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{quotation.payment_terms}</p>
                                                )}
                                            </div>
                                        </div>
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
                                            <p className="text-sm font-semibold text-primary">{auth.user.name}</p>
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

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(route('quotations.index'))}
                    >
                        Back
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmitForApproval}
                        disabled={form.processing || quotation.status !== 'draft'}
                    >
                        {form.processing ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
