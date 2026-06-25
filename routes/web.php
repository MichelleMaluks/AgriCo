<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::resource('/users', AdminUserController::class);
});

Route::get('/payfast/redirect/{order}', [PaymentController::class, 'redirect'])->name('payfast.redirect');
Route::post('/payfast/notify', [PaymentController::class, 'notify'])->name('payfast.notify');
Route::get('/payfast/success/{order}', [PaymentController::class, 'success'])->name('payfast.success');
Route::get('/payfast/cancel/{order}', [PaymentController::class, 'cancel'])->name('payfast.cancel');
Route::get('{any}', function () {
    return view('app'); // or your React entry blade
})->where('any', '.*');

