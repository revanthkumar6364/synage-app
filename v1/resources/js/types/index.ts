import { ReactNode } from "react";
import { LucideIcon } from 'lucide-react';

export interface Account {
    id: number;
    business_id: number;
    business_name: string;
    gst_number?: string;
    industry_type?: string;
    billing_address?: string;
    billing_location?: string;
    billing_city?: string;
    billing_zip_code?: string;
    shipping_address?: string;
    shipping_location?: string;
    shipping_city?: string;
    shipping_zip_code?: string;
    same_as_billing: boolean;
    status?: string;
    contacts?: AccountContact[];
    created_at: string;
    updated_at: string;
}

export interface AccountContact {
    id: number;
    account_id: number;
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    sku?: string;
    hsn_code?: string;
    brand?: string;
    type?: string;
    gst_percentage: number;
    price: number;
    price_per_sqft?: number;
    min_price?: number;
    max_price?: number;
    description?: string;
    status?: string;
    created_at: string;
    updated_at: string;
}

export interface QuotationItem {
    product: any;
    total: ReactNode;
    id: number;
    product_id: number;
    quantity: string | number;
    unit_price: string | number;
    proposed_unit_price?: string | number;
    discount_percentage: string | number;
    tax_percentage: string | number;
    notes?: string;
}

export interface Quotation {
    id: number;
    parent_id?: number;
    reference: string;
    quotation_number: string;
    title: string;
    available_size_width?: string;
    available_size_height?: string;
    available_size_unit?: string;
    proposed_size_width?: string;
    proposed_size_height?: string;
    proposed_size_unit?: string;
    available_size_width_mm?: string;
    available_size_height_mm?: string;
    available_size_width_ft?: string;
    available_size_height_ft?: string;
    available_size_sqft?: string;
    proposed_size_width_mm?: string;
    proposed_size_height_mm?: string;
    proposed_size_width_ft?: string;
    proposed_size_height_ft?: string;
    proposed_size_sqft?: string;
    quantity?: number;
    max_quantity?: number;
    description?: string;
    category?: string;
    estimate_date?: string;
    account_id: number;
    account_contact_id?: number;
    billing_address?: string;
    billing_location?: string;
    billing_city?: string;
    billing_zip_code?: string;
    shipping_address?: string;
    shipping_location?: string;
    shipping_city?: string;
    shipping_zip_code?: string;
    same_as_billing: boolean;
    notes?: string;
    client_scope?: string;
    taxes_terms?: string;
    warranty_terms?: string;
    delivery_terms?: string;
    payment_terms?: string;
    electrical_terms?: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    grand_total: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    editable: boolean;
    last_action?: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    approved_at?: string;
    approved_by?: number;
    rejected_at?: string;
    rejected_by?: number;
    rejection_reason?: string;
    account?: Account;
    account_contact?: AccountContact;
    items: QuotationItem[];
    can: {
        update: boolean;
        delete: boolean;
        view: boolean;
        editTerms: boolean;
        editFiles: boolean;
    };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface QuotationMedia {
    id: number;
    quotation_id: number|null;
    category: string;
    name: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    is_active: boolean;
    sort_order: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    full_url: string;
    creator?: User;
    updater?: User;
    can: {
        view: boolean;
        update: boolean;
        delete: boolean;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}
