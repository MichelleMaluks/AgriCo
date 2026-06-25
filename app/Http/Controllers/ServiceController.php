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

        // ✅ Ensure provider exists
        if (!$user->provider) {
            return response()->json(['message' => 'You must create a provider profile first.'], 403);
        }

        $provider = $user->provider;

        // ✅ Block if PayFast credentials are missing
        if (empty($provider->payfast_merchant_id) || empty($provider->payfast_merchant_key)) {
            return response()->json([
                'message' => 'You must set up PayFast before creating listings.'
            ], 403);
        }

        // ✅ Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'options.services' => 'nullable|array',
            'price' => 'required|numeric|min:0',
            'images.*' => 'nullable|image|max:2048', // multiple images
        ]);
        // ✅ Extract category (first selected service)
        $category = $request->input('options.services.0');

        // ✅ Append category to description
        $description = $validated['description'] ?? '';
        if ($category) {
            $description .= "\n\nCategory: " . $category;
        }
        // ✅ Create the service record (always linked to provider_id)
        $service = Service::create([
            'provider_id' => $provider->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'options' => [
                'services' => $request->input('options.services', [])
            ],
            'price' => $validated['price'],
        ]);

        // ✅ Handle multiple image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('service_images', 'public');
                $service->images()->create(['path' => $path]);
            }
        }

        // ✅ Return service with provider + images
        return response()->json($service->load(['images', 'provider']), 201);
    }
    public function index()
    {
        $services = Service::with('provider')->get();

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

