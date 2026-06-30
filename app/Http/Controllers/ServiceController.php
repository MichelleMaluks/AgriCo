<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceImage;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();


        if (!$user->provider) {
            return response()->json(['message' => 'You must create a provider profile first.'], 403);
        }

        $provider = $user->provider;

        if (empty($provider->payfast_merchant_id) || empty($provider->payfast_merchant_key)) {
            return response()->json([
                'message' => 'You must set up PayFast before creating listings.'
            ], 403);
        }


        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $category = $request->input('options.services.0');


        $description = $validated['description'] ?? '';
        $description .= "\n\nCategory: " . $validated['category'];

        $service = Service::create([
            'provider_id' => $provider->id,
            'title' => $validated['title'],
            'description' => $description,
            'price' => $validated['price'],
        ]);


        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('service_images', 'public');
                $service->images()->create(['path' => $path]);
            }
        }


        return response()->json($service->load(['images', 'provider']), 201);
    }
    public function index()
    {
        $services = Service::with(['images', 'provider'])->get();
        return response()->json($services);
    }


    public function show($id)
    {
        $service = Service::with('images', 'provider')->findOrFail($id);
        return response()->json($service);
    }

    public function providerServices($providerId)
    {
        $services = Service::with('images', 'provider')
            ->where('provider_id', $providerId)
            ->get();

        return response()->json($services);
    }

}

