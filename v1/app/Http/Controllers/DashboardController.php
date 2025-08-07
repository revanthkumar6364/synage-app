<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Account;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $authUser = auth()->user();

        // Initialize stats array
        $stats = [
            'totalQuotations' => 0,
            'approvedQuotations' => 0,
            'pendingQuotations' => 0,
            'draftQuotations' => 0,
            'totalRevenue' => 0,
            'conversionRate' => 0,
        ];

        // Only show quotation stats if user can view quotations
        if (Gate::allows('viewAny', Quotation::class)) {
            // Base query with role-based filtering
            $baseQuery = Quotation::query();
            if ($authUser->role === 'sales') {
                $baseQuery->where('sales_user_id', $authUser->id);
            }

            // Get statistics
            $totalQuotations = $baseQuery->count();
            $approvedQuotations = $baseQuery->where('status', 'approved')->count();
            $pendingQuotations = $baseQuery->where('status', 'pending')->count();
            $draftQuotations = $baseQuery->where('status', 'draft')->count();

            // Calculate conversion rate
            $conversionRate = $totalQuotations > 0 ? round(($approvedQuotations / $totalQuotations) * 100, 1) : 0;

            // Calculate total revenue from approved quotations
            $totalRevenue = $baseQuery->where('status', 'approved')->sum('grand_total');

            $stats = [
                'totalQuotations' => $totalQuotations,
                'approvedQuotations' => $approvedQuotations,
                'pendingQuotations' => $pendingQuotations,
                'draftQuotations' => $draftQuotations,
                'totalRevenue' => $totalRevenue ?? 0,
                'conversionRate' => $conversionRate,
            ];
        }

        // Get permissions for quick actions
        $permissions = [
            'canCreateQuotations' => Gate::allows('create', Quotation::class),
            'canViewQuotations' => Gate::allows('viewAny', Quotation::class),
            'canViewAccounts' => Gate::allows('viewAny', Account::class),
            'canCreateAccounts' => Gate::allows('create', Account::class),
            'canViewProducts' => Gate::allows('viewAny', Product::class),
            'canCreateProducts' => Gate::allows('create', Product::class),
            'canViewUsers' => Gate::allows('viewAny', User::class),
            'canViewReports' => in_array($authUser->role, ['admin', 'manager']),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'permissions' => $permissions,
        ]);
    }
}
