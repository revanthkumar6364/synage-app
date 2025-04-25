<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
            'name' => $this->faker->words(3, true),
            'sku' => $this->faker->unique()->bothify('SKU-####-????'),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'unit' => $this->faker->randomElement(['piece', 'kg', 'liter', 'box', 'pair']),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            // Create 1-3 images for each product
            $imageCount = $this->faker->numberBetween(1, 3);

            for ($i = 0; $i < $imageCount; $i++) {
                $product->images()->create([
                    'image_path' => 'products/sample-' . $this->faker->numberBetween(1, 5) . '.jpg',
                    'is_primary' => $i === 0,
                ]);
            }
        });
    }
}