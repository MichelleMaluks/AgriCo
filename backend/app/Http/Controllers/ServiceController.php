<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceImage;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'options' => 'nullable|array',
            'images.*' => 'nullable|image|max:2048', // multiple images
        ]);

        // Create the service record
        $service = Service::create([
            'provider_id' => $validated['provider_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'options' => $validated['options'] ?? [],
        ]);

        // Handle multiple image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('service_images', 'public');
                $service->images()->create(['path' => $path]);
            }
        }

        // Return service with images
        return response()->json($service->load('images'), 201);
    }

    public function index()
    {
        return response()->json(Service::with('images')->get());
    }

    public function show($id)
    {
        $service = Service::with('images')->findOrFail($id);
        return response()->json($service);
    }
}
