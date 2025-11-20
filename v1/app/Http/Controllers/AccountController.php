<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Http\Resources\AccountResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{

    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', Account::class)) {
            abort(403);
        }

        $accounts = Account::with('contacts')
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('business_name', 'like', "%{$search}%")
                      ->orWhere('gst_number', 'like', "%{$search}%")
                      ->orWhere('business_id', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                if ($status != 'all') {
                    $query->where('status', $status);
                }
            })
            ->orderBy('business_name')
            ->paginate(config('all.pagination.per_page'));

        return Inertia::render('accounts/index', [
            'accounts' => AccountResource::collection($accounts),
            'filters' => $request->only(['search', 'status']),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function create(Request $request)
    {
        if ($request->user()->cannot('create', Account::class)) {
            abort(403);
        }

        return Inertia::render('accounts/create', [
            'industry_types' => config('all.industry_types'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Account::class)) {
            abort(403);
        }

        $validated = $request->validate([
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
            'region' => 'nullable|string|max:255',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:active,inactive'
        ]);
        $account = Account::create($validated);
        $account->business_id = 'ACC-' . date('Y') . '-' . str_pad($account->id, 5, '0', STR_PAD_LEFT);
        $account->save();
        return redirect()->route('accounts.index')
            ->with('success', 'Account created successfully.');
    }

    public function show(Request $request, Account $account)
    {
        if ($request->user()->cannot('view', $account)) {
            abort(403);
        }

        $account->load(['contacts' => function ($query) {
            $query->orderBy('name');
        }]);

        return Inertia::render('accounts/show', [
            'account' => new AccountResource($account),
        ]);
    }

    public function edit(Request $request, Account $account)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

        return Inertia::render('accounts/edit', [
            'account' => new AccountResource($account),
            'industry_types' => config('all.industry_types'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function update(Request $request, Account $account)
    {
        if ($request->user()->cannot('update', $account)) {
            abort(403);
        }

        $validated = $request->validate([
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
            'region' => 'nullable|string|max:255',
            'same_as_billing' => 'boolean',
            'status' => 'required|in:active,inactive'
        ]);

        $account->update($validated);

        return redirect()->route('accounts.index')
            ->with('success', 'Account updated successfully.');
    }

    public function destroy(Request $request, Account $account)
    {
        if ($request->user()->cannot('delete', $account)) {
            abort(403);
        }

        $account->delete();

        return redirect()->route('accounts.index')
            ->with('success', 'Account deleted successfully.');
    }
}
