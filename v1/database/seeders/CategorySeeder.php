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
                'name' => 'Commercial Displays',
                'status' => 'active',
            ],
            [
                'name' => 'Kiosks',
                'status' => 'active',
            ],
            [
                'name' => 'Active LED Al diecast',
                'status' => 'active',
            ],
            [
                'name' => 'Cabinets',
                'status' => 'active',
            ],
            [
                'name' => 'Media Players',
                'status' => 'active',
            ],
            [
                'name' => 'Controllers',
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
