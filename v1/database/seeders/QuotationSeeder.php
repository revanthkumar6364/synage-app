<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Quotation;
use App\Models\Account;
use App\Models\User;
use Carbon\Carbon;

class QuotationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create test account
        $account = Account::firstOrCreate(
            ['business_name' => 'Test Company'],
            [
                'business_name' => 'Test Company',
                'business_id' => 'TEST001',
                'gst_number' => 'GST123456789',
                'industry_type' => 'Technology',
                'region' => 'North',
                'billing_address' => '123 Test Street',
                'billing_location' => 'Test City',
                'billing_city' => 'Test State',
                'billing_zip_code' => '12345',
                'shipping_address' => '123 Test Street',
                'shipping_location' => 'Test City',
                'shipping_city' => 'Test State',
                'shipping_zip_code' => '12345',
                'same_as_billing' => true,
                'status' => 'active',
            ]
        );

        // Get or create test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'mobile' => '9876543211',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        // Create test quotations across different months
        $testData = [
            // March 2025
            [
                'quotation_number' => 'QT-202503-0001',
                'reference' => 'REF-MAR-001',
                'title' => 'March Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-03-15 10:00:00',
                'approved_at' => '2025-03-20 14:30:00',
                'grand_total' => 50000.00,
            ],
            [
                'quotation_number' => 'QT-202503-0002',
                'reference' => 'REF-MAR-002',
                'title' => 'March Test Quotation 2',
                'status' => 'pending',
                'created_at' => '2025-03-25 11:00:00',
                'grand_total' => 75000.00,
            ],

            // April 2025
            [
                'quotation_number' => 'QT-202504-0001',
                'reference' => 'REF-APR-001',
                'title' => 'April Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-04-10 09:00:00',
                'approved_at' => '2025-04-15 16:00:00',
                'grand_total' => 120000.00,
            ],
            [
                'quotation_number' => 'QT-202504-0002',
                'reference' => 'REF-APR-002',
                'title' => 'April Test Quotation 2',
                'status' => 'draft',
                'created_at' => '2025-04-20 13:00:00',
                'grand_total' => 45000.00,
            ],

            // May 2025
            [
                'quotation_number' => 'QT-202505-0001',
                'reference' => 'REF-MAY-001',
                'title' => 'May Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-05-05 08:00:00',
                'approved_at' => '2025-05-10 12:00:00',
                'grand_total' => 80000.00,
            ],
            [
                'quotation_number' => 'QT-202505-0002',
                'reference' => 'REF-MAY-002',
                'title' => 'May Test Quotation 2',
                'status' => 'pending',
                'created_at' => '2025-05-15 14:00:00',
                'grand_total' => 95000.00,
            ],
            [
                'quotation_number' => 'QT-202505-0003',
                'reference' => 'REF-MAY-003',
                'title' => 'May Test Quotation 3',
                'status' => 'rejected',
                'created_at' => '2025-05-25 16:00:00',
                'grand_total' => 60000.00,
            ],

            // June 2025
            [
                'quotation_number' => 'QT-202506-0001',
                'reference' => 'REF-JUN-001',
                'title' => 'June Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-06-10 10:00:00',
                'approved_at' => '2025-06-15 15:00:00',
                'grand_total' => 150000.00,
            ],
            [
                'quotation_number' => 'QT-202506-0002',
                'reference' => 'REF-JUN-002',
                'title' => 'June Test Quotation 2',
                'status' => 'approved',
                'created_at' => '2025-06-20 11:00:00',
                'approved_at' => '2025-06-25 13:00:00',
                'grand_total' => 200000.00,
            ],
            [
                'quotation_number' => 'QT-202506-0003',
                'reference' => 'REF-JUN-003',
                'title' => 'June Test Quotation 3',
                'status' => 'pending',
                'created_at' => '2025-06-30 12:00:00',
                'grand_total' => 85000.00,
            ],

            // July 2025 (existing data)
            [
                'quotation_number' => 'QT-202507-0001',
                'reference' => 'REF-JUL-001',
                'title' => 'July Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-07-05 09:00:00',
                'approved_at' => '2025-07-10 14:00:00',
                'grand_total' => 180000.00,
            ],
            [
                'quotation_number' => 'QT-202507-0002',
                'reference' => 'REF-JUL-002',
                'title' => 'July Test Quotation 2',
                'status' => 'pending',
                'created_at' => '2025-07-15 10:00:00',
                'grand_total' => 120000.00,
            ],
            [
                'quotation_number' => 'QT-202507-0003',
                'reference' => 'REF-JUL-003',
                'title' => 'July Test Quotation 3',
                'status' => 'draft',
                'created_at' => '2025-07-25 11:00:00',
                'grand_total' => 75000.00,
            ],

            // August 2025
            [
                'quotation_number' => 'QT-202508-0001',
                'reference' => 'REF-AUG-001',
                'title' => 'August Test Quotation 1',
                'status' => 'approved',
                'created_at' => '2025-08-05 08:00:00',
                'approved_at' => '2025-08-10 12:00:00',
                'grand_total' => 250000.00,
            ],
            [
                'quotation_number' => 'QT-202508-0002',
                'reference' => 'REF-AUG-002',
                'title' => 'August Test Quotation 2',
                'status' => 'pending',
                'created_at' => '2025-08-15 09:00:00',
                'grand_total' => 180000.00,
            ],
        ];

        foreach ($testData as $data) {
            Quotation::firstOrCreate(
                ['quotation_number' => $data['quotation_number']],
                array_merge($data, [
                    'account_id' => $account->id,
                    'sales_user_id' => $user->id,
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                    'estimate_date' => Carbon::parse($data['created_at'])->format('Y-m-d'),
                    'description' => 'Test quotation description',
                    'billing_address' => '123 Test Street',
                    'billing_location' => 'Test City',
                    'billing_city' => 'Test State',
                    'billing_zip_code' => '12345',
                    'shipping_address' => '123 Test Street',
                    'shipping_location' => 'Test City',
                    'shipping_city' => 'Test State',
                    'shipping_zip_code' => '12345',
                    'same_as_billing' => true,
                ])
            );
        }

        $this->command->info('Test quotation data seeded successfully!');
    }
}
