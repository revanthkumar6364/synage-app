import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
    data: any;
    onSubmit: () => void;
    processing: boolean;
}

export default function QuotationPreview({ data, onSubmit, processing }: Props) {
    const calculateSubtotal = () => {
        return data.products.reduce((sum: number, item: any) => sum + item.total, 0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quotation Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Header Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium mb-2">Quotation Details</h3>
                            <p>Reference: {data.reference}</p>
                            <p>Title: {data.title}</p>
                            <p>Date: {data.estimateDate}</p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Contact Information</h3>
                            <p>Kind Attention: {data.kindAttn}</p>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium mb-2">Billing Address</h3>
                            <p>{data.billingAddress}</p>
                            <p>{data.billingLocation}</p>
                            <p>{data.billingZipCode}</p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Shipping Address</h3>
                            <p>{data.shippingAddress}</p>
                            <p>{data.shippingLocation}</p>
                            <p>{data.shippingZipCode}</p>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div>
                        <h3 className="font-medium mb-2">Products</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Product</th>
                                    <th className="text-right p-2">Quantity</th>
                                    <th className="text-right p-2">Unit Price</th>
                                    <th className="text-right p-2">Discount</th>
                                    <th className="text-right p-2">Tax</th>
                                    <th className="text-right p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((item: any, index: number) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">
                                            {item.product_id}
                                        </td>
                                        <td className="text-right p-2">{item.quantity}</td>
                                        <td className="text-right p-2">${item.unit_price.toFixed(2)}</td>
                                        <td className="text-right p-2">{item.discount}%</td>
                                        <td className="text-right p-2">{item.tax}%</td>
                                        <td className="text-right p-2">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5} className="text-right p-2 font-medium">Subtotal:</td>
                                    <td className="text-right p-2 font-medium">
                                        ${calculateSubtotal().toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                readOnly
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="clientScope">Client Scope</Label>
                            <Textarea
                                id="clientScope"
                                value={data.clientScope}
                                readOnly
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create Quotation'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}