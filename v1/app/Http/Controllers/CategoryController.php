<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', Category::class)) {
            abort(403);
        }

        $categories = Category::query();

        if ($request->has('search')) {
            $categories->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $categories->where('status', $request->input('status'));
        }

        $categories = $categories->with('parent')->paginate(config('all.pagination.per_page'));

        return Inertia::render('categories/index', [
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['search', 'status']),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if ($request->user()->cannot('create', Category::class)) {
            abort(403);
        }

        $categories = Category::all();

        return Inertia::render('categories/create', [
            'categories' => $categories,
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Category::class)) {
            abort(403);
        }

        $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id', 'not_in:0'],
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.statuses')))],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        // Check if the parent category is not a subcategory
        if ($request->parent_id) {
            $parentCategory = Category::find($request->parent_id);
            if ($parentCategory->parent_id !== null) {
                return back()->withErrors(['parent_id' => 'A subcategory cannot be a parent category.']);
            }
        }

        // Generate slug from name
        $slug = \Illuminate\Support\Str::slug($request->name);

        // Ensure slug uniqueness
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        Category::create([
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'status' => $request->status,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Category $category)
    {
        if ($request->user()->cannot('update', $category)) {
            abort(403);
        }

        $categories = Category::where('id', '!=', $category->id)
                         ->where(function($query) use ($category) {
                             $query->whereNull('parent_id')
                                   ->orWhere('parent_id', '!=', $category->id);
                         })
                         ->get();

        return Inertia::render('categories/edit', [
            'category' => new CategoryResource($category),
            'categories' => $categories,
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        if ($request->user()->cannot('update', $category)) {
            abort(403);
        }

        $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.statuses')))],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        // Check if the parent category is not a subcategory
        if ($request->parent_id) {
            $parentCategory = Category::find($request->parent_id);
            if ($parentCategory->parent_id !== null) {
                return back()->withErrors(['parent_id' => 'A subcategory cannot be a parent category.']);
            }
        }

        // Check if the category is not being made a parent of its own children
        if ($request->parent_id) {
            $childrenIds = $category->children()->pluck('id')->toArray();
            if (in_array($request->parent_id, $childrenIds)) {
                return back()->withErrors(['parent_id' => 'A category cannot be a child of its own subcategory.']);
            }
        }

        // Generate new slug if name has changed
        $slug = $category->slug;
        if ($request->name !== $category->name) {
            $slug = \Illuminate\Support\Str::slug($request->name);

            // Ensure slug uniqueness
            $originalSlug = $slug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update([
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'status' => $request->status,
            'sort_order' => $request->sort_order ?? $category->sort_order,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        if ($request->user()->cannot('delete', $category)) {
            abort(403);
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
