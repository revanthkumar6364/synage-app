import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { useState } from "react";

interface Props {
    initialData: any;
    onSubmit: (data: any) => void;
    products: Product[];
    errors: any;
}

export default function ProductsForm({ initialData, onSubmit, products, errors }: Props) {
    const [items, setItems] = useState(initialData.products || []);

    const addProduct = () => {
        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1,
                unit_price: 0,
                discount: 0,
                tax: 0,
                total: 0
            }
        ]);
    };

    const removeProduct = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateProduct = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        // Calculate total
        const item = newItems[index];
        const subtotal = item.quantity * item.unit_price;
        const discountAmount = (subtotal * item.discount) / 100;
        const taxAmount = ((subtotal - discountAmount) * item.tax) / 100;
        newItems[index].total = subtotal - discountAmount + taxAmount;

        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...initialData, products: items });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {items.map((item: any, index: number) => (
                            <div key={index} className="grid grid-cols-6 gap-4 p-4 border rounded-lg">
                                <div className="col-span-2">
                                    <Label>Product</Label>
                                    <Select
                                        value={item.product_id}
                                        onValueChange={(value) => updateProduct(index, 'product_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <Label>Unit Price</Label>
                                    <Input
                                        type="number"
                                        value={item.unit_price}
                                        onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value))}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <Label>Discount (%)</Label>
                                    <Input
                                        type="number"
                                        value={item.discount}
                                        onChange={(e) => updateProduct(index, 'discount', parseFloat(e.target.value))}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <Label>Tax (%)</Label>
                                    <Input
                                        type="number"
                                        value={item.tax}
                                        onChange={(e) => updateProduct(index, 'tax', parseFloat(e.target.value))}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeProduct(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <div className="col-span-6">
                                    <p className="text-sm text-gray-500">
                                        Total: ${item.total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button type="button" onClick={addProduct} className="mb-4">
                        Add Product
                    </Button>

                    <div className="flex justify-end">
                        <Button type="submit">Next</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}