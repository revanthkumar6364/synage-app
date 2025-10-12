<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuotationMedia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QuotationMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user to assign as creator
        $adminUser = User::where('role', 'admin')->first();
        if (!$adminUser) {
            $adminUser = User::first();
        }

        if (!$adminUser) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Default technical specifications and standard images
        $defaultFiles = [
            [
                'name' => 'Technical Specifications - Indoor LED',
                'category' => 'pdf',
                'description' => 'Technical specifications for indoor LED displays',
                'is_default' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Technical Specifications - Outdoor LED',
                'category' => 'pdf',
                'description' => 'Technical specifications for outdoor LED displays',
                'is_default' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Standard Installation Guide',
                'category' => 'pdf',
                'description' => 'Standard installation and setup guide',
                'is_default' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Warranty Terms',
                'category' => 'pdf',
                'description' => 'Standard warranty terms and conditions',
                'is_default' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Product Brochure - Indoor',
                'category' => 'brochure',
                'description' => 'Indoor LED product brochure',
                'is_default' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Product Brochure - Outdoor',
                'category' => 'brochure',
                'description' => 'Outdoor LED product brochure',
                'is_default' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Standard Product Images',
                'category' => 'image',
                'description' => 'Standard product showcase images',
                'is_default' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($defaultFiles as $fileData) {
            // Check if file already exists
            $existingFile = QuotationMedia::where('name', $fileData['name'])
                ->whereNull('quotation_id') // General files have null quotation_id
                ->first();

            if (!$existingFile) {
                // Create placeholder file in storage
                $fileName = Str::slug($fileData['name']) . '.' . ($fileData['category'] === 'pdf' ? 'pdf' : 'jpg');
                $filePath = 'quotation-images/defaults';
                $fullPath = "{$filePath}/{$fileName}";

                // Ensure directory exists
                if (!Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->makeDirectory($filePath);
                }

                // Create placeholder content
                if ($fileData['category'] === 'pdf') {
                    // Create a simple PDF placeholder (you can replace this with actual PDF files)
                    $content = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Placeholder PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000110 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF";
                } else {
                    // Create a simple image placeholder (1x1 pixel PNG)
                    $content = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
                }

                Storage::disk('public')->put($fullPath, $content);

                // Create database record
                QuotationMedia::create([
                    'quotation_id' => null, // null means it's a general/default file
                    'category' => $fileData['category'],
                    'name' => $fileData['name'],
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'mime_type' => $fileData['category'] === 'pdf' ? 'application/pdf' : 'image/jpeg',
                    'file_size' => strlen($content),
                    'is_active' => true,
                    'sort_order' => $fileData['sort_order'],
                    'created_by' => $adminUser->id,
                    'updated_by' => $adminUser->id,
                ]);

                $this->command->info("Created default file: {$fileData['name']}");
            } else {
                $this->command->info("Default file already exists: {$fileData['name']}");
            }
        }

        $this->command->info('Default quotation media files seeded successfully!');
    }
}
