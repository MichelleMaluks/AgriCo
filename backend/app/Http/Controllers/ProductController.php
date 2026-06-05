<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_type' => 'required|string',
            'price' => 'nullable|numeric',
            'min_price' => 'nullable|numeric',
            'max_price' => 'nullable|numeric',
            'provider_id' => 'required|exists:users,id',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('products', 'public');
                $product->images()->create(['path' => $path]);
            }
        }

        return response()->json($product->load('images', 'provider'), 201);
    }


    public function show($id)
    {

        $product = Product::with(['images', 'provider'])->findOrFail($id);
        $product->business_name = $product->provider->business_name;
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return $product;
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
