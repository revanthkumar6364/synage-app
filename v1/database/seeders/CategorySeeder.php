<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices and accessories',
                'status' => 'active',
            ],
            [
                'name' => 'Clothing',
                'description' => 'Apparel and fashion items',
                'status' => 'active',
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Home appliances and kitchenware',
                'status' => 'active',
            ],
            [
                'name' => 'Books',
                'description' => 'Books and educational materials',
                'status' => 'active',
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Sports equipment and outdoor gear',
                'status' => 'active',
            ],
            [
                'name' => 'Beauty & Personal Care',
                'description' => 'Beauty products and personal care items',
                'status' => 'active',
            ],
            [
                'name' => 'Toys & Games',
                'description' => 'Toys, games, and entertainment items',
                'status' => 'active',
            ],
            [
                'name' => 'Automotive',
                'description' => 'Automotive parts and accessories',
                'status' => 'active',
            ],
            [
                'name' => 'Health & Household',
                'description' => 'Health products and household essentials',
                'status' => 'active',
            ],
            [
                'name' => 'Office Supplies',
                'description' => 'Office equipment and supplies',
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
