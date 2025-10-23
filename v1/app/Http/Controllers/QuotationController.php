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
                ['value' => 'order_received', 'label' => 'Order Received'],
                ['value' => 'rejected', 'label' => 'Rejected'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('quotations/create', [
            'accounts' => Account::with('contacts')->get(),
            'salesUsers' => User::where('role', 'sales')->get(),
            'productsByType' => [
                'indoor' => Product::byType('indoor')->get(),
                'outdoor' => Product::byType('outdoor')->get(),
                'standard_led' => Product::byType('standard_led')->get(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Base validation rules
        $validationRules = [
            'reference' => 'nullable|string|unique:quotations', // Made nullable, will auto-generate if not provided
            'quotation_number' => 'nullable|string|unique:quotations',
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'account_contact_id' => 'nullable|exists:account_contacts,id',
            'sales_user_id' => auth()->user()->role === 'sales' ? 'nullable' : 'required|exists:users,id',
            'product_type' => 'required|in:indoor,outdoor,standard_led',
            'selected_product_id' => 'required|exists:products,id',
            'description' => 'required|string',
            'category' => 'required|string|in:unilumin,absen,radiant_synage,custom',
            'estimate_date' => 'required|date',
            'billing_address' => 'nullable|string',
            'billing_location' => 'nullable|string|max:100',
            'billing_city' => 'nullable|string|max:100',
            'billing_zip_code' => 'nullable|string|max:20',
            'shipping_address' => 'nullable|string',
            'shipping_location' => 'nullable|string|max:100',
            'shipping_city' => 'nullable|string|max:100',
            'shipping_zip_code' => 'nullable|string|max:20',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:draft,pending,approved,rejected,order_received',
            'notes' => 'nullable|string',
            'client_scope' => 'nullable|string',
            'show_hsn_code' => 'boolean',
            'show_no_of_pixels' => 'boolean',
            'show_billing_in_print' => 'boolean',
            'show_shipping_in_print' => 'boolean',
        ];

        // Add size-related validation rules based on product_type
        if ($request->product_type !== 'standard_led') {
            $validationRules = array_merge($validationRules, [
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
            ]);
        } else {
            // For standard_led, make size fields nullable
            $validationRules = array_merge($validationRules, [
                'available_size_width' => 'nullable|string|max:100',
                'available_size_height' => 'nullable|string|max:100',
                'available_size_unit' => 'nullable|in:mm,ft',
                'proposed_size_width' => 'nullable|string|max:100',
                'proposed_size_height' => 'nullable|string|max:100',
                'proposed_size_unit' => 'nullable|in:mm,ft',
                'available_size_width_mm' => 'nullable|string|max:100',
                'available_size_height_mm' => 'nullable|string|max:100',
                'available_size_width_ft' => 'nullable|string|max:100',
                'available_size_height_ft' => 'nullable|string|max:100',
                'available_size_sqft' => 'nullable|string|max:100',
                'proposed_size_width_mm' => 'nullable|string|max:100',
                'proposed_size_height_mm' => 'nullable|string|max:100',
                'proposed_size_width_ft' => 'nullable|string|max:100',
                'proposed_size_height_ft' => 'nullable|string|max:100',
                'proposed_size_sqft' => 'nullable|string|max:100',
                'quantity' => 'nullable|string|max:100',
                'max_quantity' => 'nullable|string|max:100',
            ]);
        }

        $validated = $request->validate($validationRules);

        try {
            DB::beginTransaction();

            $quotation = new Quotation();
            $validated['status'] = 'draft';
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;
            $validated['last_action'] = 'created';
            // Set sales_user_id to current user if role is sales
            if (auth()->user()->role === 'sales') {
                $validated['sales_user_id'] = auth()->user()->id;
            }
            // Set legacy terms for backward compatibility
            $legacyTerms = config('all.terms_and_conditions.legacy');
            $validated['taxes_terms'] = $legacyTerms['taxes_terms'];
            $validated['warranty_terms'] = $legacyTerms['warranty_terms'];
            $validated['delivery_terms'] = $legacyTerms['delivery_terms'];
            $validated['payment_terms'] = $legacyTerms['payment_terms'];
            $validated['electrical_terms'] = $legacyTerms['electrical_terms'];

            // Set comprehensive terms based on product_type
            $productType = $validated['product_type'] ?? 'standard_led';

            // Set general terms from config
            $generalTerms = config('all.terms_and_conditions.general');
            $validated['general_pricing_terms'] = $generalTerms['pricing'];
            $validated['general_warranty_terms'] = $generalTerms['warranty'];
            $validated['general_delivery_terms'] = $generalTerms['delivery_timeline'];
            $validated['general_payment_terms'] = $generalTerms['payment_terms'];
            $validated['general_site_readiness_terms'] = $generalTerms['site_readiness_delays'];
            $validated['general_installation_scope_terms'] = $generalTerms['installation_scope'];
            $validated['general_ownership_risk_terms'] = $generalTerms['ownership_risk'];
            $validated['general_force_majeure_terms'] = $generalTerms['force_majeure'];

            // Set product type specific terms
            if ($productType === 'indoor') {
                $indoorTerms = config('all.terms_and_conditions.indoor');
                $validated['indoor_data_connectivity_terms'] = $indoorTerms['data_connectivity'];
                $validated['indoor_infrastructure_readiness_terms'] = $indoorTerms['infrastructure_readiness'];
                $validated['indoor_logistics_support_terms'] = $indoorTerms['logistics_support'];
                $validated['indoor_general_conditions_terms'] = $indoorTerms['general_conditions'];
            } elseif ($productType === 'outdoor') {
                $outdoorTerms = config('all.terms_and_conditions.outdoor');
                $validated['outdoor_approvals_permissions_terms'] = $outdoorTerms['approvals_permissions'];
                $validated['outdoor_data_connectivity_terms'] = $outdoorTerms['data_connectivity'];
                $validated['outdoor_power_mounting_terms'] = $outdoorTerms['power_mounting_infrastructure'];
                $validated['outdoor_logistics_site_access_terms'] = $outdoorTerms['logistics_site_access'];
                $validated['outdoor_general_conditions_terms'] = $outdoorTerms['general_conditions'];
            }
            // For 'standard_led' and other types, only general terms apply

            // Auto-generate reference if not provided
            if (empty($validated['reference'])) {
                // Create a temporary quotation instance to generate reference
                $tempQuotation = new Quotation();
                $tempQuotation->account_id = $validated['account_id'];
                $validated['reference'] = $tempQuotation->generateReferenceNumber();
            }

            // Auto-generate quotation number if not provided
            if (empty($validated['quotation_number'])) {
                $validated['quotation_number'] = (new Quotation())->generateQuotationNumber();
            }

            $quotation = Quotation::create($validated);

            // Automatically attach default files
            $this->attachDefaultFiles($quotation);

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
        $quotation = Quotation::with(['items.product', 'account', 'account_contact'])->find($quotationId);
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
        return Inertia::render('quotations/edit', [
            'quotation' => $quotation,
            'accounts' => Account::with('contacts')->get(),
            'productsByType' => [
                'indoor' => Product::byType('indoor')->get(),
                'outdoor' => Product::byType('outdoor')->get(),
                'standard_led' => Product::byType('standard_led')->get(),
            ],
            'salesUsers' => User::where('role', 'sales')->get(),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        // Base validation rules
        $validationRules = [
            'reference' => 'required|string|unique:quotations,reference,' . $quotation->id,
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'account_contact_id' => 'nullable|exists:account_contacts,id',
            'product_type' => 'required|in:indoor,outdoor,standard_led',
            'selected_product_id' => 'required|exists:products,id',
            'description' => 'required|string',
            'category' => 'required|string|in:unilumin,absen,radiant_synage,custom',
            'estimate_date' => 'required|date',
            'billing_address' => 'nullable|string',
            'billing_location' => 'nullable|string|max:100',
            'billing_city' => 'nullable|string|max:100',
            'billing_zip_code' => 'nullable|string|max:20',
            'shipping_address' => 'nullable|string',
            'shipping_location' => 'nullable|string|max:100',
            'shipping_city' => 'nullable|string|max:100',
            'shipping_zip_code' => 'nullable|string|max:20',
            'same_as_billing' => 'boolean',
            'show_hsn_code' => 'boolean',
            'show_no_of_pixels' => 'boolean',
            'show_billing_in_print' => 'boolean',
            'show_shipping_in_print' => 'boolean',
        ];

        // Add size-related validation rules based on product_type
        if ($request->product_type !== 'standard_led') {
            $validationRules = array_merge($validationRules, [
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
            ]);
        } else {
            // For standard_led, make size fields nullable
            $validationRules = array_merge($validationRules, [
                'available_size_width' => 'nullable|string|max:100',
                'available_size_height' => 'nullable|string|max:100',
                'available_size_unit' => 'nullable|in:mm,ft',
                'proposed_size_width' => 'nullable|string|max:100',
                'proposed_size_height' => 'nullable|string|max:100',
                'proposed_size_unit' => 'nullable|in:mm,ft',
                'available_size_width_mm' => 'nullable|string|max:100',
                'available_size_height_mm' => 'nullable|string|max:100',
                'available_size_width_ft' => 'nullable|string|max:100',
                'available_size_height_ft' => 'nullable|string|max:100',
                'available_size_sqft' => 'nullable|string|max:100',
                'proposed_size_width_mm' => 'nullable|string|max:100',
                'proposed_size_height_mm' => 'nullable|string|max:100',
                'proposed_size_width_ft' => 'nullable|string|max:100',
                'proposed_size_height_ft' => 'nullable|string|max:100',
                'proposed_size_sqft' => 'nullable|string|max:100',
                'quantity' => 'nullable|string|max:100',
                'max_quantity' => 'nullable|string|max:100',
            ]);
        }

        $validated = $request->validate($validationRules);

        $validated['updated_by'] = $request->user()->id;
        $validated['last_action'] = 'updated';

        // Always repopulate T&C to ensure correct terms (fixes old quotations with wrong T&C)
        if (isset($validated['product_type'])) {
            $quotation->populateDefaultTerms($validated['product_type']);
        }

        $quotation->update($validated);

        // Check if this is a "save and next" action
        if ($request->has('action') && $request->action === 'save_and_next') {
            return redirect()->route('quotations.files', $quotation)
                ->with('success', 'Quotation updated successfully. Now add products.');
        } else {
            // Regular save - stay on edit page
            return back()->with('success', 'Quotation details updated successfully.');
        }
    }



    public function products(Quotation $quotation)
    {
        // Check if we need to handle product synchronization
        if ($quotation->selected_product_id && $quotation->selectedProduct) {
            $selectedProduct = $quotation->selectedProduct;
            $calculatedQuantity = $quotation->max_quantity ?: $quotation->quantity ?: 1;

            // Case 1: No items exist - create the item
            if ($quotation->items->isEmpty()) {
                $quotationItem = new QuotationItem([
                    'quotation_id' => $quotation->id,
                    'product_id' => $selectedProduct->id,
                    'quantity' => $calculatedQuantity,
                    'unit_price' => $selectedProduct->price,
                    'proposed_unit_price' => $selectedProduct->price,
                    'discount_percentage' => 0,
                    'tax_percentage' => $selectedProduct->gst_percentage ?: 0,
                    'notes' => null,
                    'available_size_width_mm' => $quotation->available_size_width_mm,
                    'available_size_height_mm' => $quotation->available_size_height_mm,
                ]);

                $quotationItem->calculateTotals();
                $quotationItem->save();

                session()->flash('info', 'Product from Step 1 has been automatically added with calculated quantity.');
            }
            // Case 2: Items exist but product has changed - update the first item
            elseif ($quotation->items->count() === 1 && $quotation->items->first()->product_id !== $selectedProduct->id) {
                $firstItem = $quotation->items->first();

                // Update the existing item with new product details
                $firstItem->update([
                    'product_id' => $selectedProduct->id,
                    'quantity' => $calculatedQuantity,
                    'unit_price' => $selectedProduct->price,
                    'proposed_unit_price' => $selectedProduct->price,
                    'tax_percentage' => $selectedProduct->gst_percentage ?: 0,
                    'available_size_width_mm' => $quotation->available_size_width_mm,
                    'available_size_height_mm' => $quotation->available_size_height_mm,
                ]);

                // Recalculate totals
                $firstItem->calculateTotals();
                $firstItem->save();

                session()->flash('info', 'Product has been updated to match the selection from Step 1.');
            }
            // Case 3: Multiple items exist - don't auto-update, let user manage manually
            elseif ($quotation->items->count() > 1) {
                // Check if any item matches the selected product
                $matchingItem = $quotation->items->where('product_id', $selectedProduct->id)->first();
                if (!$matchingItem) {
                    session()->flash('warning', 'Multiple products exist. The selected product from Step 1 is not in the list. You may want to add it manually.');
                }
            }
        }

        // Auto-attach product specification images
        $this->attachProductSpecificationImages($quotation);

        return Inertia::render('quotations/products', [
            'quotation' => $quotation->load(['items', 'selectedProduct']),
            'products' => Product::get(),
            'productsByType' => [
                'indoor' => Product::byType('indoor')->get(),
                'outdoor' => Product::byType('outdoor')->get(),
                'standard_led' => Product::byType('standard_led')->get(),
            ],
        ]);
    }

    public function updateProducts(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.proposed_unit_price' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'required|numeric|min:0|max:100',
            'items.*.tax_percentage' => 'required|numeric|min:0|max:100',
            'items.*.available_size_width_mm' => 'nullable|numeric|min:0',
            'items.*.available_size_height_mm' => 'nullable|numeric|min:0',
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
                    'notes' => $item['notes'] ?? null,
                    'available_size_width_mm' => $item['available_size_width_mm'] ?? null,
                    'available_size_height_mm' => $item['available_size_height_mm'] ?? null,
                ]);

                // Calculate totals based on proposed_unit_price
                $quotationItem->calculateTotals();
                $quotationItem->save();
            }

            // Recalculate quotation totals
            $quotation->calculateTotals();

            // Auto-attach product specification images
            $this->attachProductSpecificationImages($quotation);

            // Load items with products to check pricing
            $quotation->load('items.product');

            // Check if pricing approval is required
            $quotation->checkAndSetPricingApproval();

            // Refresh quotation to get updated requires_pricing_approval value
            $quotation->refresh();

            // Auto-approve if within standard pricing and status is pending
            if ($quotation->status === 'pending' && !$quotation->requires_pricing_approval) {
                $quotation->update([
                    'status' => 'approved',
                    'approved_at' => now(),
                    'approved_by' => $request->user()->id,
                    'last_action' => 'auto_approved',
                    'editable' => false,
                ]);
            }

            DB::commit();

            // Success message varies based on auto-approval
            $successMessage = 'Quotation products updated successfully.';
            if ($quotation->status === 'approved' && $quotation->last_action === 'auto_approved') {
                $successMessage .= ' ✓ Quotation auto-approved (pricing within standard range).';
            } elseif ($quotation->requires_pricing_approval) {
                $successMessage .= ' ⚠ Pricing approval required (items outside standard range).';
            }

            // Check if this is a "save and preview" action
            if ($request->has('action') && $request->action === 'save_and_preview') {
                return redirect()->route('quotations.preview', $quotation)
                    ->with('success', $successMessage);
            } else {
                // Regular save - stay on products page
                return back()->with('success', $successMessage);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update quotation products: ' . $e->getMessage()]);
        }
    }

    public function preview(Request $request, $quotationId)
    {
        $quotation = Quotation::with(['items.product', 'account', 'account_contact'])->find($quotationId);
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
            'status' => 'required|in:draft,pending,approved,rejected,order_received',
            'taxes' => 'nullable|string',
            'warranty' => 'nullable|string',
            'delivery_terms' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'electrical_terms' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Load items with products to check pricing
            $quotation->load('items.product');

            // Check if pricing approval is needed before status change
            $quotation->checkAndSetPricingApproval();

            // Refresh to get updated requires_pricing_approval value
            $quotation->refresh();

            // Auto-approve if changing to pending and within standard pricing
            $shouldAutoApprove = ($validated['status'] === 'pending' && !$quotation->requires_pricing_approval);

            if ($shouldAutoApprove) {
                // Auto-approve instead of pending
                $quotation->update([
                    'notes' => $validated['notes'],
                    'client_scope' => $validated['client_scope'],
                    'status' => 'approved',
                    'taxes_terms' => $validated['taxes'],
                    'warranty_terms' => $validated['warranty'],
                    'delivery_terms' => $validated['delivery_terms'],
                    'payment_terms' => $validated['payment_terms'],
                    'electrical_terms' => $validated['electrical_terms'],
                    'updated_by' => $request->user()->id,
                    'last_action' => 'auto_approved',
                    'approved_at' => now(),
                    'approved_by' => $request->user()->id,
                    'editable' => false,
                ]);
            } else {
                // Normal update
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
            }

            // Auto-attach product specification images
            $this->attachProductSpecificationImages($quotation);

            DB::commit();

            $message = $shouldAutoApprove
                ? 'Quotation auto-approved successfully (pricing within standard range).'
                : 'Quotation updated successfully.';

            if ($validated['status'] === 'pending' && $quotation->requires_pricing_approval) {
                $message .= ' Pricing approval required.';
            }

            return back()->with('success', $message);
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

    public function updateProductType(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'product_type' => 'required|string|in:indoor,outdoor,standard_led',
        ]);

        try {
            DB::beginTransaction();

            $quotation->product_type = $validated['product_type'];
            $quotation->populateDefaultTerms($validated['product_type']);
            $quotation->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product type updated successfully.',
                'terms' => $quotation->getApplicableTerms()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product type: ' . $e->getMessage()
            ], 500);
        }
    }

    public function saveTerms(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            // Legacy terms (for backward compatibility)
            'taxes' => 'nullable|string',
            'warranty' => 'nullable|string',
            'delivery_terms' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'electrical_terms' => 'nullable|string',

            // New comprehensive terms

            // General terms
            'general_pricing_terms' => 'nullable|string',
            'general_warranty_terms' => 'nullable|string',
            'general_delivery_terms' => 'nullable|string',
            'general_payment_terms' => 'nullable|string',
            'general_site_readiness_terms' => 'nullable|string',
            'general_installation_scope_terms' => 'nullable|string',
            'general_ownership_risk_terms' => 'nullable|string',
            'general_force_majeure_terms' => 'nullable|string',

            // Indoor terms
            'indoor_data_connectivity_terms' => 'nullable|string',
            'indoor_infrastructure_readiness_terms' => 'nullable|string',
            'indoor_logistics_support_terms' => 'nullable|string',
            'indoor_general_conditions_terms' => 'nullable|string',

            // Outdoor terms
            'outdoor_approvals_permissions_terms' => 'nullable|string',
            'outdoor_data_connectivity_terms' => 'nullable|string',
            'outdoor_power_mounting_terms' => 'nullable|string',
            'outdoor_logistics_site_access_terms' => 'nullable|string',
            'outdoor_general_conditions_terms' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update the quotation terms
            $updateData = [
                // Legacy terms
                'taxes_terms' => $validated['taxes'],
                'warranty_terms' => $validated['warranty'],
                'delivery_terms' => $validated['delivery_terms'],
                'payment_terms' => $validated['payment_terms'],
                'electrical_terms' => $validated['electrical_terms'],

                // New comprehensive terms
                'general_pricing_terms' => $validated['general_pricing_terms'],
                'general_warranty_terms' => $validated['general_warranty_terms'],
                'general_delivery_terms' => $validated['general_delivery_terms'],
                'general_payment_terms' => $validated['general_payment_terms'],
                'general_site_readiness_terms' => $validated['general_site_readiness_terms'],
                'general_installation_scope_terms' => $validated['general_installation_scope_terms'],
                'general_ownership_risk_terms' => $validated['general_ownership_risk_terms'],
                'general_force_majeure_terms' => $validated['general_force_majeure_terms'],
                'indoor_data_connectivity_terms' => $validated['indoor_data_connectivity_terms'],
                'indoor_infrastructure_readiness_terms' => $validated['indoor_infrastructure_readiness_terms'],
                'indoor_logistics_support_terms' => $validated['indoor_logistics_support_terms'],
                'indoor_general_conditions_terms' => $validated['indoor_general_conditions_terms'],
                'outdoor_approvals_permissions_terms' => $validated['outdoor_approvals_permissions_terms'],
                'outdoor_data_connectivity_terms' => $validated['outdoor_data_connectivity_terms'],
                'outdoor_power_mounting_terms' => $validated['outdoor_power_mounting_terms'],
                'outdoor_logistics_site_access_terms' => $validated['outdoor_logistics_site_access_terms'],
                'outdoor_general_conditions_terms' => $validated['outdoor_general_conditions_terms'],
            ];

            $quotation->update($updateData);

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
            $newQuotation->reference = $quotation->generateRevisionReferenceNumber();
            $newQuotation->created_by = $request->user()->id;
            $newQuotation->updated_by = $request->user()->id;
            $newQuotation->last_action = 'created_version';
            $newQuotation->approved_at = null;
            $newQuotation->approved_by = null;
            $newQuotation->rejected_at = null;
            $newQuotation->rejected_by = null;
            $newQuotation->rejection_reason = null;
            $newQuotation->requires_pricing_approval = false;
            $newQuotation->pricing_approval_notes = null;
            $newQuotation->sub_status = null;
            $newQuotation->sub_status_updated_at = null;
            $newQuotation->sub_status_notes = null;
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

            $message = $quotation->status === 'order_received'
                ? 'Repeat order created successfully. You can now edit pricing for this customer.'
                : 'New version created successfully.';

            return redirect()->route('quotations.edit', $newQuotation->id)
                ->with('success', $message);
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
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg,pdf|max:5120',
            'category' => 'required|string|in:image,pdf,brochure,supplement',
            'mime_type' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $file = $request->file('file');
            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $filePath = 'quotation-images/' . $quotation->id;
            $fullPath = "{$filePath}/{$fileName}";

            if (!Storage::disk('public')->put($fullPath, file_get_contents($file->getRealPath()))) {
                throw new \Exception('Failed to store the file');
            }

            QuotationMedia::create([
                'quotation_id' => $quotation->id,
                'category' => $validated['category'],
                'name' => $file->getClientOriginalName(),
                'file_name' => $fileName,
                'file_path' => $filePath,
                'mime_type' => $validated['mime_type'] ?? $file->getMimeType(),
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
        try {
            // Check if user can view the quotation
            if (auth()->user()->cannot('view', $quotation)) {
                abort(403, 'You are not authorized to view this quotation.');
            }

            $commonFiles = QuotationMedia::where('category', $quotation->category)->get();
            $quotationFiles = QuotationMedia::where('quotation_id', $quotation->id)->get();

            // Load quotation with all necessary relationships
            $quotation->load(['items.product', 'account', 'account_contact']);

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.quotation', [
                'quotation' => $quotation,
                'commonFiles' => $commonFiles,
                'quotationFiles' => $quotationFiles,
                'user' => auth()->user()
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

            // Disable PDF merging due to compatibility issues with DomPDF
            // The merger causes encoding/language issues
            $enablePdfMerging = false;

            // Check if there are uploaded PDF files to merge
            $uploadedPdfs = $quotationFiles->filter(function($file) {
                $fileName = strtolower($file->file_name ?? '');
                $name = strtolower($file->name ?? '');
                return $file->category === 'pdf' ||
                       substr($fileName, -4) === '.pdf' ||
                       substr($name, -4) === '.pdf';
            });

            // If there are PDFs to merge, use PDF merger
            if ($enablePdfMerging && $uploadedPdfs->count() > 0) {
                try {
                    // Save the main PDF temporarily
                    $tempMainPdf = storage_path('app/temp/quotation_' . $quotation->id . '_main.pdf');

                    // Ensure temp directory exists
                    if (!file_exists(storage_path('app/temp'))) {
                        mkdir(storage_path('app/temp'), 0755, true);
                    }

                    $pdf->save($tempMainPdf);

                    // Initialize PDF merger
                    $pdfMerger = \Webklex\PDFMerger\Facades\PDFMergerFacade::init();

                    // Add main quotation PDF
                    $pdfMerger->addPDF($tempMainPdf, 'all');

                    // Add each uploaded PDF
                    foreach ($uploadedPdfs as $uploadedPdf) {
                        $pdfPath = storage_path('app/public/' . $uploadedPdf->file_path . '/' . $uploadedPdf->file_name);
                        if (file_exists($pdfPath)) {
                            $pdfMerger->addPDF($pdfPath, 'all');
                        }
                    }

                    // Merge and save
                    $mergedPdfPath = storage_path('app/temp/quotation_' . $quotation->id . '_merged.pdf');
                    $pdfMerger->merge();
                    $pdfMerger->save($mergedPdfPath);

                    // Download the merged PDF
                    $response = response()->download($mergedPdfPath, "quotation_{$filename}.pdf");

                    // Clean up temp files after download
                    register_shutdown_function(function() use ($tempMainPdf, $mergedPdfPath) {
                        if (file_exists($tempMainPdf)) @unlink($tempMainPdf);
                        if (file_exists($mergedPdfPath)) @unlink($mergedPdfPath);
                    });

                    return $response;
                } catch (\Exception $e) {
                    // If PDF merge fails, log it and return normal PDF
                    \Log::error('PDF merge failed: ' . $e->getMessage());

                    // Clean up any temp files
                    if (isset($tempMainPdf) && file_exists($tempMainPdf)) @unlink($tempMainPdf);
                    if (isset($mergedPdfPath) && file_exists($mergedPdfPath)) @unlink($mergedPdfPath);

                    // Return normal PDF as fallback
                    return $pdf->download("quotation_{$filename}.pdf");
                }
            }

            // No PDFs to merge, return normal PDF
            return $pdf->download("quotation_{$filename}.pdf");

        } catch (\Exception $e) {
            abort(500, 'Failed to generate PDF: ' . $e->getMessage());
        }
    }

    public function markAsOrderReceived(Request $request, Quotation $quotation)
    {
        try {
            // Update the quotation status
            $quotation->update([
                'status' => 'order_received',
                'updated_by' => $request->user()->id,
                'last_action' => 'order_received',
                'editable' => false,
            ]);

            return back()->with('success', 'Quotation marked as order received successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to mark quotation as order received.');
        }
    }

    /**
     * Update sub-status for approved quotations
     */
    public function updateSubStatus(Request $request, Quotation $quotation)
    {
        // Only approved quotations can have sub-status
        if ($quotation->status !== Quotation::STATUS_APPROVED) {
            return response()->json([
                'success' => false,
                'message' => 'Sub-status can only be updated for approved quotations.'
            ], 400);
        }

        $validated = $request->validate([
            'sub_status' => 'required|in:open,hot,cold',
            'sub_status_notes' => 'nullable|string',
        ]);

        try {
            $quotation->setSubStatus(
                $validated['sub_status'],
                $validated['sub_status_notes'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Sub-status updated successfully.',
                'quotation' => $quotation->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sub-status.'
            ], 500);
        }
    }

    /**
     * Automatically attach product specification images to quotation
     */
    private function attachProductSpecificationImages(Quotation $quotation)
    {
        // Get all products in this quotation that have specification images
        $quotation->load('items.product');

        foreach ($quotation->items as $item) {
            $product = $item->product;

            if ($product && $product->hasSpecificationImage()) {
                // Check if this specification image is already attached
                $exists = QuotationMedia::where('quotation_id', $quotation->id)
                    ->where('file_name', $product->specification_image)
                    ->exists();

                if (!$exists) {
                    // Attach the specification image
                    $filePath = storage_path('app/public/' . $product->specification_image_path . '/' . $product->specification_image);

                    if (file_exists($filePath)) {
                        QuotationMedia::create([
                            'quotation_id' => $quotation->id,
                            'category' => 'image',
                            'name' => 'Specification - ' . $product->name,
                            'file_name' => $product->specification_image,
                            'file_path' => $product->specification_image_path,
                            'mime_type' => mime_content_type($filePath),
                            'file_size' => filesize($filePath),
                            'is_active' => true,
                            'sort_order' => 999, // Put specification images at the end
                            'created_by' => auth()->id() ?? 1, // Default to user ID 1 if no auth
                            'updated_by' => auth()->id() ?? 1, // Default to user ID 1 if no auth
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Automatically attach default files to a quotation
     */
    private function attachDefaultFiles(Quotation $quotation)
    {
        // Get default files (files with null quotation_id)
        $defaultFiles = QuotationMedia::whereNull('quotation_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        foreach ($defaultFiles as $defaultFile) {
            // Create a copy of the default file for this quotation
            QuotationMedia::create([
                'quotation_id' => $quotation->id,
                'category' => $defaultFile->category,
                'name' => $defaultFile->name,
                'file_name' => $defaultFile->file_name,
                'file_path' => $defaultFile->file_path,
                'mime_type' => $defaultFile->mime_type,
                'file_size' => $defaultFile->file_size,
                'is_active' => true,
                'sort_order' => $defaultFile->sort_order,
                'created_by' => $defaultFile->created_by,
                'updated_by' => $defaultFile->updated_by,
            ]);
        }
    }

}
