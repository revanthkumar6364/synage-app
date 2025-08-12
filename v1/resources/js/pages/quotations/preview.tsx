import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Product, BreadcrumbItem, QuotationMedia, Quotation } from '@/types';
import { Toaster, toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { FileTextIcon, FileIcon, MessageCircle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Facebook, Instagram, Youtube, Linkedin, Globe } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Rich Text Editor Component
interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

function RichTextEditor({ value, onChange, placeholder, rows = 4 }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // Only update the content if the value changes from outside
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        // Delete current selection
        selection.deleteFromDocument();

        // Insert text node at caret
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move caret after inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Update the form value
        // Use setTimeout to ensure React gets the updated content
        setTimeout(() => {
            const editor = e.currentTarget;
            onChange(editor.innerHTML);
        }, 0);
    };

    return (
        <div className={`border rounded-md`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                <ToggleGroup type="single" size="sm">
                    <ToggleGroupItem
                        value="bold"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('bold');
                        }}
                        className="h-8 w-8"
                    >
                        <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="italic"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('italic');
                        }}
                        className="h-8 w-8"
                    >
                        <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="underline"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('underline');
                        }}
                        className="h-8 w-8"
                    >
                        <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                <ToggleGroup type="single" size="sm">
                    <ToggleGroupItem
                        value="justifyLeft"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('justifyLeft');
                        }}
                        className="h-8 w-8"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="justifyCenter"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('justifyCenter');
                        }}
                        className="h-8 w-8"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="justifyRight"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('justifyRight');
                        }}
                        className="h-8 w-8"
                    >
                        <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                <ToggleGroup type="single" size="sm">
                    <ToggleGroupItem
                        value="insertUnorderedList"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('insertUnorderedList');
                        }}
                        className="h-8 w-8"
                    >
                        <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="insertOrderedList"
                        onClick={() => {
                            editorRef.current?.focus();
                            document.execCommand('insertOrderedList');
                        }}
                        className="h-8 w-8"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                className="p-3 min-h-[120px] focus:outline-none prose prose-sm max-w-none rich-text-editor"
                style={{ minHeight: `${rows * 1.5}rem` }}
                data-placeholder={placeholder}
            />
        </div>
    );
}

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
        product_type?: string;
        brand?: string;
        pixel_pitch?: string;
        refresh_rate?: string;
        cabinet_type?: string;
        unit_size?: {
            width_mm: number;
            height_mm: number;
        };
        w_mm?: number;
        h_mm?: number;
    };
    quantity: number;
    unit_price: number;
    proposed_unit_price: number;
    discount_percentage: number;
    tax_percentage: number;
    notes: string | null;
    available_size_width_mm?: number | string;
    available_size_height_mm?: number | string;
}

interface Props {
    quotation: Quotation;
    products: Product[];
    commonFiles: QuotationMedia[];
    quotationFiles: QuotationMedia[];
}

