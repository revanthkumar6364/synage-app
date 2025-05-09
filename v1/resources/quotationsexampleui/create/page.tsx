"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuotationDetailsForm from "@/components/quotation-details-form"
import ProductsForm from "@/components/products-form"
import QuotationPreview from "@/components/quotation-preview"

export default function CreateQuotation() {
  const [activeTab, setActiveTab] = useState("shipping")
  const [quotationData, setQuotationData] = useState({
    reference: "RSPL/Nov/12-01",
    title: "",
    kindAttn: "",
    availableSize: "",
    proposedSize: "",
    description: "",
    estimateDate: "",
    billingAddress: "",
    shippingAddress: "",
    billingLocation: "",
    shippingLocation: "",
    billingZipCode: "",
    shippingZipCode: "",
    sameAsBilling: false,
    products: [],
    notes: "",
    clientScope: "",
  })

  const handleDetailsSubmit = (data: any) => {
    setQuotationData({ ...quotationData, ...data })
    setActiveTab("products")
  }

  const handleProductsSubmit = (data: any) => {
    setQuotationData({ ...quotationData, ...data })
    setActiveTab("quotation")
  }

  const handleFinalSubmit = () => {
    // Here you would submit the complete quotation data to your API
    console.log("Submitting quotation:", quotationData)
    // Redirect to quotations list after successful submission
    // router.push("/quotations");
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <nav className="flex space-x-4 text-sm">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/quotations" className="text-gray-500 hover:text-gray-700">
            Quotations
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-700 font-medium">Create Quotation</span>
        </nav>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500">Reference Id : {quotationData.reference}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="shipping">Shipping Details</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
        </TabsList>
        <TabsContent value="shipping">
          <QuotationDetailsForm initialData={quotationData} onSubmit={handleDetailsSubmit} />
        </TabsContent>
        <TabsContent value="products">
          <ProductsForm initialData={quotationData} onSubmit={handleProductsSubmit} />
        </TabsContent>
        <TabsContent value="quotation">
          <QuotationPreview data={quotationData} onSubmit={handleFinalSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
