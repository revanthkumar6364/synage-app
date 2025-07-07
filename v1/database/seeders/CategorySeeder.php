<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Indoor LED',     'slug' => 'indoor_led',   'description' => 'Indoor LED', 'status' => 'active', 'sort_order' => 1],
            ['name' => 'Outdoor LED',    'slug' => 'outdoor_led', 'description' => 'Outdoor LED', 'status' => 'active', 'sort_order' => 2],
            ['name' => 'Kiosk',          'slug' => 'kiosk',       'description' => 'KIOSK', 'status' => 'active', 'sort_order' => 3],
            ['name' => 'Controllers',    'slug' => 'controllers', 'description' => 'Controllers & Media Players', 'status' => 'active', 'sort_order' => 4],
            ['name' => 'TV Screens',     'slug' => 'tv_screens',  'description' => 'TV Screens', 'status' => 'active', 'sort_order' => 5],
        ];

        foreach ($categories as $data) {
            Category::updateOrCreate(
                ['slug' => $data['slug']],
                ['name' => $data['name'], 'status' => $data['status'], 'description' => $data['description'], 'sort_order' => $data['sort_order']]
            );
        }
    }
}
