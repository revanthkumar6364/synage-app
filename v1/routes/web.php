<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerContactController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class,'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class)->except(['show']);
    Route::get('users/{user}/change-password', [UserController::class, 'changePassword'])->name('users.change-password');
    Route::post('users/{user}/change-password', [UserController::class, 'updatePassword'])->name('users.update-password');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('customers', CustomerController::class);
    Route::resource('customers.contacts', CustomerContactController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
