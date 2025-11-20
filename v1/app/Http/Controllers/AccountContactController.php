<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountContact;
use App\Http\Resources\AccountContactResource;
use App\Http\Resources\AccountResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Account $account)
    {
        if ($request->user()->cannot('view', $account)) {
            abort(403);
        }

        $contacts = $account->contacts()
            ->with('account')
            ->orderBy('name')
            ->get();

        return Inertia::render('accounts/contacts/index', [
            'account' => new AccountResource($account),
            'contacts' => AccountContactResource::collection($contacts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, Account $account)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

        return Inertia::render('accounts/contacts/create', [
            'account' => new AccountResource($account),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Account $account)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

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
    // public function show(Account $account, AccountContact $contact)
    // {
    //     if ($request->user()->cannot('view', $account)) {
    //         abort(403);
    //     }

    //     return Inertia::render('accounts/contacts/show', [
    //         'account' => $account,
    //         'contact' => new AccountContactResource($contact),
    //     ]);
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Account $account, AccountContact $contact)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

        return Inertia::render('accounts/contacts/edit', [
            'account' => new AccountResource($account),
            'contact' => new AccountContactResource($contact),
            'statuses' => config('all.statuses'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account, AccountContact $contact)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

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
    public function destroy(Request $request, Account $account, AccountContact $contact)
    {
        if ($request->user()->cannot('delete', $account)) {
            abort(403);
        }

        $contact->delete();

        return redirect()->route('accounts.contacts.index', $account)
            ->with('success', 'Contact deleted successfully.');
    }
}
