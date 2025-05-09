export interface Account {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
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
    name: string;
    description?: string;
    sku?: string;
    price: number;
    currency: string;
    created_at: string;
    updated_at: string;
}

export interface QuotationItem {
    id?: number;
    quotation_id?: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
    total: number;
    notes?: string;
    product?: Product;
}

export interface QuotationShippingDetail {
    id?: number;
    quotation_id?: number;
    shipping_address: string;
    billing_address: string;
    shipping_method: string;
    shipping_cost: number;
    delivery_terms?: string;
    payment_terms?: string;
    special_instructions?: string;
}

export interface Quotation {
    id: number;
    quotation_number: string;
    date: string;
    valid_until: string;
    customer_account_id: number;
    contact_id: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    currency: string;
    tax_rate: number;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    terms_conditions?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    customer_account: Account;
    contact: AccountContact;
    items: QuotationItem[];
    shipping_details: QuotationShippingDetail;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}
