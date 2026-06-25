<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SavedProvidersController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminForumController;
use App\Http\Controllers\CartController;

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'provider_id' => $request->user()->provider->id ?? null,
        'provider' => $request->user()->provider ?? null,
    ]);
});

// Password reset
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Users
Route::apiResource('users', UserController::class);

// Orders
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
});
Route::get('/orders', [OrderController::class, 'index']);

// Providers
Route::get('/providers/featured', [ProviderController::class, 'featured']);
Route::apiResource('providers', ProviderController::class)->only(['index', 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/providers', [ProviderController::class, 'store']);
    Route::put('/providers/{provider}', [ProviderController::class, 'update']);
    Route::put('/providers/{id}/payfast', [ProviderController::class, 'updatePayfast']);
});

// Payments (API)
Route::apiResource('payments', PaymentController::class);
Route::post('/payments/ipn', [PaymentController::class, 'handlePayfastIPN'])->name('payments.ipn');

// Services
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/services', [ServiceController::class, 'store']);
});
Route::apiResource('services', ServiceController::class)->only(['index', 'show']);
Route::get('/providers/{id}/services', [ServiceController::class, 'providerServices']);
Route::get('/products', [ServiceController::class, 'index']);
Route::get('/products/{id}', [ServiceController::class, 'show']);
Route::post('/products', [ServiceController::class, 'store']);

// Messages
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/providers/{provider}/contact', [MessageController::class, 'store']);
    Route::post('/messages/reply/{buyer}', [MessageController::class, 'reply']);
    Route::get('/messages', [MessageController::class, 'buyerMessages']);
    Route::get('/providers/{provider}/messages', [MessageController::class, 'providerMessages']);
});

// Saved Providers
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/saved-providers', [SavedProvidersController::class, 'index']);
    Route::post('/saved-providers', [SavedProvidersController::class, 'store']);
    Route::delete('/saved-providers/{id}', [SavedProvidersController::class, 'destroy']);
});

// Cart
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/cart/{id}/checkout', [CartController::class, 'checkout']);
});

// Forum
Route::apiResource('forum', ForumController::class)->only(['index', 'store', 'show']);

// Admin API
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'stats']);
    Route::apiResource('/users', AdminUserController::class);
    Route::apiResource('/services', AdminServiceController::class);
    Route::apiResource('/forum-posts', AdminForumController::class);
});
