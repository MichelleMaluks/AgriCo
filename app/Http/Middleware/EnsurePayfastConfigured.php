<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePayfastConfigured
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->provider) {
            return response()->json(['error' => 'You must create a provider profile first'], 403);
        }

        $provider = $user->provider;

        if (empty($provider->payfast_merchant_id) || empty($provider->payfast_merchant_key)) {
            return response()->json(['error' => 'You must configure PayFast credentials before listing products or services'], 403);
        }

        $cacheKey = "payfast_valid_{$provider->id}";
        if (!Cache::get($cacheKey)) {
            // Sandbox validation
            $testData = [
                'merchant_id' => $provider->payfast_merchant_id,
                'merchant_key' => $provider->payfast_merchant_key,
                'amount' => 1.00,
                'item_name' => 'Test Transaction',
                'return_url' => url('/payment/success'),
                'cancel_url' => url('/payment/cancel'),
                'notify_url' => url('/payment/notify'),
            ];
            $response = Http::asForm()->post('https://sandbox.payfast.co.za/eng/process', $testData);

            if ($response->status() !== 200) {
                return response()->json(['error' => 'Invalid PayFast credentials. Please check your Merchant ID and Key.'], 403);
            }

            return $next($request);
        }
    }
}