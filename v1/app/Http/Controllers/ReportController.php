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
            $query->where('quotations.created_at', '>=', $request->dateFrom . ' 00:00:00');
        }
        if ($request->filled('dateTo')) {
            $query->where('quotations.created_at', '<=', $request->dateTo . ' 23:59:59');
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

        // Get paginated data
        $quotations = $query->orderBy('created_at', 'desc')->paginate(10);

        // Transform data for frontend
        $reportData = $quotations->getCollection()->map(function ($quotation) {
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
                'quotationNumber' => $quotation->quotation_number,
                'accountName' => $quotation->account->business_name ?? 'Unknown Account',
                'contactPerson' => $quotation->account_contact->name ?? 'N/A',
                'salesPerson' => $quotation->salesUser->name ?? 'Unknown',
                'amount' => $amount ?? 0,
                'status' => $quotation->status,
                'createdAt' => $quotation->created_at->format('M d, Y'),
                'validUntil' => $quotation->valid_until ? $quotation->valid_until->format('M d, Y') : 'N/A',
            ];
        });

        // Apply amount range filter after data transformation
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

        return Inertia::render('reports/client-based', [
            'reportData' => $reportData,
            'pagination' => [
                'current_page' => $quotations->currentPage(),
                'last_page' => $quotations->lastPage(),
                'per_page' => $quotations->perPage(),
                'total' => $quotations->total(),
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
        $summaryStats = $this->getSalesSummaryStats($salesData);

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

        // Get chart data
        $chartData = $this->getChartData($query);

        return Inertia::render('reports/charts', [
            'chartData' => $chartData,
            'filters' => $request->only(['status', 'category']),
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
            $query->where('quotations.created_at', '>=', $request->dateFrom . ' 00:00:00');
        }
        if ($request->filled('dateTo')) {
            $query->where('quotations.created_at', '<=', $request->dateTo . ' 23:59:59');
        }

        // Apply role-based filtering
        $authUser = auth()->user();
        if ($authUser->role === 'sales') {
            $query->where('sales_user_id', $authUser->id);
        }

        // Get paginated data
        $quotations = $query->orderBy('created_at', 'desc')->paginate(10);

        // Get analytics from ALL data (not filtered)
        $allQuotationsQuery = Quotation::with(['account', 'account_contact', 'creator', 'salesUser']);

        // Apply role-based filtering for analytics
        if ($authUser->role === 'sales') {
            $allQuotationsQuery->where('sales_user_id', $authUser->id);
        }

        $allQuotations = $allQuotationsQuery->get();
        $analytics = $this->getEstimateAnalytics($allQuotations);

        // Transform data for frontend
        $estimateData = $quotations->getCollection()->map(function ($quotation) {
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
                'estimateNumber' => $quotation->quotation_number,
                'clientName' => $quotation->account->business_name ?? 'Unknown Client',
                'salesPerson' => $quotation->salesUser->name ?? 'Unknown',
                'amount' => $amount ?? 0,
                'status' => $quotation->status,
                'createdAt' => $quotation->created_at->format('M d, Y'),
                'validUntil' => $quotation->valid_until ? $quotation->valid_until->format('M d, Y') : 'N/A',
            ];
        });

        // Apply amount range filter after data transformation
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

        return Inertia::render('reports/estimates', [
            'estimateData' => $estimateData,
            'pagination' => [
                'current_page' => $quotations->currentPage(),
                'last_page' => $quotations->lastPage(),
                'per_page' => $quotations->perPage(),
                'total' => $quotations->total(),
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

    private function getSalesSummaryStats($salesData)
    {
        $totalEstimates = collect($salesData)->sum('estimates');
        $totalConverted = collect($salesData)->sum('converted');
        $totalSales = collect($salesData)->sum('totalSales');
        $overallConversionRate = $totalEstimates > 0 ? ($totalConverted / $totalEstimates) * 100 : 0;

        return [
            'totalEstimates' => $totalEstimates,
            'totalConverted' => $totalConverted,
            'overallConversionRate' => round($overallConversionRate, 1),
            'totalSales' => $totalSales,
        ];
    }

    private function getChartData($baseQuery)
    {
        // Get monthly data for the last 6 months
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->push(Carbon::now()->subMonths($i)->format('M'));
        }

        // Estimates chart data with proper amount calculations
        $estimatesData = $months->map(function ($month) use ($baseQuery) {
            $startDate = Carbon::parse($month)->startOfMonth();
            $endDate = Carbon::parse($month)->endOfMonth();

            $query = clone $baseQuery;
            $total = $query->whereBetween('created_at', [$startDate, $endDate])->count();

            $query = clone $baseQuery;
            $approved = $query->where('quotations.status', 'approved')->whereBetween('created_at', [$startDate, $endDate])->count();

            $query = clone $baseQuery;
            $pending = $query->where('quotations.status', 'pending')->whereBetween('created_at', [$startDate, $endDate])->count();

            return [
                'month' => $month,
                'series1' => $total,
                'series2' => $approved,
                'series3' => $pending,
            ];
        });

        // Proforma invoice data with proper amount calculations
        $proformaData = $months->map(function ($month) use ($baseQuery) {
            $startDate = Carbon::parse($month)->startOfMonth();
            $endDate = Carbon::parse($month)->endOfMonth();

            $query = clone $baseQuery;
            $quotations = $query->where('quotations.status', 'approved')
                ->whereBetween('approved_at', [$startDate, $endDate])
                ->with('items')
                ->get();

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
                'month' => $month,
                'value' => $value,
            ];
        });

        // Conversion ratios with all statuses
        $totalEstimates = $baseQuery->count();
        $approvedEstimates = $baseQuery->where('quotations.status', 'approved')->count();
        $pendingEstimates = $baseQuery->where('quotations.status', 'pending')->count();
        $rejectedEstimates = $baseQuery->where('quotations.status', 'rejected')->count();
        $draftEstimates = $baseQuery->where('quotations.status', 'draft')->count();

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
