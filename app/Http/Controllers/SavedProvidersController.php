<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedProvider;

class SavedProvidersController extends Controller
{

    public function index(Request $request)
    {
        $saved = SavedProvider::where('user_id', $request->user()->id)
            ->with('provider.images')
            ->get();

        return response()->json($saved);
    }


    public function store(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|exists:providers,id',
        ]);

        $saved = SavedProvider::firstOrCreate([
            'user_id' => $request->user()->id,
            'provider_id' => $request->provider_id,
        ]);

        return response()->json($saved, 201);
    }


    public function destroy(Request $request, $id)
    {
        SavedProvider::where('user_id', $request->user()->id)
            ->where('provider_id', $id)
            ->delete();

        return response()->json(['message' => 'Provider removed']);
    }


}

