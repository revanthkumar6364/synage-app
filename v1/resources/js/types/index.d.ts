import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: number;
    business_id: string;
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
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    contacts?: AccountContact[];
    [key: string]: unknown;
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
    [key: string]: unknown;
}

export interface QuotationMedia {
    id: number;
    quotation_id: number | null;
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
}

export interface Quotation {
    id: number;
    reference: string;
    quotation_number: string;
    title: string;
    account_id: number;
    account_contact_id?: number;
    available_size_width: string;
    available_size_height: string;
    available_size_unit: string;
    proposed_size_width: string;
    proposed_size_height: string;
    proposed_size_unit: string;
    available_size_width_mm: string;
    available_size_height_mm: string;
    available_size_width_ft: string;
    available_size_height_ft: string;
    available_size_sqft: string;
    proposed_size_width_mm: string;
    proposed_size_height_mm: string;
    proposed_size_width_ft: string;
    proposed_size_height_ft: string;
    proposed_size_sqft: string;
    quantity: number;
    max_quantity: number;
    description: string;
    category: string;
    estimate_date: string;
    billing_address: string;
    billing_location: string;
    billing_city: string;
    billing_zip_code: string;
    shipping_address: string;
    shipping_location: string;
    shipping_city: string;
    shipping_zip_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    last_action: string;
    editable: boolean;
    account?: Account;
    items?: QuotationItem[];
}
