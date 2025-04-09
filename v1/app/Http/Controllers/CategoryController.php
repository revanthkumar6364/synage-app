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
        $categories = Category::query();

        if ($request->has('search')) {
            $categories->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $categories->where('status', $request->input('status'));
        }

        $categories = $categories->paginate(config('all.pagination.per_page'));

        return Inertia::render('categories/index', [
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['search', 'status']),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
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
        $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.statuses')))],
        ]);

        Category::create($request->only(['parent_id', 'name', 'description', 'status']));

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $categories = Category::all();

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
        $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.statuses')))],
        ]);

        $category->update($request->only(['parent_id', 'name', 'description', 'status']));

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
