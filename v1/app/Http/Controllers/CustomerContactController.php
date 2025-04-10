<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerContact;
use App\Http\Resources\CustomerContactResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Customer $customer)
    {
        $contacts = $customer->contacts()
            ->orderBy('name')
            ->get();

        return Inertia::render('customers/contacts/index', [
            'customer' => $customer,
            'contacts' => CustomerContactResource::collection($contacts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Customer $customer)
    {
        return Inertia::render('customers/contacts/create', [
            'customer' => $customer,
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive'
        ]);

        $customer->contacts()->create($validated);

        return redirect()->route('customers.contacts.index', $customer)
            ->with('success', 'Contact created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer, CustomerContact $contact)
    {
        return Inertia::render('customers/contacts/show', [
            'customer' => $customer,
            'contact' => new CustomerContactResource($contact),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer, CustomerContact $contact)
    {
        return Inertia::render('customers/contacts/edit', [
            'customer' => $customer,
            'contact' => new CustomerContactResource($contact),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer, CustomerContact $contact)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive'
        ]);

        $contact->update($validated);

        return redirect()->route('customers.contacts.index', $customer)
            ->with('success', 'Contact updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer, CustomerContact $contact)
    {
        $contact->delete();

        return redirect()->route('customers.contacts.index', $customer)
            ->with('success', 'Contact deleted successfully.');
    }
}
