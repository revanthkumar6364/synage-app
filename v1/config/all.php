<?php

return [
    /*
    |--------------------------------------------------------------------------
    | User Roles
    |--------------------------------------------------------------------------
    |
    | This array defines the available user roles in the application.
    | Each role should have a unique key and a display name.
    |
    */
    'roles' => [
        'admin' => 'Admin',
        'manager' => 'Manager',
        'sales' => 'Sales',
    ],

    /*
    |--------------------------------------------------------------------------
    | User Statuses
    |--------------------------------------------------------------------------
    |
    | This array defines the available user statuses in the application.
    | Each status should have a unique key and a display name.
    |
    */
    'statuses' => [
        'active' => 'Active',
        'inactive' => 'Inactive',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | This section defines pagination settings for the application.
    |
    */
    'pagination' => [
        'per_page' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Country Codes
    |--------------------------------------------------------------------------
    |
    | This array defines the available country codes in the application.
    | Each country code should have a unique key and a display name.
    |
    */
    'country_codes' => [
        '+91' => 'India',
        '+1' => 'United States',
    ],

    /*
    |--------------------------------------------------------------------------
    | Industry Types
    |--------------------------------------------------------------------------
    |
    | This array defines the available industry types in the application.
    | Each industry type should have a unique key and a display name.
    |
    */
    'industry_types' => [
        'retail' => 'Retail',
        'healthcare' => 'Healthcare',
        'hospitality' => 'Hospitality',
        'entertainment' => 'Entertainment',
        'education' => 'Education',
        'government' => 'Government',
        'corporate' => 'Corporate',
        'industrial' => 'Industrial',
        'museum' => 'Museum'
    ],
    'box_size' => [
        'width' => 320,
        'height' => 160,
    ],
    'box_size_unit' => 'mm',
    'quotation_images_categories' => [
        'unilumin' => 'Unilumin',
        'absen' => 'Absen',
        'radiant_synage' => 'Radiant Synage',
        'custom' => 'Custom',
    ],

    'terms_and_conditions' => [
        'taxes_terms' => 'The quoted price is inclusive of all applicable taxes and duties, unless stated otherwise. Prices are valid for a period of 15 days from the date of quotation, subject to confirmation.',
        'warranty_terms' => 'The entire solution carries a standard 3-year warranty from the date of Invoice. Warranty excludes physical damages, electrical burnouts, water ingress (in case of indoor), and damage due to mishandling or improper electrical/environmental conditions at the client\'s premises. Any repair or service due to such exclusions will be chargeable.',
        'delivery_terms' => 'Standard delivery timeline is 2 to 3 weeks from the date of PO and receipt of advance payment. Timeline may vary depending on import logistics, site readiness, and confirmation of technical drawings and approvals.',
        'payment_terms' => '100% Advance Payment along with confirmed Purchase Order. Payment to be made via NEFT/RTGS to Radiant Synage\'s designated account as per the invoice.',
        'electrical_terms' => 'Installation and Commissioning to be done by our Team',
    ],

    'quotation_facade_types' => [
        'facade' => 'Facade',
        'cashback' => 'Cashback',
        'standalone' => 'Standalone',
        'uni_pole' => 'Uni-pole',
        'custom' => 'Custom',
    ],
];
