<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Provider;
class ProviderController extends Controller
{

    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'nullable|string|max:20',
        ]);


        $provider = Provider::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if ($request->hasFile('profile_images')) {
            foreach ($request->file('profile_images') as $image) {
                $path = $image->store('provider_images', 'public');
                $provider->images()->create(['path' => $path]);
            }
        }

        return response()->json($provider, 201);
    }

    public function update(Request $request, $userId)
    {
        $provider = Provider::where('user_id', $userId)->firstOrFail();

        $provider->update([
            'description' => $request->description,
            'phone' => $request->phone,
            'location' => $request->location,
        ]);


        if ($request->hasFile('profile_images')) {
            foreach ($request->file('profile_images') as $image) {
                $path = $image->store('provider_images', 'public');
                $provider->images()->create(['path' => $path]);
            }
        }

        return response()->json($provider->load('images'), 200);
        ;
    }

    public function show($id)
    {
        $provider = Provider::with('images')->where('id', $id)->firstOrFail();
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



}

