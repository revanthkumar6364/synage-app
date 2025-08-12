"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Link, router } from '@inertiajs/react'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from '@/lib/utils';

export type Product = {
    id: number
    name: string
    sku: string
    price: number
    status: string
    category: {
        id: number
        name: string
    }
    can: {
        edit: boolean
        delete: boolean
    }
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "sku",
        header: "SKU",
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            return <div className="text-right font-medium">{formatCurrency(price)}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                    }`}
                >
                    {status}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original

            const handleDelete = () => {
                if (confirm('Are you sure you want to delete this product?')) {
                    router.delete(route('products.destroy', product.id))
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {product.can.edit && (
                            <DropdownMenuItem asChild>
                                <Link href={route('products.edit', product.id)}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {product.can.delete && (
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={handleDelete}
                            >
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
