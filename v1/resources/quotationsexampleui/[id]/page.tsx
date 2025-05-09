import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Edit, FileOutput, Send } from "lucide-react"

interface QuotationDetailsProps {
  params: {
    id: string
  }
}

export default function QuotationDetails({ params }: QuotationDetailsProps) {
  const id = params.id

  // In a real app, this would fetch the quotation data from an API
  const quotation = {
    id,
    reference: `RSPL/Feb/18-${id.padStart(3, "0")}`,
    status: "Sent",
    stage: "Approved By #Manager",
    date: "2023-05-18",
    validUntil: "2023-06-18",
    customer: "Acme Corp",
    contact: "Ganesh",
    billingAddress:
      "Sri Nanjundeshwara Complex, No. 257, 3rd floor, Service Road 8th block, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072",
    shippingAddress:
      "Sri Nanjundeshwara Complex, No. 257, 3rd floor, Service Road 8th block, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072",
    products: [
      {
        id: "P001",
        description: "Unilumn P 2.5 Active indoor LED with MS Cabinet",
        hsnCode: "85285900",
        unitRate: 1000,
        quantity: 2,
        totalWoTax: 2000,
        igstPercent: 18,
        igst: 360,
        totalWithTax: 2360,
      },
      {
        id: "P002",
        description: "Nova Star LED Controller",
        hsnCode: "85437049",
        unitRate: 5000,
        quantity: 1,
        totalWoTax: 5000,
        igstPercent: 18,
        igst: 900,
        totalWithTax: 5900,
      },
    ],
    notes: "Delivery within 2-3 weeks from receipt of advance payment.",
    clientScope:
      "CAT6 Fiber Optic Cable to be laid for the Video/Data Locations from the Server Room | We require 1 MCB for Powering all the Video Wall Processors | Internet to be provided by the Client | Power Sockets to be provided by the client",
    termsAndConditions: "50% Advance at the Purchase & 50% against Delivery and Installation",
    subtotal: 7000,
    tax: 1260,
    total: 8260,
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
          <span className="text-gray-700 font-medium">Quotation Details</span>
        </nav>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/quotations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/quotations/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          {quotation.status === "Draft" && (
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Quotation
            </Button>
          )}
          {quotation.status === "Sent" && (
            <Button size="sm">
              <FileOutput className="h-4 w-4 mr-2" />
              Convert to Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Reference Number</p>
          <p className="font-medium">{quotation.reference}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">{quotation.status}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{quotation.date}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Valid Until</p>
          <p className="font-medium">{quotation.validUntil}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-medium">{quotation.customer}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Contact Person</p>
          <p className="font-medium">{quotation.contact}</p>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Billing Address</h3>
              <p className="text-sm">{quotation.billingAddress}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Shipping Address</h3>
              <p className="text-sm">{quotation.shippingAddress}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Notes</h3>
            <p className="text-sm">{quotation.notes}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Client Scope</h3>
            <p className="text-sm">{quotation.clientScope}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Terms and Conditions</h3>
            <p className="text-sm">{quotation.termsAndConditions}</p>
          </div>
        </TabsContent>
        <TabsContent value="products" className="py-4">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[80px]">Product ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Unit Rate</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total W/O Tax</TableHead>
                  <TableHead>IGST%</TableHead>
                  <TableHead>IGST</TableHead>
                  <TableHead>Total with Tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.hsnCode}</TableCell>
                    <TableCell>{product.unitRate.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.totalWoTax.toFixed(2)}</TableCell>
                    <TableCell>{product.igstPercent}%</TableCell>
                    <TableCell>{product.igst.toFixed(2)}</TableCell>
                    <TableCell>{product.totalWithTax.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{quotation.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{quotation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="py-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-05-18 09:30</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Initial quotation created</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-05-18 14:15</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Updated product quantities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-05-19 10:45</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Quotation sent to customer</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-05-20 11:30</TableCell>
                  <TableCell>Approved</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Quotation approved by manager</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
