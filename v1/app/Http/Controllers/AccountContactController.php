<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountContact;
use App\Http\Resources\AccountContactResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Account $account)
    {
        $contacts = $account->contacts()
            ->orderBy('name')
            ->get();

        return Inertia::render('accounts/contacts/index', [
            'account' => $account,
            'contacts' => AccountContactResource::collection($contacts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Account $account)
    {
        return Inertia::render('accounts/contacts/create', [
            'account' => $account,
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Account $account)
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

        $account->contacts()->create($validated);

        return redirect()->route('accounts.contacts.index', $account)
            ->with('success', 'Contact created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account, AccountContact $contact)
    {
        return Inertia::render('accounts/contacts/show', [
            'account' => $account,
            'contact' => new AccountContactResource($contact),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account, AccountContact $contact)
    {
        return Inertia::render('accounts/contacts/edit', [
            'account' => $account,
            'contact' => new AccountContactResource($contact),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account, AccountContact $contact)
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

        return redirect()->route('accounts.contacts.index', $account)
            ->with('success', 'Contact updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account, AccountContact $contact)
    {
        $contact->delete();

        return redirect()->route('accounts.contacts.index', $account)
            ->with('success', 'Contact deleted successfully.');
    }
}
