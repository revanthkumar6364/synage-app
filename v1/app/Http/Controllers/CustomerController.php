<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{

    public function index(Request $request)
    {

        $customers = Customer::with('contacts')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('business_name', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('business_name')
            ->paginate(config('all.pagination.per_page'));

        return Inertia::render('customers/index', [
            'customers' => CustomerResource::collection($customers),
            'filters' => $request->only(['search', 'status']),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function create()
    {
        return Inertia::render('customers/create', [
            'industry_types' => config('all.industry_types'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|unique:customers',
            'business_name' => 'required|string|max:255',
            'gst_number' => 'nullable|string|max:255',
            'industry_type' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string',
            'billing_location' => 'nullable|string|max:255',
            'billing_city' => 'nullable|string|max:255',
            'billing_zip_code' => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string',
            'shipping_location' => 'nullable|string|max:255',
            'shipping_city' => 'nullable|string|max:255',
            'shipping_zip_code' => 'nullable|string|max:255',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:active,inactive'
        ]);

        $customer = Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load(['contacts' => function ($query) {
            $query->orderBy('name');
        }]);

        return Inertia::render('customers/show', [
            'customer' => new CustomerResource($customer),
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', [
            'customer' => new CustomerResource($customer),
            'industry_types' => config('all.industry_types'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'business_id' => 'required|unique:customers,business_id,' . $customer->id,
            'business_name' => 'required|string|max:255',
            'gst_number' => 'nullable|string|max:255',
            'industry_type' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string',
            'billing_location' => 'nullable|string|max:255',
            'billing_city' => 'nullable|string|max:255',
            'billing_zip_code' => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string',
            'shipping_location' => 'nullable|string|max:255',
            'shipping_city' => 'nullable|string|max:255',
            'shipping_zip_code' => 'nullable|string|max:255',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:active,inactive'
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
