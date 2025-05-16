<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuotationResource;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Account;
use App\Models\AccountContact;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $query = Quotation::with(['account', 'account_contact'])
            ->when($request->search, fn($q, $search) => $q->search($search))
            ->when($request->status && $request->status !== 'all', fn($q, $status) => $q->where('status', $status));

        $quotations = $query->latest()->paginate(10);

        return Inertia::render('Quotations/Index', [
            'quotations' => QuotationResource::collection($quotations),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Quotations/Create', [
            'accounts' => Account::select('id', 'business_name', 'billing_address', 'billing_location', 'billing_city', 'billing_zip_code', 'shipping_address', 'shipping_location', 'shipping_city', 'shipping_zip_code')->get(),
            'contacts' => AccountContact::select('id', 'account_id', 'name', 'email', 'contact_number')->get(),
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
            'available_size' => 'required|string|max:100',
            'proposed_size' => 'required|string|max:100',
            'description' => 'required|string',
            'estimate_date' => 'required|date|after_or_equal:today',
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

            // Generate quotation number if not provided
            if (empty($validated['quotation_number'])) {
                $quotation = new Quotation();
                $validated['quotation_number'] = $quotation->generateQuotationNumber();
            }

            $quotation = Quotation::create($validated);

            DB::commit();

            return redirect()->route('quotations.edit', $quotation)
                ->with('success', 'Quotation created successfully. Now add products.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create quotation: ' . $e->getMessage()]);
        }
    }

    public function edit(Quotation $quotation)
    {
        //dd($quotation);
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'accounts' => Account::select('id', 'business_name', 'billing_address', 'billing_location', 'billing_city', 'billing_zip_code', 'shipping_address', 'shipping_location', 'shipping_city', 'shipping_zip_code')->get(),
            'contacts' => AccountContact::select('id', 'account_id', 'name', 'email', 'contact_number')->get(),
            'products' => Product::select('id', 'name', 'description')->get(),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'account_id' => 'required|exists:accounts,id',
            'account_contact_id' => 'nullable|exists:account_contacts,id',
            'available_size' => 'required|string',
            'proposed_size' => 'required|string',
            'description' => 'required|string',
            'estimate_date' => 'required|date',
            'billing_address' => 'required|string',
            'billing_location' => 'required|string',
            'billing_city' => 'required|string',
            'billing_zip_code' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_location' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_zip_code' => 'required|string',
            'same_as_billing' => 'boolean',
        ]);

        $quotation->update($validated);

        return back()->with('success', 'Quotation details updated successfully.');
    }

    public function products(Quotation $quotation)
    {
        return Inertia::render('Quotations/Products', [
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
            ]);

            $quotation->items()->delete();

            foreach ($validated['items'] as $item) {
                $quotationItem = new QuotationItem([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_percentage' => $item['discount_percentage'],
                    'tax_percentage' => $item['tax_percentage'],
                ]);

                $quotationItem->calculateTotals();
                $quotation->items()->save($quotationItem);
            }

            $quotation->calculateTotals();

            DB::commit();

            return back()->with('success', 'Quotation products updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update quotation products: ' . $e->getMessage()]);
        }
    }

    public function preview(Quotation $quotation)
    {
        return Inertia::render('Quotations/Preview', [
            'quotation' => $quotation->load(['items', 'account']),
            'products' => Product::select('id', 'name', 'description', 'price', 'gst_percentage')->get(),
        ]);
    }

    public function updateOverview(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',
            'status' => 'required|in:draft,pending,approved,rejected',
        ]);

        try {
            DB::beginTransaction();

            // Update the quotation
            $quotation->update([
                'notes' => $validated['notes'],
                'client_scope' => $validated['client_scope'],
                'status' => $validated['status'],
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

}