export default function Preview({ quotation, commonFiles, quotationFiles }: Props) {
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
                            {quotation.can.update && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(route('quotations.edit', quotation.id))}
                                    className="font-medium"
                                >
                                    Edit Quotation
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

                                {/* Title Section */}
                                <div className="text-center space-y-3 my-8">
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">
                                            Date: {quotation.estimate_date ? new Date(quotation.estimate_date).toLocaleDateString('en-IN') : ''}
                                        </div>
                                    </div>
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
                                {(quotation.show_billing_in_print || quotation.show_shipping_in_print) && (
                                    <>
                                        <Separator className="my-8" />

                                        <div className="grid grid-cols-2 gap-8">
                                            {quotation.show_billing_in_print && (
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
                                            )}
                                            {quotation.show_shipping_in_print && (
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
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Product Specifications */}
                                <Separator className="my-8" />
                                <div className="space-y-6">

                                    {/* Per-Item Product Specifications for LED Products */}
                                    {quotation.items.map((item, index) => {
                                        const isIndoorOutdoor = item.product && (item.product.product_type === 'indoor_led' || item.product.product_type === 'outdoor_led');

                                        if (!isIndoorOutdoor) return null;

                                        // Use per-item available size if present, else fallback to main quotation
                                        const availableWidthMm = item.available_size_width_mm ? parseFloat(String(item.available_size_width_mm)) : parseFloat(quotation.available_size_width_mm || '0');
                                        const availableHeightMm = item.available_size_height_mm ? parseFloat(String(item.available_size_height_mm)) : parseFloat(quotation.available_size_height_mm || '0');
                                        const availableWidthFt = availableWidthMm / 304.8;
                                        const availableHeightFt = availableHeightMm / 304.8;
                                        const availableSqft = availableWidthFt * availableHeightFt;

                                        // Get product unit size
                                        const unitWidthMm = item.product.unit_size?.width_mm || item.product.w_mm || 320;
                                        const unitHeightMm = item.product.unit_size?.height_mm || item.product.h_mm || 160;

                                        // Use the item's selected quantity
                                        const quantity = parseFloat(String(item.quantity)) || 0;
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
                                                        {quotation.show_no_of_pixels && (
                                                            <div>
                                                                <h4 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">RESOLUTION</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {Math.round(proposedWidthMm * 512)} Pixels
                                                                </p>
                                                            </div>
                                                        )}
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
                                                    <TableHead className="text-right">Unit</TableHead>
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
                                    <div className="rounded-lg border p-4">
                                        <p className="text-sm text-muted-foreground whitespace-pre-line"><span className="font-medium">Note:</span> {quotation.notes}</p>
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
                                                    <RichTextEditor
                                                        value={form.data.taxes}
                                                        onChange={e => form.setData('taxes', e)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="text-sm text-muted-foreground whitespace-pre-line"
                                                        dangerouslySetInnerHTML={{ __html: quotation.taxes_terms || '' }}
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">Warranty</h4>
                                                {isEditing ? (
                                                    <RichTextEditor
                                                        value={form.data.warranty}
                                                        onChange={e => form.setData('warranty', e)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="text-sm text-muted-foreground whitespace-pre-line"
                                                        dangerouslySetInnerHTML={{ __html: quotation.warranty_terms || '' }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Delivery Terms</h4>
                                                {isEditing ? (
                                                    <RichTextEditor
                                                        value={form.data.delivery_terms}
                                                        onChange={e => form.setData('delivery_terms', e)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="text-sm text-muted-foreground whitespace-pre-line"
                                                        dangerouslySetInnerHTML={{ __html: quotation.delivery_terms || '' }}
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">Payment Terms</h4>
                                                {isEditing ? (
                                                    <RichTextEditor
                                                        value={form.data.payment_terms}
                                                        onChange={e => form.setData('payment_terms', e)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="text-sm text-muted-foreground whitespace-pre-line"
                                                        dangerouslySetInnerHTML={{ __html: quotation.payment_terms || '' }}
                                                    />
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
                                        {/* WhatsApp Unicode emoji as fallback */}
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

                                        {commonFiles.length > 0 && (
                                            <>
                                                <Separator />
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
                                            </>
                                        )}
                                        {quotationFiles.length > 0 && (
                                            <>
                                                <Separator />
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {quotationFiles.map((file) => {
                                                            const isImage = file.category === 'image' || (file.full_url && file.full_url.match(/\.(jpg|jpeg|png|gif)$/i));
                                                            const isPdf = file.category === 'pdf' || file.name?.toLowerCase().endsWith('.pdf');
                                                            if (isImage) {
                                                                return (
                                                                    <img
                                                                        key={file.id}
                                                                        src={file.full_url}
                                                                        alt={file.name}
                                                                        className="rounded-lg shadow-sm h-100 w-100 object-cover"
                                                                    />
                                                                );
                                                            } else if (isPdf) {
                                                                return (
                                                                    <a
                                                                        key={file.id}
                                                                        href={file.full_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                                                                    >
                                                                        <FileTextIcon className="h-8 w-8 text-red-600 mb-2" />
                                                                        <span className="text-xs text-center">{file.name}</span>
                                                                        <span className="text-blue-600 underline mt-1">View PDF</span>
                                                                    </a>
                                                                );
                                                            } else {
                                                                return (
                                                                    <a
                                                                        key={file.id}
                                                                        href={file.full_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                                                                    >
                                                                        <FileIcon className="h-8 w-8 text-gray-400 mb-2" />
                                                                        <span className="text-xs text-center">{file.name}</span>
                                                                        <span className="text-blue-600 underline mt-1">Download</span>
                                                                    </a>
                                                                );
                                                            }
                                                        })}
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

                <div className="flex justify-between p-4">
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
