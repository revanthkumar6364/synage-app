<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Account;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        // Get summary statistics
        $summaryStats = $this->getSummaryStats();

        return Inertia::render('reports/index', [
            'summaryStats' => $summaryStats,
        ]);
    }

    public function clientBased(Request $request)
    {
        $query = Quotation::with(['account', 'account_contact', 'creator', 'salesUser']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('quotations.status', $request->status);
        }

        // Date range filters
        if ($request->filled('dateFrom')) {
            $query->where('quotations.estimate_date', '>=', $request->dateFrom);
        }
        if ($request->filled('dateTo')) {
            $query->where('quotations.estimate_date', '<=', $request->dateTo);
        }

        // Account filter
        if ($request->filled('account')) {
            $query->whereHas('account', function ($q) use ($request) {
                $q->where('business_name', $request->account);
            });
        }

        // Sales person filter
        if ($request->filled('salesPerson')) {
            $query->whereHas('salesUser', function ($q) use ($request) {
                $q->where('name', $request->salesPerson);
            });
        }

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        // Get all filtered data first
        $filteredQuotations = $query->orderBy('created_at', 'desc')->get();

        // Transform data for frontend
        $reportData = $filteredQuotations->map(function ($quotation) {
            $amount = $quotation->grand_total;
            if ($amount === null || $amount == 0) {
                $amount = $quotation->items->sum(function ($item) {
                    $quantity = floatval($item->quantity ?? 0);
                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                    $taxPercentage = floatval($item->tax_percentage ?? 0);
                    $subtotal = $quantity * $unitPrice;
                    $taxAmount = $subtotal * ($taxPercentage / 100);
                    return $subtotal + $taxAmount;
                });
            }

            return [
                'id' => $quotation->id,
                'reference' => $quotation->reference,
                'accountName' => $quotation->account->business_name ?? 'Unknown Account',
                'contactPerson' => $quotation->account_contact->name ?? 'N/A',
                'salesPerson' => $quotation->salesUser->name ?? 'Unknown',
                'amount' => $amount ?? 0,
                'status' => $quotation->status,
                'createdAt' => $quotation->created_at->format('M d, Y'),
            ];
        });

        // Apply amount range filter
        if ($request->filled('amountFrom') || $request->filled('amountTo')) {
            $reportData = $reportData->filter(function ($item) use ($request) {
                $amount = $item['amount'];
                if ($request->filled('amountFrom') && $amount < floatval($request->amountFrom)) {
                    return false;
                }
                if ($request->filled('amountTo') && $amount > floatval($request->amountTo)) {
                    return false;
                }
                return true;
            });
        }

        // Manual pagination for filtered data
        $perPage = 10;
        $currentPage = $request->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedData = $reportData->slice($offset, $perPage);
        $total = $reportData->count();
        $lastPage = ceil($total / $perPage);

        return Inertia::render('reports/client-based', [
            'reportData' => $paginatedData->values(),
            'pagination' => [
                'current_page' => (int)$currentPage,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
            ],
            'filters' => $request->only(['search', 'status', 'dateFrom', 'dateTo', 'amountFrom', 'amountTo', 'account', 'salesPerson']),
        ]);
    }

    public function sales(Request $request)
    {
        $query = Quotation::with(['account', 'salesUser']);

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        // Get sales data by category
        $salesData = $this->getSalesDataByCategory($query);

        // Apply frontend filters
        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);
            $salesData = collect($salesData)->filter(function ($item) use ($searchTerm) {
                return str_contains(strtolower($item['salesCategory']), $searchTerm) ||
                       str_contains(strtolower($item['type']), $searchTerm);
            })->values()->all();
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $salesData = collect($salesData)->filter(function ($item) use ($request) {
                return $item['type'] === $request->category;
            })->values()->all();
        }

        // Get summary statistics
        $summaryStats = $this->getSalesSummaryStats($salesData, $query);

        return Inertia::render('reports/sales', [
            'salesData' => $salesData,
            'summaryStats' => $summaryStats,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function charts(Request $request)
    {
        $query = Quotation::with(['account', 'salesUser']);

        // Apply filters
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('quotations.status', $request->status);
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        // Get session filter (weekly, monthly, yearly)
        $sessionFilter = $request->get('session', 'monthly');

        // Get chart data
        $chartData = $this->getChartData($query, $sessionFilter);

        return Inertia::render('reports/charts', [
            'chartData' => $chartData,
            'filters' => $request->only(['status', 'category', 'session']),
        ]);
    }

    public function estimates(Request $request)
    {
        $query = Quotation::with(['account', 'account_contact', 'creator', 'salesUser']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('quotations.status', $request->status);
        }

        // Date range filters
        if ($request->filled('dateFrom')) {
            $query->where('quotations.estimate_date', '>=', $request->dateFrom);
        }
        if ($request->filled('dateTo')) {
            $query->where('quotations.estimate_date', '<=', $request->dateTo);
        }

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        // Get all filtered data first for analytics
        $filteredQuotations = $query->orderBy('created_at', 'desc')->get();

        // Calculate analytics from filtered data
        $analytics = $this->getEstimateAnalytics($filteredQuotations);

        // Transform data for frontend
        $estimateData = $filteredQuotations->map(function ($quotation) {
            $amount = $quotation->grand_total;
            if ($amount === null || $amount == 0) {
                $amount = $quotation->items->sum(function ($item) {
                    $quantity = floatval($item->quantity ?? 0);
                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                    $taxPercentage = floatval($item->tax_percentage ?? 0);
                    $subtotal = $quantity * $unitPrice;
                    $taxAmount = $subtotal * ($taxPercentage / 100);
                    return $subtotal + $taxAmount;
                });
            }

            return [
                'id' => $quotation->id,
                'reference' => $quotation->reference,
                'clientName' => $quotation->account->business_name ?? 'Unknown Client',
                'salesPerson' => $quotation->salesUser->name ?? 'Unknown',
                'amount' => $amount ?? 0,
                'status' => $quotation->status,
                'createdAt' => $quotation->created_at->format('M d, Y'),
            ];
        });

        // Apply amount range filter
        if ($request->filled('amountFrom') || $request->filled('amountTo')) {
            $estimateData = $estimateData->filter(function ($item) use ($request) {
                $amount = $item['amount'];
                if ($request->filled('amountFrom') && $amount < floatval($request->amountFrom)) {
                    return false;
                }
                if ($request->filled('amountTo') && $amount > floatval($request->amountTo)) {
                    return false;
                }
                return true;
            });
        }

        // Manual pagination for filtered data
        $perPage = 10;
        $currentPage = $request->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedData = $estimateData->slice($offset, $perPage);
        $total = $estimateData->count();
        $lastPage = ceil($total / $perPage);

        return Inertia::render('reports/estimates', [
            'estimateData' => $paginatedData->values(),
            'pagination' => [
                'current_page' => (int)$currentPage,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
            ],
            'analytics' => $analytics,
            'filters' => $request->only(['search', 'status', 'dateFrom', 'dateTo', 'amountFrom', 'amountTo']),
        ]);
    }

    private function getSummaryStats()
    {
        $query = Quotation::query();

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        $totalEstimates = $query->count();
        $convertedEstimates = $query->where('quotations.status', 'approved')->count();
        $conversionRate = $totalEstimates > 0 ? ($convertedEstimates / $totalEstimates) * 100 : 0;
        $totalRevenue = $query->where('quotations.status', 'approved')->sum('grand_total');

        return [
            'totalEstimates' => $totalEstimates,
            'convertedEstimates' => $convertedEstimates,
            'conversionRate' => round($conversionRate, 1),
            'totalRevenue' => $totalRevenue ?? 0,
        ];
    }

    private function getSalesDataByCategory($baseQuery)
    {
        $categories = ['User', 'Project', 'Industry', 'Region', 'Product Type'];
        $salesData = [];
        $uniqueKeys = []; // Track unique combinations to prevent duplicates

        foreach ($categories as $category) {
            switch ($category) {
                case 'User':
                    $estimates = clone $baseQuery;
                    $estimates = $estimates->select('sales_user_id', DB::raw('count(*) as estimates'))
                        ->groupBy('sales_user_id')
                        ->get();

                    $converted = clone $baseQuery;
                    $converted = $converted->where('quotations.status', 'approved')
                        ->select('sales_user_id', DB::raw('count(*) as converted'))
                        ->groupBy('sales_user_id')
                        ->get();

                    foreach ($estimates as $estimate) {
                        $userName = User::find($estimate->sales_user_id)?->name ?? 'Unknown User';
                        $uniqueKey = 'User_' . $estimate->sales_user_id;

                        // Skip if we already have this entry
                        if (in_array($uniqueKey, $uniqueKeys)) {
                            continue;
                        }
                        $uniqueKeys[] = $uniqueKey;

                        $convertedCount = $converted->where('sales_user_id', $estimate->sales_user_id)->first()?->converted ?? 0;
                        $conversionPercentage = $estimate->estimates > 0 ? ($convertedCount / $estimate->estimates) * 100 : 0;

                        // Get quotations for this user to calculate total sales
                        $userQuotations = clone $baseQuery;
                        $userQuotations = $userQuotations->where('sales_user_id', $estimate->sales_user_id)
                            ->where('quotations.status', 'approved')
                            ->with('items')
                            ->get();

                        $totalSales = $userQuotations->sum(function ($quotation) {
                            // Simple test: just use grand_total first
                            $amount = $quotation->grand_total ?? 0;

                            if ($amount == 0) {
                                // Calculate from items if grand_total is not set
                                $amount = $quotation->items->sum(function ($item) {
                                    $quantity = floatval($item->quantity ?? 0);
                                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                                    $taxPercentage = floatval($item->tax_percentage ?? 0);

                                    $subtotal = $quantity * $unitPrice;
                                    $taxAmount = $subtotal * ($taxPercentage / 100);

                                    return $subtotal + $taxAmount;
                                });
                            }
                            return $amount ?? 0;
                        });

                        $salesData[] = [
                            'id' => $estimate->sales_user_id,
                            'type' => 'User',
                            'salesCategory' => $userName,
                            'estimates' => $estimate->estimates,
                            'converted' => $convertedCount,
                            'conversionPercentage' => round($conversionPercentage, 1),
                            'totalSales' => $totalSales,
                        ];
                    }
                    break;

                case 'Project':
                    $estimates = clone $baseQuery;
                    $estimates = $estimates->select('category', DB::raw('count(*) as estimates'))
                        ->groupBy('category')
                        ->get();

                    $converted = clone $baseQuery;
                    $converted = $converted->where('quotations.status', 'approved')
                        ->select('category', DB::raw('count(*) as converted'))
                        ->groupBy('category')
                        ->get();

                    foreach ($estimates as $estimate) {
                        $categoryName = ucfirst(str_replace('_', ' ', $estimate->category));
                        $uniqueKey = 'Project_' . $estimate->category;

                        // Skip if we already have this entry
                        if (in_array($uniqueKey, $uniqueKeys)) {
                            continue;
                        }
                        $uniqueKeys[] = $uniqueKey;

                        $convertedCount = $converted->where('category', $estimate->category)->first()?->converted ?? 0;
                        $conversionPercentage = $estimate->estimates > 0 ? ($convertedCount / $estimate->estimates) * 100 : 0;

                        // Get quotations for this category to calculate total sales
                        $categoryQuotations = clone $baseQuery;
                        $categoryQuotations = $categoryQuotations->where('category', $estimate->category)
                            ->where('quotations.status', 'approved')
                            ->with('items')
                            ->get();

                        $totalSales = $categoryQuotations->sum(function ($quotation) {
                            // Simple test: just use grand_total first
                            $amount = $quotation->grand_total ?? 0;

                            if ($amount == 0) {
                                // Calculate from items if grand_total is not set
                                $amount = $quotation->items->sum(function ($item) {
                                    $quantity = floatval($item->quantity ?? 0);
                                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                                    $taxPercentage = floatval($item->tax_percentage ?? 0);

                                    $subtotal = $quantity * $unitPrice;
                                    $taxAmount = $subtotal * ($taxPercentage / 100);

                                    return $subtotal + $taxAmount;
                                });
                            }
                            return $amount ?? 0;
                        });

                        $salesData[] = [
                            'id' => 'project_' . $estimate->category,
                            'type' => 'Project',
                            'salesCategory' => $categoryName,
                            'estimates' => $estimate->estimates,
                            'converted' => $convertedCount,
                            'conversionPercentage' => round($conversionPercentage, 1),
                            'totalSales' => $totalSales,
                        ];
                    }
                    break;

                case 'Industry':
                    $estimates = clone $baseQuery;
                    $estimates = $estimates->join('accounts as a1', 'quotations.account_id', '=', 'a1.id')
                        ->select('a1.industry_type', DB::raw('count(*) as estimates'))
                        ->groupBy('a1.industry_type')
                        ->get();

                    $converted = clone $baseQuery;
                    $converted = $converted->join('accounts as a2', 'quotations.account_id', '=', 'a2.id')
                        ->where('quotations.status', 'approved')
                        ->select('a2.industry_type', DB::raw('count(*) as converted'))
                        ->groupBy('a2.industry_type')
                        ->get();

                    foreach ($estimates as $estimate) {
                        $industryName = $estimate->industry_type ?? 'Unknown Industry';
                        $uniqueKey = 'Industry_' . $industryName;

                        // Skip if we already have this entry
                        if (in_array($uniqueKey, $uniqueKeys)) {
                            continue;
                        }
                        $uniqueKeys[] = $uniqueKey;

                        $convertedCount = $converted->where('industry_type', $estimate->industry_type)->first()?->converted ?? 0;
                        $conversionPercentage = $estimate->estimates > 0 ? ($convertedCount / $estimate->estimates) * 100 : 0;

                        // Get quotations for this industry to calculate total sales
                        $industryQuotations = clone $baseQuery;
                        $industryQuotations = $industryQuotations->join('accounts as a3', 'quotations.account_id', '=', 'a3.id')
                            ->where('a3.industry_type', $estimate->industry_type)
                            ->where('quotations.status', 'approved')
                            ->with('items')
                            ->get();

                        $totalSales = $industryQuotations->sum(function ($quotation) {
                            // Simple test: just use grand_total first
                            $amount = $quotation->grand_total ?? 0;

                            if ($amount == 0) {
                                // Calculate from items if grand_total is not set
                                $amount = $quotation->items->sum(function ($item) {
                                    $quantity = floatval($item->quantity ?? 0);
                                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                                    $taxPercentage = floatval($item->tax_percentage ?? 0);

                                    $subtotal = $quantity * $unitPrice;
                                    $taxAmount = $subtotal * ($taxPercentage / 100);

                                    return $subtotal + $taxAmount;
                                });
                            }
                            return $amount ?? 0;
                        });

                        $salesData[] = [
                            'id' => 'industry_' . $estimate->industry_type,
                            'type' => 'Industry',
                            'salesCategory' => $industryName,
                            'estimates' => $estimate->estimates,
                            'converted' => $convertedCount,
                            'conversionPercentage' => round($conversionPercentage, 1),
                            'totalSales' => $totalSales,
                        ];
                    }
                    break;

                case 'Region':
                    $estimates = clone $baseQuery;
                    $estimates = $estimates->join('accounts as a1', 'quotations.account_id', '=', 'a1.id')
                        ->select('a1.region', DB::raw('count(*) as estimates'))
                        ->groupBy('a1.region')
                        ->get();

                    $converted = clone $baseQuery;
                    $converted = $converted->join('accounts as a2', 'quotations.account_id', '=', 'a2.id')
                        ->where('quotations.status', 'approved')
                        ->select('a2.region', DB::raw('count(*) as converted'))
                        ->groupBy('a2.region')
                        ->get();

                    foreach ($estimates as $estimate) {
                        $regionName = $estimate->region ?? 'Unknown Region';
                        $uniqueKey = 'Region_' . $regionName;

                        // Skip if we already have this entry
                        if (in_array($uniqueKey, $uniqueKeys)) {
                            continue;
                        }
                        $uniqueKeys[] = $uniqueKey;

                        $convertedCount = $converted->where('region', $estimate->region)->first()?->converted ?? 0;
                        $conversionPercentage = $estimate->estimates > 0 ? ($convertedCount / $estimate->estimates) * 100 : 0;

                        // Get quotations for this region to calculate total sales
                        $regionQuotations = clone $baseQuery;
                        $regionQuotations = $regionQuotations->join('accounts as a3', 'quotations.account_id', '=', 'a3.id')
                            ->where('a3.region', $estimate->region)
                            ->where('quotations.status', 'approved')
                            ->with('items')
                            ->get();

                        $totalSales = $regionQuotations->sum(function ($quotation) {
                            // Simple test: just use grand_total first
                            $amount = $quotation->grand_total ?? 0;

                            if ($amount == 0) {
                                // Calculate from items if grand_total is not set
                                $amount = $quotation->items->sum(function ($item) {
                                    $quantity = floatval($item->quantity ?? 0);
                                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                                    $taxPercentage = floatval($item->tax_percentage ?? 0);

                                    $subtotal = $quantity * $unitPrice;
                                    $taxAmount = $subtotal * ($taxPercentage / 100);

                                    return $subtotal + $taxAmount;
                                });
                            }
                            return $amount ?? 0;
                        });

                        $salesData[] = [
                            'id' => 'region_' . $estimate->region,
                            'type' => 'Region',
                            'salesCategory' => $regionName,
                            'estimates' => $estimate->estimates,
                            'converted' => $convertedCount,
                            'conversionPercentage' => round($conversionPercentage, 1),
                            'totalSales' => $totalSales,
                        ];
                    }
                    break;

                case 'Product Type':
                    $estimates = clone $baseQuery;
                    $estimates = $estimates->select('product_type', DB::raw('count(*) as estimates'))
                        ->groupBy('product_type')
                        ->get();

                    $converted = clone $baseQuery;
                    $converted = $converted->where('quotations.status', 'approved')
                        ->select('product_type', DB::raw('count(*) as converted'))
                        ->groupBy('product_type')
                        ->get();

                    foreach ($estimates as $estimate) {
                        $productTypeName = ucfirst(str_replace('_', ' ', $estimate->product_type));
                        $uniqueKey = 'ProductType_' . $estimate->product_type;

                        // Skip if we already have this entry
                        if (in_array($uniqueKey, $uniqueKeys)) {
                            continue;
                        }
                        $uniqueKeys[] = $uniqueKey;

                        $convertedCount = $converted->where('product_type', $estimate->product_type)->first()?->converted ?? 0;
                        $conversionPercentage = $estimate->estimates > 0 ? ($convertedCount / $estimate->estimates) * 100 : 0;

                        // Get quotations for this product type to calculate total sales
                        $productQuotations = clone $baseQuery;
                        $productQuotations = $productQuotations->where('product_type', $estimate->product_type)
                            ->where('quotations.status', 'approved')
                            ->with('items')
                            ->get();

                        $totalSales = $productQuotations->sum(function ($quotation) {
                            // Simple test: just use grand_total first
                            $amount = $quotation->grand_total ?? 0;

                            if ($amount == 0) {
                                // Calculate from items if grand_total is not set
                                $amount = $quotation->items->sum(function ($item) {
                                    $quantity = floatval($item->quantity ?? 0);
                                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                                    $taxPercentage = floatval($item->tax_percentage ?? 0);

                                    $subtotal = $quantity * $unitPrice;
                                    $taxAmount = $subtotal * ($taxPercentage / 100);

                                    return $subtotal + $taxAmount;
                                });
                            }
                            return $amount ?? 0;
                        });

                        $salesData[] = [
                            'id' => 'producttype_' . $estimate->product_type,
                            'type' => 'Product Type',
                            'salesCategory' => $productTypeName,
                            'estimates' => $estimate->estimates,
                            'converted' => $convertedCount,
                            'conversionPercentage' => round($conversionPercentage, 1),
                            'totalSales' => $totalSales,
                        ];
                    }
                    break;
            }
        }

        return $salesData;
    }

    private function getSalesSummaryStats($salesData, $baseQuery)
    {
        // Calculate actual totals from the base query instead of summing category totals
        $totalEstimates = $baseQuery->count();
        $totalConverted = $baseQuery->where('quotations.status', 'approved')->count();
        $totalSales = $baseQuery->where('quotations.status', 'approved')->with('items')->get()->sum(function ($quotation) {
            $amount = $quotation->grand_total ?? 0;
            if ($amount == 0) {
                $amount = $quotation->items->sum(function ($item) {
                    $quantity = floatval($item->quantity ?? 0);
                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                    $taxPercentage = floatval($item->tax_percentage ?? 0);
                    $subtotal = $quantity * $unitPrice;
                    $taxAmount = $subtotal * ($taxPercentage / 100);
                    return $subtotal + $taxAmount;
                });
            }
            return $amount ?? 0;
        });
        $overallConversionRate = $totalEstimates > 0 ? ($totalConverted / $totalEstimates) * 100 : 0;

        return [
            'totalEstimates' => $totalEstimates,
            'totalConverted' => $totalConverted,
            'overallConversionRate' => round($overallConversionRate, 1),
            'totalSales' => $totalSales,
        ];
    }

    private function getChartData($baseQuery, $sessionFilter = 'monthly')
    {
        // Get data based on session filter
        $periods = collect();

        switch ($sessionFilter) {
            case 'weekly':
                // Get last 12 weeks
                for ($i = 11; $i >= 0; $i--) {
                    $date = Carbon::now()->subWeeks($i);
                    $periods->push([
                        'label' => $date->format('M d'),
                        'start' => Carbon::create($date->year, $date->month, $date->day, 0, 0, 0, config('app.timezone'))->startOfWeek(),
                        'end' => Carbon::create($date->year, $date->month, $date->day, 23, 59, 59, config('app.timezone'))->endOfWeek(),
                    ]);
                }
                break;

            case 'yearly':
                // Get last 5 years
                for ($i = 4; $i >= 0; $i--) {
                    $date = Carbon::now()->subYears($i);
                    $periods->push([
                        'label' => $date->format('Y'),
                        'start' => Carbon::create($date->year, 1, 1, 0, 0, 0, config('app.timezone')),
                        'end' => Carbon::create($date->year, 12, 31, 23, 59, 59, config('app.timezone')),
                    ]);
                }
                break;

            default: // monthly
                // Get last 6 months
                for ($i = 5; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $periods->push([
                        'label' => $date->format('M Y'),
                        'start' => Carbon::create($date->year, $date->month, 1, 0, 0, 0, config('app.timezone')),
                        'end' => Carbon::create($date->year, $date->month, $date->daysInMonth, 23, 59, 59, config('app.timezone')),
                    ]);
                }
                break;
        }

        // Estimates chart data with proper amount calculations
        $estimatesData = $periods->map(function ($periodData) use ($baseQuery) {
            // Clone the base query and apply date filters
            $periodQuery = clone $baseQuery;
            $periodQuery->whereBetween('estimate_date', [$periodData['start']->format('Y-m-d'), $periodData['end']->format('Y-m-d')]);

            $total = $periodQuery->count();

            $approvedQuery = clone $baseQuery;
            $approvedQuery->where('status', 'approved')->whereBetween('estimate_date', [$periodData['start']->format('Y-m-d'), $periodData['end']->format('Y-m-d')]);
            $approved = $approvedQuery->count();

            $pendingQuery = clone $baseQuery;
            $pendingQuery->where('status', 'pending')->whereBetween('estimate_date', [$periodData['start']->format('Y-m-d'), $periodData['end']->format('Y-m-d')]);
            $pending = $pendingQuery->count();

            return [
                'month' => $periodData['label'],
                'series1' => $total,
                'series2' => $approved,
                'series3' => $pending,
            ];
        });

        // Proforma invoice data with proper amount calculations
        $proformaData = $periods->map(function ($periodData) use ($baseQuery) {
            $proformaQuery = clone $baseQuery;
            $proformaQuery->where('status', 'approved')
                ->whereBetween('approved_at', [$periodData['start'], $periodData['end']])
                ->with('items');

            $quotations = $proformaQuery->get();

            $value = $quotations->sum(function ($quotation) {
                $amount = $quotation->grand_total;
                if ($amount === null || $amount == 0) {
                    $amount = $quotation->items->sum(function ($item) {
                        $quantity = floatval($item->quantity ?? 0);
                        $unitPrice = floatval($item->proposed_unit_price ?? 0);
                        $taxPercentage = floatval($item->tax_percentage ?? 0);
                        $subtotal = $quantity * $unitPrice;
                        $taxAmount = $subtotal * ($taxPercentage / 100);
                        return $subtotal + $taxAmount;
                    });
                }
                return $amount ?? 0;
            });

            return [
                'month' => $periodData['label'],
                'value' => $value,
            ];
        });

        // Conversion ratios with all statuses - use baseQuery for filtering
        $totalEstimates = $baseQuery->count();
        $approvedEstimates = clone $baseQuery;
        $approvedEstimates = $approvedEstimates->where('status', 'approved')->count();
        $pendingEstimates = clone $baseQuery;
        $pendingEstimates = $pendingEstimates->where('status', 'pending')->count();
        $rejectedEstimates = clone $baseQuery;
        $rejectedEstimates = $rejectedEstimates->where('status', 'rejected')->count();
        $draftEstimates = clone $baseQuery;
        $draftEstimates = $draftEstimates->where('status', 'draft')->count();

        $conversionData = [
            [
                'category' => 'Approved',
                'value' => $approvedEstimates,
                'percentage' => $totalEstimates > 0 ? round(($approvedEstimates / $totalEstimates) * 100, 1) : 0,
            ],
            [
                'category' => 'Pending',
                'value' => $pendingEstimates,
                'percentage' => $totalEstimates > 0 ? round(($pendingEstimates / $totalEstimates) * 100, 1) : 0,
            ],
            [
                'category' => 'Rejected',
                'value' => $rejectedEstimates,
                'percentage' => $totalEstimates > 0 ? round(($rejectedEstimates / $totalEstimates) * 100, 1) : 0,
            ],
            [
                'category' => 'Draft',
                'value' => $draftEstimates,
                'percentage' => $totalEstimates > 0 ? round(($draftEstimates / $totalEstimates) * 100, 1) : 0,
            ],
        ];

        return [
            'estimatesData' => $estimatesData,
            'proformaData' => $proformaData,
            'conversionData' => $conversionData,
        ];
    }

    private function getEstimateAnalytics($quotations)
    {
        $totalEstimates = $quotations->count();
        $approvedEstimates = $quotations->where('status', 'approved')->count();
        $pendingEstimates = $quotations->where('status', 'pending')->count();
        $rejectedEstimates = $quotations->where('status', 'rejected')->count();
        $draftEstimates = $quotations->where('status', 'draft')->count();

        // Calculate amounts with proper fallback logic
        $totalAmount = $quotations->sum(function ($quotation) {
            $amount = $quotation->grand_total;
            if ($amount === null || $amount == 0) {
                $amount = $quotation->items->sum(function ($item) {
                    $quantity = floatval($item->quantity ?? 0);
                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                    $taxPercentage = floatval($item->tax_percentage ?? 0);
                    $subtotal = $quantity * $unitPrice;
                    $taxAmount = $subtotal * ($taxPercentage / 100);
                    return $subtotal + $taxAmount;
                });
            }
            return $amount ?? 0;
        });

        $approvedAmount = $quotations->where('status', 'approved')->sum(function ($quotation) {
            $amount = $quotation->grand_total;
            if ($amount === null || $amount == 0) {
                $amount = $quotation->items->sum(function ($item) {
                    $quantity = floatval($item->quantity ?? 0);
                    $unitPrice = floatval($item->proposed_unit_price ?? 0);
                    $taxPercentage = floatval($item->tax_percentage ?? 0);
                    $subtotal = $quantity * $unitPrice;
                    $taxAmount = $subtotal * ($taxPercentage / 100);
                    return $subtotal + $taxAmount;
                });
            }
            return $amount ?? 0;
        });

        // Calculate average response time
        $responseTimes = $quotations->where('status', 'approved')
            ->filter(function ($quotation) {
                return $quotation->approved_at && $quotation->created_at;
            })
            ->map(function ($quotation) {
                return $quotation->created_at->diffInDays($quotation->approved_at);
            });

        $averageResponseTime = $responseTimes->count() > 0 ? $responseTimes->avg() : 0;

        return [
            'totalEstimates' => $totalEstimates,
            'approvedEstimates' => $approvedEstimates,
            'pendingEstimates' => $pendingEstimates,
            'rejectedEstimates' => $rejectedEstimates,
            'draftEstimates' => $draftEstimates,
            'totalAmount' => $totalAmount ?? 0,
            'approvedAmount' => $approvedAmount ?? 0,
            'averageResponseTime' => round($averageResponseTime, 1),
        ];
    }
}
