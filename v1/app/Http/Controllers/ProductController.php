<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class ProductController extends Controller
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    public function index()
    {
        $products = Product::with('category')->latest()->paginate(10);
        return inertia('products/index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return inertia('products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_per_sqft' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'hsn_code' => 'nullable|string|max:50',
            'brand' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return inertia('products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_per_sqft' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'hsn_code' => 'nullable|string|max:50',
            'brand' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }

    protected function storeImage(Product $product, UploadedFile $image): void
    {
        $path = $image->store('products', 'public');

        // Optimize image
        $img = $this->imageManager->read(public_path('storage/' . $path));
        $img->scale(width: 800);
        $img->save(public_path('storage/' . $path), quality: 80);

        $product->images()->create([
            'image_path' => $path,
            'is_primary' => $product->images()->count() === 0
        ]);
    }
}
