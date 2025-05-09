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
            'status' => 'required|in:draft,pending,approved,rejected',
        ]);

        // Generate quotation number if not provided
        if (empty($validated['quotation_number'])) {
            $validated['quotation_number'] = 'QT-' . date('Ymd') . '-' . str_pad(Quotation::count() + 1, 4, '0', STR_PAD_LEFT);
        }

        $quotation = Quotation::create($validated);

        return redirect()->route('quotations.edit', $quotation)
            ->with('success', 'Quotation created successfully. Now add products.');
    }


    public function edit(Quotation $quotation)
    {
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation->load(['items.product']),
            'accounts' => Account::select('id', 'business_name', 'billing_address', 'billing_location', 'billing_city', 'billing_zip_code', 'shipping_address', 'shipping_location', 'shipping_city', 'shipping_zip_code')->get(),
            'contacts' => AccountContact::select('id', 'account_id', 'name', 'email', 'contact_number')->get(),
            'products' => Product::select('id', 'name', 'description', 'unit_price')->get(),
        ]);
    }

    public function updateDetails(Request $request, Quotation $quotation)
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

        $validated['customer_account_id'] = $validated['account_id'];
        $validated['contact_id'] = $validated['account_contact_id'];
        unset($validated['account_id'], $validated['account_contact_id']);

        $quotation->update($validated);

        return back()->with('success', 'Quotation details updated successfully.');
    }

    public function updateProducts(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'required|numeric|min:0|max:100',
            'items.*.tax' => 'required|numeric|min:0|max:100',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($quotation, $validated) {
            $quotation->items()->delete();

            foreach ($validated['items'] as $item) {
                $quotation->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'],
                    'tax' => $item['tax'],
                    'total' => $item['total'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                    'discount_amount' => ($item['discount'] / 100) * $item['quantity'] * $item['unit_price'],
                ]);
            }

            $quotation->calculateTotals();
        });

        return back()->with('success', 'Quotation products updated successfully.');
    }

    public function updateOverview(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',
            'status' => 'required|in:draft,pending,approved,rejected',
        ]);

        $quotation->update($validated);

        return back()->with('success', 'Quotation overview updated successfully.');
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
