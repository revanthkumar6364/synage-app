<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $query = Product::with('category');

        // Handle search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('product_type', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Handle category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->get('category'));
        }

        $products = $query->latest()->paginate(10);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('products/create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:255',
            'h_mm' => 'nullable|numeric|min:0',
            'w_mm' => 'nullable|numeric|min:0',
            'size_inch' => 'nullable|string|max:255',
            'upto_pix' => 'nullable|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:255',
            'price_per_sqft' => 'nullable|numeric|min:0',
            'brand' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:50',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'status' => 'required|in:active,inactive',
            'pixel_pitch' => 'nullable|numeric|min:0',
            'refresh_rate' => 'nullable|integer|min:0',
            'cabinet_type' => 'nullable|string|max:255'
        ]);

        // Get the category and set product_type from category slug
        $category = Category::find($validated['category_id']);
        if ($category) {
            $validated['product_type'] = $category->slug;
        }

        $product = Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        return Inertia::render('products/show', [
            'product' => $product->load('category')
        ]);
    }

        public function edit(Product $product)
    {
        $categories = Category::all();
        return Inertia::render('products/edit', [
            'product' => $product->load('category'),
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:255',
            'h_mm' => 'nullable|numeric|min:0',
            'w_mm' => 'nullable|numeric|min:0',
            'size_inch' => 'nullable|string|max:255',
            'upto_pix' => 'nullable|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:255',
            'price_per_sqft' => 'nullable|numeric|min:0',
            'brand' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:50',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'status' => 'required|in:active,inactive',
            'pixel_pitch' => 'nullable|numeric|min:0',
            'refresh_rate' => 'nullable|integer|min:0',
            'cabinet_type' => 'nullable|string|max:255'
        ]);

        // Get the category and set product_type from category slug
        $category = Category::find($validated['category_id']);
        if ($category) {
            $validated['product_type'] = $category->slug;
        }

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


}
