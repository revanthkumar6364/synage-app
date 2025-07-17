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
    region?: string;
}

export interface AccountContact {
    id: number;
    account_id: number;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    parent?: Category;
    sort_order: number;
    status: 'active' | 'inactive';
    full_path: string;
    has_children: boolean;
    has_parent: boolean;
    children_count: number;
    products_count: number;
    created_at: string;
    updated_at: string;
    can: {
        edit: boolean;
        delete: boolean;
    };
}

export interface Product {
    id: number;
    category_id: number;
    product_type?: 'indoor_led' | 'outdoor_led' | 'kiosk' | 'controllers' | 'tv_screens';
    name: string;
    sku?: string;
    description?: string;
    size?: string;
    h_mm?: number;
    w_mm?: number;
    size_inch?: string;
    upto_pix?: number;
    price: number;
    unit?: string;
    price_per_sqft?: number;
    brand?: string;
    hsn_code?: string;
    type?: string;
    gst_percentage?: number;
    min_price?: number;
    max_price?: number;
    status: 'active' | 'inactive';
    price_range?: string;
    pixel_pitch?: number;
    refresh_rate?: number;
    cabinet_type?: string;
    unit_size?: {
        width_mm: number;
        height_mm: number;
        width_ft: number;
        height_ft: number;
    };
    category?: {
        id: number;
        name: string;
        slug: string;
    };

    can: {
        view: boolean;
        update: boolean;
        delete: boolean;
    };
    created_at: string;
    updated_at: string;
}

export interface QuotationItem {
    available_size_height_mm: any;
    available_size_width_mm: any;
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
    product_type?: 'indoor' | 'outdoor' | 'standard_led';
    selected_product_id?: number;
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
    facade_type?: string;
    facade_notes?: string;
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
    show_hsn_code?: boolean;
    show_no_of_pixels?: boolean;
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
    selected_product?: Product;
    items: QuotationItem[];
    show_billing_in_print?: boolean;
    show_shipping_in_print?: boolean;
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
