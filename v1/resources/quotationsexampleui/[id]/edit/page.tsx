"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuotationDetailsForm from "@/components/quotation-details-form"
import ProductsForm from "@/components/products-form"
import QuotationPreview from "@/components/quotation-preview"
import { getQuotationById, updateQuotation } from "@/lib/actions"

export default function EditQuotation() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("shipping")
  const [quotationData, setQuotationData] = useState({
    reference: "",
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

  useEffect(() => {
    async function fetchQuotation() {
      try {
        // In a real app, this would be an API call
        const quotation = await getQuotationById(id)
        if (quotation) {
          setQuotationData({
            reference: quotation.quotationNumber,
            title: quotation.title || "",
            kindAttn: quotation.kindAttn || "",
            availableSize: quotation.availableSize || "",
            proposedSize: quotation.proposedSize || "",
            description: quotation.description || "",
            estimateDate: quotation.date ? new Date(quotation.date).toLocaleDateString() : "",
            billingAddress: quotation.shippingDetails?.billingAddress || "",
            shippingAddress: quotation.shippingDetails?.shippingAddress || "",
            billingLocation: quotation.billingLocation || "",
            shippingLocation: quotation.shippingLocation || "",
            billingZipCode: quotation.billingZipCode || "",
            shippingZipCode: quotation.shippingZipCode || "",
            sameAsBilling: false,
            products: quotation.items || [],
            notes: quotation.notes || "",
            clientScope: quotation.clientScope || "",
          })
        }
      } catch (error) {
        console.error("Error fetching quotation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotation()
  }, [id])

  const handleDetailsSubmit = (data: any) => {
    setQuotationData({ ...quotationData, ...data })
    setActiveTab("products")
  }

  const handleProductsSubmit = (data: any) => {
    setQuotationData({ ...quotationData, ...data })
    setActiveTab("quotation")
  }

  const handleFinalSubmit = async () => {
    try {
      // In a real app, this would be an API call
      await updateQuotation(id, quotationData)
      router.push("/quotations")
    } catch (error) {
      console.error("Error updating quotation:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
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
          <span className="text-gray-700 font-medium">Edit Quotation</span>
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
