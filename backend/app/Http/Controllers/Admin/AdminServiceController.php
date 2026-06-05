<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all());
    }

    public function show($id)
    {
        return response()->json(Service::findOrFail($id));
    }

    public function store(Request $request)
    {
        $service = Service::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
        ]);
        return response()->json(['message' => 'Service created successfully', 'service' => $service]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->only('name', 'description', 'status'));
        return response()->json(['message' => 'Service updated successfully']);
    }

    public function destroy($id)
    {
        Service::destroy($id);
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
