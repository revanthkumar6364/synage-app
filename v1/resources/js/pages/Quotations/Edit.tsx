import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import QuotationDetailsForm from '@/Components/quotations/QuotationDetailsForm';
import ProductsForm from '@/Components/quotations/ProductsForm';
import QuotationPreview from '@/Components/quotations/QuotationPreview';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Edit Quotation', href: '#' },
];

interface Props {
    quotation: Quotation;
    accounts: Account[];
    contacts: AccountContact[];
    products: Product[];
}

export default function Edit({ quotation, accounts, contacts, products }: Props) {
    const [activeTab, setActiveTab] = useState("details");

    const detailsForm = useForm({
        title: quotation.title,
        account_id: quotation.account_id,
        account_contact_id: quotation.account_contact_id,
        available_size: quotation.available_size,
        proposed_size: quotation.proposed_size,
        description: quotation.description,
        estimate_date: quotation.estimate_date,
        billing_address: quotation.billing_address,
        billing_location: quotation.billing_location,
        billing_city: quotation.billing_city,
        billing_zip_code: quotation.billing_zip_code,
        shipping_address: quotation.shipping_address,
        shipping_location: quotation.shipping_location,
        shipping_city: quotation.shipping_city,
        shipping_zip_code: quotation.shipping_zip_code,
        same_as_billing: quotation.same_as_billing,
    });

    const productsForm = useForm({
        items: quotation.items || [],
    });

    const overviewForm = useForm({
        notes: quotation.notes,
        client_scope: quotation.client_scope,
        status: quotation.status,
    });

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        detailsForm.post(route('quotations.update.details', quotation.id), {
            onSuccess: () => setActiveTab('products'),
        });
    };

    const handleProductsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        productsForm.post(route('quotations.update.products', quotation.id), {
            onSuccess: () => setActiveTab('overview'),
        });
    };

    const handleOverviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        overviewForm.post(route('quotations.update.overview', quotation.id), {
            onSuccess: () => {
                // Redirect to index or show success message
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Quotation" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Edit Quotation</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">Reference Id : {quotation.reference}</p>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full grid grid-cols-3">
                                <TabsTrigger value="details">Shipping Details</TabsTrigger>
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details">
                                <QuotationDetailsForm
                                    initialData={detailsForm.data}
                                    onSubmit={handleDetailsSubmit}
                                    errors={detailsForm.errors}
                                    accounts={accounts}
                                    contacts={contacts}
                                    processing={detailsForm.processing}
                                />
                            </TabsContent>
                            <TabsContent value="products">
                                <ProductsForm
                                    initialData={productsForm.data}
                                    onSubmit={handleProductsSubmit}
                                    errors={productsForm.errors}
                                    products={products}
                                    processing={productsForm.processing}
                                />
                            </TabsContent>
                            <TabsContent value="overview">
                                <QuotationPreview
                                    data={overviewForm.data}
                                    onSubmit={handleOverviewSubmit}
                                    processing={overviewForm.processing}
                                    quotation={quotation}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}