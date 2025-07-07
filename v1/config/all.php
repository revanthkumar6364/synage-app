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
        'taxes_terms' => 'The above price is inclusive of all taxes and duties',
        'warranty_terms' => 'Warranty is 3 Years for all the products quoted100% Payment along with the order',
        'delivery_terms' => 'Delivery is Immediate.',
        'payment_terms' => '100% Payment along with the order',
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
