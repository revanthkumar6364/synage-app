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
        // General Terms (applies to all)
        'general' => [
            'pricing' => 'The quoted price is inclusive of all applicable taxes and duties, unless stated otherwise. Prices are valid for a period of 15 days from the date of quotation, subject to confirmation.',
            'warranty' => 'The entire solution carries a standard 3-year warranty from the date of Invoice. Warranty excludes physical damages, electrical burnouts, water ingress (in case of indoor), and damage due to mishandling or improper electrical/environmental conditions at the client\'s premises. Any repair or service due to such exclusions will be chargeable.',
            'delivery_timeline' => 'Standard delivery timeline is 2 to 3 weeks from the date of PO and receipt of advance payment. Timeline may vary depending on import logistics, site readiness, and confirmation of technical drawings and approvals.',
            'payment_terms' => '100% Advance Payment along with confirmed Purchase Order. Payment to be made via NEFT/RTGS to Radiant Synage\'s designated account as per the invoice.',
            'site_readiness_delays' => 'All site civil/electrical readiness and infrastructure as per the \'Client\'s Scope\' must be completed before dispatch/installation. Any delay in site readiness beyond 7 working days from scheduled installation date will attract a storage/holding charge of ₹5,000 per week or actual cost incurred, whichever is higher. In case of prolonged delay, Radiant reserves the right to reassign installation schedule at mutual convenience.',
            'installation_scope' => 'Radiant Synage will carry out only the LED installation and display configuration.',
            'ownership_risk' => 'Materials remain the property of Radiant Synage until full and final payment is received. Responsibility for safe-keeping of delivered items at the client site lies with the client post-delivery.',
            'force_majeure' => 'Radiant Synage shall not be held liable for delays or failure in performance resulting from acts beyond its reasonable control. These acts include, but are not limited to: acts of God, governmental orders, import delays, transport strikes, or civil unrest.',
        ],

        // Indoor LED Installation Terms
        'indoor' => [
            'data_connectivity' => 'CAT6 / Fiber Optic cable is to be laid by the client. The cables must have clear labelling. The cables should run from the Server Room to each LED installation point. An internet connection with a static IP (if required) must be ensured by the client.',
            'infrastructure_readiness' => 'A suitably ventilated rack for housing Video Wall Processors needs to be provided. Power sockets (5A/15A as required) with a stabilized supply are to be provided at each LED location. 18mm or 12mm ply backing support must be arranged at the LED mounting surface across all LED wall sites. Niche dimensions, finalized elevation drawings, and electrical load requirements are to be shared upon issuance of a Purchase Order (PO). An MCB switch (with clear labelling) is to be provided either in the electrical room or near each LED site for switching purposes.',
            'logistics_support' => 'Required scaffolding, ladders, and access tools are to be arranged by the client. Site access and necessary work permissions (including civil/electrical shutdowns etc.) are to be coordinated by the client. Onsite storage space for temporary safe keeping of LED components during installation is required.',
            'general_conditions' => 'Any civil, electrical, false ceiling, or carpentry modifications required for mounting will be within the client\'s scope, unless specifically agreed otherwise in writing. Radiant Synage shall not be liable for delays caused due to incomplete site readiness or non-availability of infrastructure.',
        ],

        // Outdoor LED Installation Terms
        'outdoor' => [
            'approvals_permissions' => 'All relevant municipal/government permissions, licenses, NOCs, and approvals (for outdoor visibility, height, traffic compliance, etc.) must be obtained by the client.',
            'data_connectivity' => 'CAT6 / Fiber Optic cable to be laid by the client [With CLEAR Labelling] from the Server Room to each LED installation point. Internet connection with static IP (if required) to be ensured by the client.',
            'power_mounting_infrastructure' => 'Adequate power supply and weather-proof sockets to be arranged at installation locations. Mounting frame / RCC structure (if not part of Radiant\'s deliverables) to be designed and constructed by the client, conforming to load and wind requirements. Earthing and lightning protection system for outdoor LED displays to be arranged and maintained by the client.',
            'logistics_site_access' => 'Arrangement of scaffolding, ladders, boom lift or crane as per site requirement. Site access permissions and operational window for safe working conditions (especially on public roads/buildings) to be coordinated by the client. Safe and secure temporary storage space near the site for LED materials.',
            'general_conditions' => 'Radiant Synage shall not be responsible for delays caused due to incomplete site readiness, lack of access, or pending clearances. Any civil or structural alterations, reinforcements, or waterproofing required will be in the client\'s scope unless otherwise specified.',
        ],

        // Legacy terms for backward compatibility
        'legacy' => [
            'taxes_terms' => 'The quoted price is inclusive of all applicable taxes and duties, unless stated otherwise. Prices are valid for a period of 15 days from the date of quotation, subject to confirmation.',
            'warranty_terms' => 'The entire solution carries a standard 3-year warranty from the date of Invoice. Warranty excludes physical damages, electrical burnouts, water ingress (in case of indoor), and damage due to mishandling or improper electrical/environmental conditions at the client\'s premises. Any repair or service due to such exclusions will be chargeable.',
            'delivery_terms' => 'Standard delivery timeline is 2 to 3 weeks from the date of PO and receipt of advance payment. Timeline may vary depending on import logistics, site readiness, and confirmation of technical drawings and approvals.',
            'payment_terms' => '100% Advance Payment along with confirmed Purchase Order. Payment to be made via NEFT/RTGS to Radiant Synage\'s designated account as per the invoice.',
            'electrical_terms' => 'Installation and Commissioning to be done by our Team',
        ],
    ],

    'quotation_facade_types' => [
        'facade' => 'Facade',
        'cashback' => 'Cashback',
        'standalone' => 'Standalone',
        'uni_pole' => 'Uni-pole',
        'custom' => 'Custom',
    ],
];
