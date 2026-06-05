<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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

// Authentication

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


// Users

Route::apiResource('users', UserController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



// Products

Route::apiResource('products', ProductController::class);


// Orders


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});



// Payments

Route::apiResource('payments', PaymentController::class);


// Providers

Route::apiResource('providers', ProviderController::class);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::put('/provider/{user}', [ProviderController::class, 'update']);


// Services

Route::apiResource('services', ServiceController::class)->only(['store']);




Route::middleware('auth:sanctum')->group(function () {
    // Buyer sends message to provider
    Route::post('/providers/{providerId}/contact', [MessageController::class, 'store']);

    // Provider replies to buyer
    Route::post('/buyers/{buyerId}/reply', [MessageController::class, 'reply']);

    // Buyer views all messages
    Route::get('/messages', [MessageController::class, 'buyerMessages']);

    // Provider views all messages
    Route::get('/providers/{providerId}/messages', [MessageController::class, 'providerMessages']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/providers', [ProviderController::class, 'store']);
});

Route::apiResource('forum', ForumController::class)->only(['index', 'store', 'show']);
Route::get('/forum/{id}', [ForumController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/saved-providers', [SavedProvidersController::class, 'index']);
    Route::post('/saved-providers', [SavedProvidersController::class, 'store']);
    Route::delete('/saved-providers/{id}', [SavedProvidersController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'stats']);

    Route::apiResource('/users', AdminUserController::class);
    Route::apiResource('/services', AdminServiceController::class);
    Route::apiResource('/forum-posts', AdminForumController::class);
});


