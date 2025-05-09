import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, RefreshCcw, Plus } from "lucide-react"
import QuotationTable from "@/components/quotation-table"
import StatusFilter from "@/components/status-filter"

export default function Quotations() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <nav className="flex space-x-4 text-sm">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/quotations" className="text-blue-500 font-medium">
            Quotations
          </Link>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search quotations..." className="pl-8 w-full md:w-[300px]" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <StatusFilter />
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button size="sm" className="gap-1 ml-auto md:ml-0">
            <Plus className="h-4 w-4" />
            <Link href="/quotations/create">Add</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <QuotationTable status="all" />
        </TabsContent>
        <TabsContent value="draft">
          <QuotationTable status="draft" />
        </TabsContent>
        <TabsContent value="pending">
          <QuotationTable status="pending" />
        </TabsContent>
        <TabsContent value="sent">
          <QuotationTable status="sent" />
        </TabsContent>
        <TabsContent value="converted">
          <QuotationTable status="converted" />
        </TabsContent>
        <TabsContent value="expired">
          <QuotationTable status="expired" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
