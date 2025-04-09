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
        'user' => 'User',
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
];
