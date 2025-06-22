<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuotationResource;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Account;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\QuotationMedia;
use Str;
use App\Models\User;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $query = Quotation::with(['account', 'account_contact', 'creator', 'salesUser']);

        // Apply search filter if provided
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Apply status filter if provided and not 'all'
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply role-based filtering
        $authUser = auth()->user()->role;
        if ($authUser === 'sales') {
            $query->where('sales_user_id', auth()->user()->id);
        }

        $quotations = $query->latest()->paginate(config('all.pagination.per_page'));

        return Inertia::render('quotations/index', [
            'quotations' => $quotations,
            'filters' => $request->only(['search', 'status']),
            'statuses' => [
                ['value' => 'all', 'label' => 'All'],
                ['value' => 'draft', 'label' => 'Draft'],
                ['value' => 'pending', 'label' => 'Pending'],
                ['value' => 'approved', 'label' => 'Approved'],
                ['value' => 'rejected', 'label' => 'Rejected'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('quotations/create', [
            'accounts' => Account::with('contacts')->get(),
            'salesUsers' => User::where('role', 'sales')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|unique:quotations',
            'quotation_number' => 'nullable|string|unique:quotations',
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'account_contact_id' => 'nullable|exists:account_contacts,id',
            'sales_user_id' => auth()->user()->role === 'sales' ? 'nullable' : 'required|exists:users,id',
            'available_size_width' => 'required|string|max:100',
            'available_size_height' => 'required|string|max:100',
            'available_size_unit' => 'required|in:mm,ft',
            'proposed_size_width' => 'required|string|max:100',
            'proposed_size_height' => 'required|string|max:100',
            'proposed_size_unit' => 'required|in:mm,ft',
            'available_size_width_mm' => 'required|string|max:100',
            'available_size_height_mm' => 'required|string|max:100',
            'available_size_width_ft' => 'required|string|max:100',
            'available_size_height_ft' => 'required|string|max:100',
            'available_size_sqft' => 'required|string|max:100',
            'proposed_size_width_mm' => 'required|string|max:100',
            'proposed_size_height_mm' => 'required|string|max:100',
            'proposed_size_width_ft' => 'required|string|max:100',
            'proposed_size_height_ft' => 'required|string|max:100',
            'proposed_size_sqft' => 'required|string|max:100',
            'quantity' => 'required|string|max:100',
            'max_quantity' => 'required|string|max:100',
            'description' => 'required|string',
            'category' => 'required|string|in:unilumin,absen,radiant_synage,custom',
            'estimate_date' => 'required|date',
            'billing_address' => 'required|string',
            'billing_location' => 'required|string|max:100',
            'billing_city' => 'required|string|max:100',
            'billing_zip_code' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_location' => 'required|string|max:100',
            'shipping_city' => 'required|string|max:100',
            'shipping_zip_code' => 'required|string|max:20',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:draft,pending,approved,rejected',
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',

        ]);

        try {
            DB::beginTransaction();

            $quotation = new Quotation();
            $validated['reference'] = $quotation->generateReferenceNumber();
            $validated['status'] = 'draft';
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;
            $validated['last_action'] = 'created';
            // Set sales_user_id to current user if role is sales
            if (auth()->user()->role === 'sales') {
                $validated['sales_user_id'] = auth()->user()->id;
            }
            $validated['taxes_terms'] = config('all.terms_and_conditions.taxes_terms');
            $validated['warranty_terms'] = config('all.terms_and_conditions.warranty_terms');
            $validated['delivery_terms'] = config('all.terms_and_conditions.delivery_terms');
            $validated['payment_terms'] = config('all.terms_and_conditions.payment_terms');
            $validated['electrical_terms'] = config('all.terms_and_conditions.electrical_terms');
            $quotation = Quotation::create($validated);

            // Handle file uploads if any
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $filePath = 'quotation-images/' . $quotation->id;
                    $fullPath = "{$filePath}/{$fileName}";

                    // Store the file
                    if (!Storage::disk('public')->put($fullPath, file_get_contents($file->getRealPath()))) {
                        throw new \Exception('Failed to store file: ' . $file->getClientOriginalName());
                    }

                    // Create media record
                    QuotationMedia::create([
                        'quotation_id' => $quotation->id,
                        'category' => $validated['category'],
                        'name' => $file->getClientOriginalName(),
                        'file_name' => $fileName,
                        'file_path' => $filePath,
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'is_active' => true,
                        'created_by' => $request->user()->id,
                        'updated_by' => $request->user()->id,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('quotations.files', $quotation)
                ->with('success', 'Quotation created successfully. Now add products.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Clean up any uploaded files
            if (isset($quotation) && $request->hasFile('files')) {
                Storage::disk('public')->deleteDirectory('quotation-images/' . $quotation->id);
            }
            return back()->withErrors(['error' => 'Failed to create quotation: ' . $e->getMessage()]);
        }
    }

    public function show(Request $request, $quotationId)
    {
        $quotation = Quotation::with(['items', 'account'])->find($quotationId);
        $commonFiles = QuotationMedia::where('category', $quotation->category)->get();
        $quotationFiles = QuotationMedia::where('quotation_id', $quotationId)->where('category', '!=', 'logo')->get();
        return Inertia::render('quotations/show', [
            'quotation' => $quotation,
            'commonFiles' => $commonFiles,
            'quotationFiles' => $quotationFiles,
            'products' => Product::select('id', 'name', 'description', 'price', 'gst_percentage')->get(),
        ]);
    }

    public function edit(Quotation $quotation)
    {
        //dd($quotation);
        return Inertia::render('quotations/edit', [
            'quotation' => $quotation,
            'accounts' => Account::with('contacts')->get(),
            'products' => Product::get(),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'reference' => 'required|string|unique:quotations,reference,' . $quotation->id,
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'account_contact_id' => 'nullable|exists:account_contacts,id',
            'available_size_width' => 'required|string|max:100',
            'available_size_height' => 'required|string|max:100',
            'available_size_unit' => 'required|in:mm,ft',
            'proposed_size_width' => 'required|string|max:100',
            'proposed_size_height' => 'required|string|max:100',
            'proposed_size_unit' => 'required|in:mm,ft',
            'available_size_width_mm' => 'required|string|max:100',
            'available_size_height_mm' => 'required|string|max:100',
            'available_size_width_ft' => 'required|string|max:100',
            'available_size_height_ft' => 'required|string|max:100',
            'available_size_sqft' => 'required|string|max:100',
            'proposed_size_width_mm' => 'required|string|max:100',
            'proposed_size_height_mm' => 'required|string|max:100',
            'proposed_size_width_ft' => 'required|string|max:100',
            'proposed_size_height_ft' => 'required|string|max:100',
            'proposed_size_sqft' => 'required|string|max:100',
            'quantity' => 'required|string|max:100',
            'max_quantity' => 'required|string|max:100',
            'description' => 'required|string',
            'category' => 'required|string|in:unilumin,absen,radiant_synage,custom',
            'estimate_date' => 'required|date',
            'billing_address' => 'required|string',
            'billing_location' => 'required|string|max:100',
            'billing_city' => 'required|string|max:100',
            'billing_zip_code' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_location' => 'required|string|max:100',
            'shipping_city' => 'required|string|max:100',
            'shipping_zip_code' => 'required|string|max:20',
            'same_as_billing' => 'boolean',
        ]);

        $validated['updated_by'] = $request->user()->id;
        $validated['last_action'] = 'updated';
        $quotation->update($validated);

        return back()->with('success', 'Quotation details updated successfully.');
    }

    public function products(Quotation $quotation)
    {
        return Inertia::render('quotations/products', [
            'quotation' => $quotation->load('items'),
            'products' => Product::get(),
        ]);
    }

    public function updateProducts(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.proposed_unit_price' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'required|numeric|min:0|max:100',
            'items.*.tax_percentage' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update notes and client_scope
            $quotation->update([
                'notes' => $validated['notes'] ?? null,
                'client_scope' => $validated['client_scope'] ?? null,
                'updated_by' => $request->user()->id,
                'last_action' => 'updated'
            ]);

            // Delete existing items
            $quotation->items()->delete();

            // Create new items with calculations based on proposed_unit_price
            foreach ($validated['items'] as $item) {
                $quotationItem = new QuotationItem([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'proposed_unit_price' => $item['proposed_unit_price'],
                    'discount_percentage' => $item['discount_percentage'],
                    'tax_percentage' => $item['tax_percentage'],
                    'notes' => $item['notes'] ?? null
                ]);

                // Calculate totals based on proposed_unit_price
                $quotationItem->calculateTotals();
                $quotationItem->save();
            }

            // Recalculate quotation totals
            $quotation->calculateTotals();

            DB::commit();

            return back()->with('success', 'Quotation products updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update quotation products: ' . $e->getMessage()]);
        }
    }

    public function preview(Request $request, $quotationId)
    {
        $quotation = Quotation::with(['items', 'account'])->find($quotationId);
        $commonFiles = QuotationMedia::where('category', $quotation->category)->get();
        $quotationFiles = QuotationMedia::where('quotation_id', $quotationId)->where('category', '!=', 'logo')->get();
        return Inertia::render('quotations/preview', [
            'quotation' => $quotation,
            'commonFiles' => $commonFiles,
            'quotationFiles' => $quotationFiles,
            'products' => Product::select('id', 'name', 'description', 'price', 'gst_percentage')->get(),
        ]);
    }


    public function updateOverview(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',
            'status' => 'required|in:draft,pending,approved,rejected',
            'taxes' => 'nullable|string',
            'warranty' => 'nullable|string',
            'delivery_terms' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'electrical_terms' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update the quotation
            $quotation->update([
                'notes' => $validated['notes'],
                'client_scope' => $validated['client_scope'],
                'status' => $validated['status'],
                'taxes_terms' => $validated['taxes'],
                'warranty_terms' => $validated['warranty'],
                'delivery_terms' => $validated['delivery_terms'],
                'payment_terms' => $validated['payment_terms'],
                'electrical_terms' => $validated['electrical_terms'],
                'updated_by' => $request->user()->id,
                'last_action' => 'updated',
                'editable' => false,
            ]);

            DB::commit();

            return back()->with('success', 'Quotation updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update quotation: ' . $e->getMessage());
        }
    }

    public function destroy(Quotation $quotation)
    {
        try {
            $quotation->delete();
            return redirect()->route('quotations.index')
                ->with('success', 'Quotation deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting quotation: ' . $e->getMessage());
        }
    }

    public function convertToOrder(Quotation $quotation)
    {
        // Placeholder for future order conversion
        return back()->with('error', 'Conversion to order not implemented yet.');
    }

    public function saveTerms(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'taxes' => 'nullable|string',
            'warranty' => 'nullable|string',
            'delivery_terms' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'electrical_terms' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update the quotation terms
            $quotation->update([
                'taxes_terms' => $validated['taxes'],
                'warranty_terms' => $validated['warranty'],
                'delivery_terms' => $validated['delivery_terms'],
                'payment_terms' => $validated['payment_terms'],
                'electrical_terms' => $validated['electrical_terms'],
            ]);

            DB::commit();

            return back()->with('success', 'Terms and conditions saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to save terms and conditions: ' . $e->getMessage());
        }
    }

    public function approve(Request $request, Quotation $quotation)
    {
        try {
            DB::beginTransaction();

            // Update the quotation status
            $quotation->update([
                'status' => 'approved',
                'updated_by' => $request->user()->id,
                'last_action' => 'approved',
                'editable' => false,
                'approved_at' => now(),
                'approved_by' => $request->user()->id
            ]);

            DB::commit();

            return back()->with('success', 'Quotation approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve quotation: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            // Update the quotation status
            $quotation->update([
                'status' => 'rejected',
                'updated_by' => $request->user()->id,
                'last_action' => 'rejected',
                'rejected_at' => now(),
                'editable' => false,
                'rejected_by' => $request->user()->id,
                'rejection_reason' => $validated['rejection_reason']
            ]);

            DB::commit();

            return back()->with('success', 'Quotation rejected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject quotation: ' . $e->getMessage());
        }
    }

    public function createVersion(Request $request, Quotation $quotation)
    {
        try {
            DB::beginTransaction();

            // Create a new quotation as a copy of the current one
            $newQuotation = $quotation->replicate();
            $newQuotation->parent_id = $quotation->id;
            $newQuotation->status = 'draft';
            $newQuotation->editable = true;
            $newQuotation->quotation_number = $newQuotation->generateQuotationNumber();
            $newQuotation->reference = $quotation->reference . '-V' . ($quotation->versions()->count() + 1);
            $newQuotation->created_by = $request->user()->id;
            $newQuotation->updated_by = $request->user()->id;
            $newQuotation->last_action = 'created_version';
            $newQuotation->approved_at = null;
            $newQuotation->approved_by = null;
            $newQuotation->rejected_at = null;
            $newQuotation->rejected_by = null;
            $newQuotation->rejection_reason = null;
            $newQuotation->sales_user_id = $quotation->sales_user_id;
            $newQuotation->save();

            // Copy all quotation items
            foreach ($quotation->items as $item) {
                $newItem = $item->replicate();
                $newItem->quotation_id = $newQuotation->id;
                $newItem->save();
            }

            // Copy all quotation media
            foreach ($quotation->media as $media) {
                $newMedia = $media->replicate();
                $newMedia->quotation_id = $newQuotation->id;
                $newMedia->save();
            }

            DB::commit();

            return redirect()->route('quotations.edit', $newQuotation->id)
                ->with('success', 'New version created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create new version: ' . $e->getMessage());
        }
    }

    public function files(Request $request, $quotationId)
    {
        $quotation = Quotation::find($quotationId);
        if ($request->user()->cannot('view', $quotation)) {
            abort(403);
        }
        // Get quotation-specific files
        $quotationFiles = $quotation->media()
            ->with(['creator'])
            ->orderBy('sort_order')
            ->get();

        // Get common files that can be used across quotations
        $commonFiles = QuotationMedia::whereNull('quotation_id')
            ->where('category', $quotation->category)
            ->orderBy('sort_order')
            ->get();
        // Transform the data to ensure all required fields are present
        return Inertia::render('quotations/files', [
            'quotation' => $quotation,
            'quotationFiles' => $quotationFiles,
            'commonFiles' => $commonFiles,
        ]);
    }

    public function filesStore(Request $request, Quotation $quotation)
    {

        $validated = $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg|max:5120'
        ]);

        try {
            DB::beginTransaction();

            $file = $request->file('file');
            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $filePath = 'quotation-images/' . $quotation->id;
            $fullPath = "{$filePath}/{$fileName}";

            // Store the main file
            if (!Storage::disk('public')->put($fullPath, file_get_contents($file->getRealPath()))) {
                throw new \Exception('Failed to store the file');
            }

            // Create media record
            QuotationMedia::create([
                'quotation_id' => $quotation->id,
                'category' => 'quotation',
                'name' => $fileName,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'is_active' => true,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            DB::commit();
            return redirect()->route('quotations.files', $quotation->id)
                ->with('success', 'File uploaded successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Storage::disk('public')->delete($fullPath);
            return back()->with('error', 'Failed to upload file: ' . $e->getMessage());
        }
    }

    public function downloadPdf(Quotation $quotation)
    {
        $commonFiles = QuotationMedia::where('category', $quotation->category)->get();
        $quotationFiles = QuotationMedia::where('quotation_id', $quotation->id)->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation->load(['items.product', 'account', 'account_contact']),
            'commonFiles' => $commonFiles,
            'quotationFiles' => $quotationFiles
        ]);

        // Set paper size to A4 and portrait orientation
        $pdf->setPaper('a4', 'portrait');

        // Set better rendering options
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('dpi', 150);
        $pdf->setOption('defaultFont', 'DejaVu Sans');

        // Increase memory limit for large PDFs with images
        ini_set('memory_limit', '256M');

        // Sanitize filename
        $filename = str_replace(['/', '\\'], '_', $quotation->reference);
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $filename);

        return $pdf->download("quotation_{$filename}.pdf");
    }

}
