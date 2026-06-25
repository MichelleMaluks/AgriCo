<?php
use Illuminate\Support\Facades\Password;
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
//password reset routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


// Users

Route::apiResource('users', UserController::class);


// Products
/*
Route::apiResource('products', ProductController::class);
Route::get('/products/{id}', [ProductController::class, 'show']);
*/

// Orders

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
});
// routes/api.php
Route::get('/orders', [OrderController::class, 'index']);


// Payments

Route::apiResource('payments', PaymentController::class);
Route::get('/payment/success/{order}', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment/cancel/{order}', [PaymentController::class, 'cancel'])->name('payment.cancel');
Route::post('/payment/notify', [PaymentController::class, 'notify'])->name('payment.notify');
Route::put('/providers/{id}/payfast', [ProviderController::class, 'updatePayfast']);


// Providers

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/providers', [ProviderController::class, 'store']);
    Route::put('/providers/{provider}', [ProviderController::class, 'update']);
});
Route::apiResource('providers', ProviderController::class)->only(['index', 'show']);
Route::get('/providers/featured', [ProviderController::class, 'featured']);
Route::get('/api/providers/{id}', [ProviderController::class, 'show']);

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
    Route::post('/providers/{provider}/contact', [MessageController::class, 'store']);   // buyer → provider
    Route::post('/messages/reply/{buyer}', [MessageController::class, 'reply']);        // provider → buyer
    Route::get('/messages', [MessageController::class, 'buyerMessages']);               // buyer inbox
    Route::get('/providers/{provider}/messages', [MessageController::class, 'providerMessages']); // provider inbox
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


// Admin

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'stats']);
    Route::apiResource('/users', AdminUserController::class);
    Route::apiResource('/services', AdminServiceController::class);
    Route::apiResource('/forum-posts', AdminForumController::class);
});
