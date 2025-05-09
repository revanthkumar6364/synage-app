<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountContactController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuotationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard', 301)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class)->except(['show']);
    Route::get('users/{user}/change-password', [UserController::class, 'changePassword'])->name('users.change-password');
    Route::post('users/{user}/change-password', [UserController::class, 'updatePassword'])->name('users.update-password');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('accounts', AccountController::class);
    Route::resource('accounts.contacts', AccountContactController::class);
    Route::resource('products', ProductController::class);
    // Additional routes for image management
    Route::post('products/{product}/images', [ProductController::class, 'addImages'])
        ->name('products.images.store');
    Route::delete('products/{product}/images/{image}', [ProductController::class, 'removeImage'])
        ->name('products.images.destroy');
    Route::resource('quotations', QuotationController::class);
    Route::post('quotations/{quotation}/details', [QuotationController::class, 'updateDetails'])->name('quotations.update.details');
    Route::post('quotations/{quotation}/products', [QuotationController::class, 'updateProducts'])->name('quotations.update.products');
    Route::post('quotations/{quotation}/overview', [QuotationController::class, 'updateOverview'])->name('quotations.update.overview');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
