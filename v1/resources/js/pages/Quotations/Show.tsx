import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Toaster, toast } from 'sonner';
import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'View Quotation', href: '#' },
];

interface Props {
    quotation: any;
}

export default function Show({ quotation }: Props) {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const form = useForm({
        status: 'pending',
        rejection_reason: '',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'approved':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
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
        form.post(route('quotations.reject', quotation.id), {
            rejection_reason: comments,
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

    const handleSubmitForApproval = () => {
        setLoading(true);
        form.post(route('quotations.update-overview', quotation.id), {
            onSuccess: () => {
                toast.success('Quotation submitted for approval successfully');
                router.visit(route('quotations.index'));
            },
            onError: (errors: any) => {
                toast.error('Failed to submit quotation for approval');
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

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Top Section - Status and Details */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">View Quotation</h2>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)} text-white`}>
                            {quotation.status}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('quotations.edit', quotation.id))}
                    >
                        Edit Quotation
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Quotation Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Reference</p>
                                <p>{quotation.reference}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Title</p>
                                <p>{quotation.title}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Customer</p>
                                <p>{quotation.account?.business_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Date</p>
                                <p>{new Date(quotation.estimate_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                <p>{new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                }).format(quotation.total_amount || 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Middle Section - Preview Content */}
                <div ref={contentRef} className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="max-w-[1200px] mx-auto border border-gray-700 text-[10px] leading-[1.1] select-none">
                        {/* Header top */}
                        <div className="flex border-b border-gray-400">
                            <div className="w-[180px] p-2">
                                <div className="flex flex-col items-start">
                                    <img src="/images/logo.png" alt="Radiant Synage Logo" className="h-8" />
                                </div>
                                <div className="mt-1 text-[9px] font-normal">Ref : {quotation.reference}</div>
                            </div>
                            <div className="flex-1 border border-gray-400 border-l-0 border-r-0">
                                <div className="bg-[#2f6cc1] text-white text-[11px] font-semibold text-center py-[2px]">
                                    {quotation.title}
                                </div>
                                <div className="bg-yellow-100 text-[10px] text-center py-[2px] px-1 font-normal">Kind Attn : {quotation.account_contact?.name}</div>
                                <div className="bg-yellow-100 text-[10px] text-center py-[2px] px-1 font-normal border-t border-gray-300">
                                    {quotation.description}
                                </div>
                            </div>
                            <div className="w-[220px] p-2 text-[9px] font-normal leading-[1.1]">
                                <div className="font-bold text-[11px] text-right">Radiant Synage Pvt Ltd</div>
                                <div className="text-right mt-[2px]">
                                    317, 2nd Floor, East of NGEF Layout
                                    <br />
                                    Kasthuri Nagar, Bangalore - 560 043
                                </div>
                                <div className="text-right mt-[2px]">
                                    <a className="text-blue-700 underline" href="mailto:murali.krishna@radiantsynage.com">
                                        murali.krishna@radiantsynage.com
                                    </a>
                                </div>
                                <div className="text-right mt-[2px] font-bold text-[10px]">
                                    GSTIN/UIN :<span className="font-normal">29AAHCR7203C1ZJ</span>
                                    <br />
                                    CIN :<span className="font-normal">U74999KA2016PTC092481</span>
                                </div>
                            </div>
                        </div>

                        {/* Bill To / Ship To / Date with updated widths */}
                        <div className="flex border border-gray-400 border-t-0" style={{ minHeight: "90px" }}>
                            <div
                                className="w-[40%] bg-gray-300 p-2 border-r border-gray-400 flex flex-col justify-start"
                                style={{ minHeight: "90px" }}
                            >
                                <div className="font-bold text-[10px] border-b border-gray-400 pb-[1px]">Bill To</div>
                                <div className="text-[9px] mt-1 leading-[1.2]">
                                    {quotation.account?.business_name}
                                    <br />
                                    {quotation.billing_address}
                                    <br />
                                    {quotation.billing_city}, {quotation.billing_location} {quotation.billing_zip_code}
                                    <br />
                                    GST NO: {quotation.account?.gst_number}
                                </div>
                            </div>
                            <div
                                className="w-[40%] bg-gray-300 p-2 border-r border-gray-400 flex flex-col justify-start"
                                style={{ minHeight: "90px" }}
                            >
                                <div className="font-bold text-[10px] border-b border-gray-400 pb-[1px]">Ship To</div>
                                <div className="text-[9px] mt-1 leading-[1.2]">
                                    {quotation.account_contact?.name}
                                    <br />
                                    {quotation.shipping_address}
                                    <br />
                                    {quotation.shipping_city}, {quotation.shipping_location} {quotation.shipping_zip_code}
                                    <br />
                                    GST NO: {quotation.account?.gst_number}
                                </div>
                            </div>
                            <div className="w-[20%] p-2 text-[9px] text-right flex items-start" style={{ minHeight: "90px" }}>
                                Dated: {new Date(quotation.estimate_date).toLocaleDateString('en-IN')}
                            </div>
                        </div>

                        {/* Dear Sir line */}
                        <div className="border border-t-0 border-gray-400 p-1 text-[9px]">
                            Dear Sir
                            <br />
                            <div className="text-center mt-1">
                                Please find enclosed our commercial for your requirement of Digital Signage Solutions - Active LED Wall
                                Signage Solution
                            </div>
                        </div>

                        {/* Table header */}
                        <table className="w-full border-collapse border border-gray-400 text-[9px]">
                            <thead>
                                <tr className="bg-gray-300 text-center font-semibold">
                                    <th className="border border-gray-400 px-1 py-[3px] w-[30px]">Item</th>
                                    <th className="border border-gray-400 px-1 py-[3px] min-w-[140px]">Description of Item</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[50px]">HSN Code</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[60px]">Unit Rate</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[30px]">QTY</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[70px]">Total W/o TAX</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[40px]">IGST %</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[70px]">IGST</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[70px]">Tot With TAX</th>
                                    <th className="border border-gray-400 px-1 py-[3px] w-[70px]">Tot With TAX</th>
                                    <th className="border border-gray-400 px-1 py-[3px] min-w-[90px] text-left">Features | Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-[#2f6cc1] text-white text-[10px] font-semibold text-center">
                                    <td className="py-3" colSpan={11}>
                                    {quotation.title}
                                        <br />
                                        <br />
                                        Available Size : {quotation.available_size_width_mm} mm W x {quotation.available_size_height_mm} mm H
                                        <br />
                                        <br />
                                        Proposed Size : {quotation.proposed_size_width_mm} mm W x {quotation.proposed_size_height_mm} mm H | {(() => {
                                            const width = parseInt(quotation.proposed_size_width_mm);
                                            const height = parseInt(quotation.proposed_size_height_mm);
                                            const widthFt = Math.round(width/304.8 * 100) / 100;
                                            const heightFt = Math.round(height/304.8 * 100) / 100;
                                            const sqFt = Math.round((width * height)/(304.8 * 304.8) * 100) / 100;
                                            const rows = Math.ceil(height/160);
                                            const cols = Math.ceil(width/320);
                                            return `${widthFt} ft W x ${heightFt} ft H = ${sqFt} Sq ft | ${rows} R x ${cols} C of 320 W x 160 H mm`;
                                        })()} Modules
                                        <br />
                                        Resolution: 512 x {Number(quotation.proposed_size_width_mm)} = {Number(quotation.proposed_size_width_mm) * 512} Pixels
                                    </td>
                                </tr>

                                {quotation.items.map((item: any, index: number) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-400 text-center align-top font-bold py-1">A</td>
                                        <td className="border border-gray-400 px-1 py-1">{item.product.name}</td>
                                        <td className="border border-gray-400 text-center align-top py-1">{item.product.hsn_code}</td>
                                        <td className="border border-gray-400 text-right align-top py-1">{Number(item.unit_price).toFixed(2)}</td>
                                        <td className="border border-gray-400 text-center align-top py-1">{Number(item.quantity)}</td>
                                        <td className="border border-gray-400 text-right align-top py-1">{calculateSubtotal(item).toFixed(2)}</td>
                                        <td className="border border-gray-400 text-center align-top py-1">{Number(item.tax_percentage)}%</td>
                                        <td className="border border-gray-400 text-right align-top py-1">{calculateTax(item).toFixed(2)}</td>
                                        <td className="border border-gray-400 text-right align-top py-1">{calculateTotal(item).toFixed(2)}</td>
                                        {index === 0 && (
                                            <>
                                                <td className="border border-gray-400 text-right font-bold text-[11px] px-2 py-1 align-top" rowSpan={quotation.items.length}>
                                                    {grandTotal.toFixed(2)}
                                                </td>
                                                <td className="border border-gray-400 text-[9px] px-2 py-1 align-top" rowSpan={quotation.items.length}>
                                                    P 2.5 LED
                                                    <br />
                                                    <br />
                                                    Refresh Rate - 3840
                                                    <br />
                                                    <br />
                                                    Brightness of 500 Nits
                                                    <br />
                                                    <br />3 year Warranty
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                <tr className="font-bold text-[10px]">
                                    <td className="border border-gray-400 text-right px-1 py-1 bg-gray-300" colSpan={2}>
                                        Cost Break-up
                                    </td>
                                    <td className="border border-gray-400 text-center px-1 py-1 bg-gray-300" colSpan={1}>
                                        Basic Price
                                    </td>
                                    <td className="border border-gray-400 text-right px-1 py-1" colSpan={1}>
                                        {totalSubtotal.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-400 text-center px-1 py-1 bg-slate-200" colSpan={1}>
                                        GST
                                    </td>
                                    <td className="border border-gray-400 text-right px-1 py-1 font-bold bg-slate-200" colSpan={1}>
                                        {totalTax.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-400 text-center px-1 py-1 bg-orange-100" colSpan={1}>
                                        Total
                                    </td>
                                    <td className="border border-gray-400 text-right px-1 py-1 font-bold bg-orange-100" colSpan={3}>
                                        {grandTotal.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Radiant Synage logo small */}
                        <div className="mt-3 px-2">
                            <div className="flex items-center space-x-2 select-none">
                                <img src="/images/logo.png" alt="Radiant Synage Logo" className="h-6" />
                            </div>
                        </div>

                        {/* Client's Scope section */}
                        <div className="border border-gray-400 mt-2">
                            <div className="flex justify-between items-center border-b border-gray-400 px-2 py-1">
                                <div className="font-semibold text-[14px]">Client's Scope</div>
                                <div className="text-[#0f2f5a] font-extralight text-[14px] leading-[1] flex flex-wrap select-none">
                                    <img src="/images/logo.png" alt="Radiant Synage Logo" className="h-6" />
                                </div>
                            </div>
                            <div className="px-2 py-2 text-[9px] leading-[1.3] space-y-2">
                                <p>
                                    {quotation.client_scope}
                                </p>
                                <table className="w-full border border-gray-700 text-[9px] italic font-semibold text-center">
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-700 px-1 py-1 underline">
                                                <em>Terms and Conditions</em>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-700 text-left px-2 py-1 font-normal italic">
                                                <b>TAXES</b>
                                                <br />
                                                {quotation.taxes_terms}
                                                <br />
                                                <b>Warranty</b>
                                                <br />
                                                {quotation.warranty_terms}
                                                <br />
                                                <b>Delivery Terms</b>
                                                <br />
                                                {quotation.delivery_terms}
                                                <br />
                                                <b>Payment Terms</b>
                                                <br />
                                                {quotation.payment_terms}
                                                <br />
                                                <b>Electrical Points and Installation</b>
                                                <br />
                                                {quotation.electrical_terms}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="mt-2 mb-1">Thanking you and Assuring our best Attention at all times</p>
                                <p className="underline text-[9px] font-normal mb-2 cursor-pointer max-w-[400px]">
                                    For any information or clarifications - feel free to talk to me on - 8884491377
                                </p>
                                <div className="text-[7px] text-gray-600 mb-1">Thanks and Regards</div>
                                <div className="font-bold text-[9px] mb-1">For Radiant Synage Pvt Ltd.,</div>
                                <img
                                    alt="Blue signature stamp of Radiant Synage Pvt Ltd."
                                    className="mb-1"
                                    height="40"
                                    width="60"
                                    src="/placeholder.svg?height=40&width=60"
                                />
                                <div className="text-[9px] font-bold text-[#0f2f5a] mb-1">Dhanunjay Reddy D</div>
                                <div className="flex items-center space-x-1 select-none">
                                    <img src="/images/logo.png" alt="Radiant Synage Logo" className="h-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Actions */}
                <div className="space-y-4">
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
                                            className="bg-green-500 hover:bg-green-600"
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

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(route('quotations.index'))}
                        >
                            Back
                        </Button>
                        {quotation.status === 'draft' && (
                            <Button
                                type="button"
                                onClick={handleSubmitForApproval}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit for Approval'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
