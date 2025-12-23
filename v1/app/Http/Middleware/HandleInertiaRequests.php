<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Account;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationMedia;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $shared = parent::share($request);

        // Get flash messages from session
        $success = $request->session()->get('success');
        $error = $request->session()->get('error');

        // Merge with parent's flash if it exists, otherwise use our own
        $flash = $shared['flash'] ?? [];
        if ($success) {
            $flash['success'] = $success;
        }
        if ($error) {
            $flash['error'] = $error;
        }

        return [
            ...$shared,
            'flash' => $flash,
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'can' => [
                    'users' => [
                        'viewAny' => $request->user()?->can('viewAny', User::class),
                        'create' => $request->user()?->can('create', User::class),
                    ],
                    'categories' => [
                        'viewAny' => $request->user()?->can('viewAny', Category::class),
                        'create' => $request->user()?->can('create', Category::class),
                    ],
                    'accounts' => [
                        'viewAny' => $request->user()?->can('viewAny', Account::class),
                        'create' => $request->user()?->can('create', Account::class),
                    ],
                    'products' => [
                        'viewAny' => $request->user()?->can('viewAny', Product::class),
                        'create' => $request->user()?->can('create', Product::class),
                    ],
                    'quotations' => [
                        'viewAny' => $request->user()?->can('viewAny', Quotation::class),
                        'create' => $request->user()?->can('create', Quotation::class),
                    ],
                    'quotationMedia' => [
                        'viewAny' => $request->user()?->can('viewAny', QuotationMedia::class),
                        'create' => $request->user()?->can('create', QuotationMedia::class),
                    ],
                ],
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
