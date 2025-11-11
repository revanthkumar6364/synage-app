"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Quotation, BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotations', href: '/quotations' },
    { title: 'Preview', href: '#' },
]

interface Props {
    quotation: Quotation
}

export default function Preview({ quotation }: Props) {
    const [activeTab, setActiveTab] = useState("Quotation")
    const defaultSalesEmail = 'mail@radiantsynage.com'
    const salesEmail = quotation?.sales_user?.email ?? quotation?.salesUser?.email ?? defaultSalesEmail

    const form = useForm({
        notes: quotation.notes || '',
        client_scope: quotation.client_scope || '',
        status: quotation.status,
    })

    const handleSubmit = () => {
        form.post(route('quotations.update-overview', quotation.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Quotation" />
            <div className="flex flex-col min-h-screen bg-white">
                {/* Tabs */}
                <div className="flex border rounded-md mb-5">
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === "Shipping Details" ? "bg-gray-200" : "bg-white"}`}
                        onClick={() => setActiveTab("Shipping Details")}
                    >
                        Shipping Details
                    </button>
                    <button
                        className={`flex-1 py-2 text-center border-l border-r ${activeTab === "Products" ? "bg-gray-200" : "bg-white"}`}
                        onClick={() => setActiveTab("Products")}
                    >
                        Products
                    </button>
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === "Quotation" ? "bg-gray-200" : "bg-white"}`}
                        onClick={() => setActiveTab("Quotation")}
                    >
                        Quotation
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mb-5">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                </div>

                {/* Quotation Document */}
                <div className="border rounded-md p-6 bg-white">
                    {/* Company Header */}
                    <div className="grid grid-cols-3 border-b pb-6">
                        <div>
                            <div className="text-blue-600 font-bold text-xl">RADIANT SYNAGE</div>
                            <div className="text-xs mt-2">Ref: RSPL/{new Date().toLocaleDateString('en-US', { month: 'short' })}/{new Date().getDate()}</div>
                            <div className="mt-4 text-xs">
                                <div>Bill To</div>
                                <div>{quotation.account?.business_name}</div>
                                <div>{quotation.billing_address}</div>
                                <div>{quotation.billing_location}</div>
                                <div>{quotation.billing_zip_code}</div>
                            </div>
                        </div>
                        <div className="bg-blue-500 text-white p-4 flex flex-col justify-center items-center">
                            <div className="text-center font-bold">P 2.5 Active LED</div>
                            <div className="text-center text-sm mt-2">Best Active LED Panels</div>
                            <div className="text-center text-sm mt-2 bg-yellow-100 text-black dark:bg-yellow-900 dark:text-yellow-100 w-full py-1">
                                Territory Digital Solutions with P 2.5 Indoor Active LED
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">Radiant Synage Pvt Ltd</div>
                            <div className="text-xs mt-2">
                                317, Amogha Arcade, 2nd Main Road,<br />
                                East of NGEF Layout, Kasthuri Nagar,<br />
                                Bangalore - 560 043<br />
                                <span className="text-blue-500">{salesEmail}</span>
                            </div>
                            <div className="text-xs mt-4">
                                GSTIN: 29AAKCR7393C1ZT<br />
                                CIN: U74900KA2015PTC081463
                            </div>
                            <div className="text-xs mt-4">
                                Dated: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Quotation Content */}
                    <div className="py-4 text-xs">
                        <p className="font-bold mb-2">Dear Sir,</p>
                        <p>Please find enclosed our commercial quotation for your requirements.</p>
                    </div>

                    {/* Products Table */}
                    <div className="mb-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-blue-600 text-white">
                                    <TableHead className="text-white">Item</TableHead>
                                    <TableHead className="text-white">Description</TableHead>
                                    <TableHead className="text-white">Quantity</TableHead>
                                    <TableHead className="text-white">Unit Price</TableHead>
                                    <TableHead className="text-white">Discount %</TableHead>
                                    <TableHead className="text-white">Tax %</TableHead>
                                    <TableHead className="text-white">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotation.items?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.product_id}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.unit_price}</TableCell>
                                        <TableCell>{item.discount_percentage}%</TableCell>
                                        <TableCell>{item.tax_percentage}%</TableCell>
                                        <TableCell>₹{item.total}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5} className="font-bold text-right">Subtotal:</TableCell>
                                    <TableCell colSpan={2} className="font-bold">₹{quotation.grand_total}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Client's Scope */}
                    <div className="border-t">
                        <div className="p-3 border-b flex justify-between items-center">
                            <div className="font-bold">Client's Scope</div>
                            <div className="text-blue-600 font-bold text-sm">RADIANT SYNAGE</div>
                        </div>
                        <div className="p-4 text-xs">
                            <p>{quotation.client_scope}</p>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t mt-6">
                        <div className="p-3 border-b text-center font-bold">Notes</div>
                        <div className="p-4 text-xs">
                            <p>{quotation.notes}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-sm mt-6">
                        <p>Thanking you and assuring our best attention at all times.</p>
                        <div className="mt-4">
                            <p>Thanks and Regards,</p>
                            <p className="font-bold">For {quotation.account?.business_name}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Back</Button>
                    <Button type="button" onClick={handleSubmit} disabled={form.processing}>
                        {form.processing ? 'Saving...' : 'Send For Approval'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    )
}
