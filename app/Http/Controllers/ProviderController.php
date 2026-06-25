<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Provider;
use App\Models\User;
class ProviderController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'payfast_merchant_id' => 'nullable|string|max:255',
            'payfast_merchant_key' => 'nullable|string|max:255',
        ]);
        $user = $request->user(); // logged-in user
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $provider = Provider::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'phone' => $validated['phone'] ?? null,
            'payfast_merchant_id' => $validated['payfast_merchant_id'] ?? null,
            'payfast_merchant_key' => $validated['payfast_merchant_key'] ?? null,
        ]);


        return response()->json($provider, 201);
    }

    public function update(Request $request, $userId)
    {
        $provider = Provider::where('user_id', $userId)->firstOrFail();

        $provider->update([
            'description' => $request->description,
            'phone' => $request->phone,
            'location' => $request->location,
            'payfast_merchant_id' => $request->payfast_merchant_id,
            'payfast_merchant_key' => $request->payfast_merchant_key,
        ]);


        if ($request->hasFile('profile_images')) {
            foreach ($request->file('profile_images') as $image) {
                $path = $image->store('provider_images', 'public');
                $provider->images()->create(['path' => $path]);
            }
        }

        if ($request->has('payfast_merchant_id') || $request->has('payfast_merchant_key')) {
            Cache::forget("payfast_valid_{$provider->id}");
        }

        return response()->json($provider->load('images'), 200);
        ;
    }

    public function show($id)
    {
        $provider = Provider::with([
            'images',
            'services'
        ])->findOrFail($id);

        return response()->json($provider);
    }


    public function index(Request $request)
    {
        $query = Provider::with('images');

        if ($request->has('location')) {
            $query->where('location', 'ILIKE', '%' . $request->location . '%');
        }

        if ($request->has('service')) {
            $query->where('description', 'ILIKE', '%' . $request->service . '%');
        }

        if ($request->has('name')) {
            $query->where('name', 'ILIKE', '%' . $request->name . '%');
        }

        return response()->json($query->get());
    }

    public function validatePayfastCredentials($merchantId, $merchantKey)
    {
        $testData = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'amount' => 1.00,
            'item_name' => 'Test Transaction',
            'return_url' => url('/payment/success'),
            'cancel_url' => url('/payment/cancel'),
            'notify_url' => url('/payment/notify'),
        ];

        $response = Http::asForm()->post('https://sandbox.payfast.co.za/eng/process', $testData);

        return $response->status() === 200;
    }
    public function featured(Request $request)
    {
        $limit = $request->query('limit', 3);
        $providers = Provider::with(['images', 'services'])
            ->whereHas('services')
            ->inRandomOrder()
            ->take($limit)
            ->get();

        return response()->json($providers);
    }

    public function updatePayfast(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);

        $validated = $request->validate([
            'merchant_id' => 'required|string',
            'merchant_key' => 'required|string',
        ]);

        $provider->payfast_merchant_id = $validated['merchant_id'];
        $provider->payfast_merchant_key = $validated['merchant_key'];
        $provider->save();

        return response()->json([
            'message' => 'PayFast credentials updated successfully',
            'provider' => $provider
        ]);
    }



}

