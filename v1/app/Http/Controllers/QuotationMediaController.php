<?php

namespace App\Http\Controllers;

use App\Models\QuotationMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;

class QuotationMediaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', QuotationMedia::class)) {
            abort(403);
        }

        $query = QuotationMedia::query()
            ->when($request->filled('search'), function ($q, $search) use ($request) {
                $q->where(function ($subQuery) use ($request) {
                    $subQuery->where('name', 'like', "%{$request->search}%")
                        ->orWhere('category', 'like', "%{$request->search}%");
                });
            })
            ->when($request->filled('category') && $request->category !== 'all', function ($q, $category) use ($request) {
                $q->byCategory($request->category);
            })
            ->active();

        $media = $query->latest()->paginate(config('all.pagination.per_page'));

        return Inertia::render('quotation-media/index', [
            'media' => $media,
            'filters' => $request->only(['search', 'category']),
            'categories' => config('all.quotation_images_categories'),
        ]);
    }

    public function create(Request $request)
    {
        if ($request->user()->cannot('create', QuotationMedia::class)) {
            abort(403);
        }
        return Inertia::render('quotation-media/create', [
            'categories' => config('all.quotation_images_categories'),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->cannot('create', QuotationMedia::class)) {
            abort(403);
        }
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg|max:5120',
            'category' => 'required|string|in:' . implode(',', array_keys(config('all.quotation_images_categories'))),
            'name' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        $file = $request->file('file');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $filePath = 'quotation-images/' . $validated['category'];
        $fullPath = "{$filePath}/{$fileName}";

        // Store the main file - use put() which reliably creates directories
        if (!Storage::disk('public')->put($fullPath, file_get_contents($file->getRealPath()))) {
            abort(500, 'Failed to store the file');
        }

        // Create media record
        $media = QuotationMedia::create([
            'category' => $validated['category'],
            'name' => $validated['name'],
            'file_name' => $fileName,
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'is_active' => true,
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        DB::commit();
        return redirect()->route('quotation-media.index')
            ->with('success', 'Media uploaded successfully.');
    }

    public function edit(Request $request, $id)
    {
        $quotation_medium = QuotationMedia::findOrFail($id);

        if ($request->user()->cannot('update', $quotation_medium)) {
            abort(403);
        }

        return Inertia::render('quotation-media/edit', [
            'media' => $quotation_medium,
            'categories' => config('all.quotation_images_categories'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $quotation_medium = QuotationMedia::findOrFail($id);

        if ($request->user()->cannot('update', $quotation_medium)) {
            abort(403);
        }
        $validated = $request->validate([
            'category' => 'required|string|in:' . implode(',', array_keys(config('all.quotation_images_categories'))),
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();

        // If category changed, move the file
        if ($validated['category'] !== $quotation_medium->category) {
            $newPath = 'quotation-images/' . $validated['category'];
            $oldPath = $quotation_medium->file_path;

            // Move main file - Storage::put() will automatically create directories
            $oldFullPath = "{$oldPath}/{$quotation_medium->file_name}";
            $newFullPath = "{$newPath}/{$quotation_medium->file_name}";

            if (Storage::disk('public')->exists($oldFullPath)) {
                $fileContents = Storage::disk('public')->get($oldFullPath);
                if (!Storage::disk('public')->put($newFullPath, $fileContents)) {
                    abort(500, 'Failed to move file to new location');
                }
                Storage::disk('public')->delete($oldFullPath);
            }

            $validated['file_path'] = $newPath;
        }

        $quotation_medium->update($validated + ['updated_by' => $request->user()->id]);

        DB::commit();

        return redirect()->route('quotation-media.index')->with('success', 'Media updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $quotation_medium = QuotationMedia::findOrFail($id);

        if ($request->user()->cannot('delete', $quotation_medium)) {
            abort(403);
        }

        DB::beginTransaction();

        // Delete the file
        $filePath = "{$quotation_medium->file_path}/{$quotation_medium->file_name}";
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        // Delete the record
        $quotation_medium->delete();

        DB::commit();
        return back()->with('success', 'Media deleted successfully.');
    }

    public function updateSortOrder(Request $request)
    {
        $validated = $request->validate([
            'media_ids' => 'required|array|min:1',
            'media_ids.*' => 'required|exists:quotation_media,id',
        ]);

        DB::beginTransaction();

        foreach ($validated['media_ids'] as $index => $id) {
            QuotationMedia::where('id', $id)->update(['sort_order' => $index]);
        }

        DB::commit();
        return back()->with('success', 'Sort order updated successfully.');
    }

    public function attach(Request $request, $id)
    {
        $quotation_medium = QuotationMedia::findOrFail($id);
        $quotationId = $request->input('quotation_id');

        if (!$quotationId) {
            return back()->with('error', 'Quotation ID required');
        }

        // Check if user can update this media
        if ($request->user()->cannot('update', $quotation_medium)) {
            return back()->with('error', 'Unauthorized');
        }

        $quotation_medium->quotation_id = $quotationId;
        $quotation_medium->save();

        return back()->with('success', 'File attached successfully');
    }

    public function detach(Request $request, $id)
    {
        // Debug: Check if method is being called
        \Log::info('DETACH METHOD CALLED', ['id' => $id, 'request' => $request->all()]);

        $quotation_medium = QuotationMedia::findOrFail($id);

        if ($request->user()->cannot('update', $quotation_medium)) {
            return back()->with('error', 'Unauthorized');
        }

        // Store the quotation ID before detaching
        $quotationId = $quotation_medium->quotation_id;

        // Debug logging
        \Log::info('Detach attempt', [
            'media_id' => $id,
            'quotation_id_before' => $quotationId,
            'user_id' => $request->user()->id
        ]);

        DB::beginTransaction();

        try {
            $quotation_medium->quotation_id = null;
            $quotation_medium->updated_by = $request->user()->id;
            $quotation_medium->save();

            // Verify the update
            $quotation_medium->refresh();

            \Log::info('Detach result', [
                'media_id' => $id,
                'quotation_id_after' => $quotation_medium->quotation_id,
                'updated' => $quotation_medium->wasChanged('quotation_id')
            ]);

            DB::commit();

            // For Inertia requests, redirect to refresh the quotation files page
            if ($request->header('X-Inertia') && $quotationId) {
                return redirect()->route('quotations.files', $quotationId)
                    ->with('success', 'File detached successfully');
            }

            return back()->with('success', 'File detached successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Detach failed', [
                'media_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to detach file: ' . $e->getMessage());
        }
    }
}
