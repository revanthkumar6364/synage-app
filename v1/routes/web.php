<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountContactController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\QuotationMediaController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;

Route::redirect('/', '/dashboard', 301)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class)->except(['show']);
    Route::get('users/{id}/change-password', [UserController::class, 'changePassword'])->name('users.change-password');
    Route::post('users/{id}/change-password', [UserController::class, 'updatePassword'])->name('users.update-password');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('accounts', AccountController::class);
    Route::resource('accounts.contacts', AccountContactController::class);
    Route::resource('products', ProductController::class);
    Route::resource('quotations', QuotationController::class);
    Route::get('quotations/{quotation}/edit', [QuotationController::class, 'edit'])->name('quotations.edit');
    Route::get('quotations/{quotation}/products', [QuotationController::class, 'products'])->name('quotations.products');
    Route::post('quotations/{quotation}/products', [QuotationController::class, 'updateProducts'])->name('quotations.update.products');
    Route::get('quotations/{quotation}/preview', [QuotationController::class, 'preview'])->name('quotations.preview');
    Route::post('/quotations/{quotation}/update-overview', [QuotationController::class, 'updateOverview'])
        ->name('quotations.update-overview');
    Route::post('/quotations/{quotation}/save-terms', [QuotationController::class, 'saveTerms'])
        ->name('quotations.save-terms');
    Route::post('/quotations/{quotation}/update-product-type', [QuotationController::class, 'updateProductType'])
        ->name('quotations.update-product-type');
    Route::post('/quotations/{quotation}/approve', [QuotationController::class, 'approve'])
        ->name('quotations.approve');
    Route::post('/quotations/{quotation}/reject', [QuotationController::class, 'reject'])
        ->name('quotations.reject');
    Route::post('/quotations/{quotation}/mark-as-order-received', [QuotationController::class, 'markAsOrderReceived'])
        ->name('quotations.mark-as-order-received');
    Route::post('/quotations/{quotation}/create-version', [QuotationController::class, 'createVersion'])
        ->name('quotations.create-version');
    Route::get('quotations/{quotation}/files', [QuotationController::class, 'files'])->name('quotations.files');
    Route::post('quotations/{quotation}/files', [QuotationController::class, 'filesStore'])->name('quotations.files.store');
    Route::get('quotations/{quotation}/pdf', [QuotationController::class, 'downloadPdf'])->name('quotations.pdf');

    // Quotation Media Management
    Route::patch('quotation-media/{id}/attach', [QuotationMediaController::class, 'attach'])->name('quotation-media.attach');
    Route::patch('quotation-media/{id}/detach', [QuotationMediaController::class, 'detach'])->name('quotation-media.detach');
    Route::resource('quotation-media', QuotationMediaController::class);

    // Reports and Analytics Routes
    Route::prefix('reports')->middleware(['admin.manager'])->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/client-based', [ReportController::class, 'clientBased'])->name('reports.client-based');
        Route::get('/sales', [ReportController::class, 'sales'])->name('reports.sales');
        Route::get('/charts', [ReportController::class, 'charts'])->name('reports.charts');
        Route::get('/estimates', [ReportController::class, 'estimates'])->name('reports.estimates');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
