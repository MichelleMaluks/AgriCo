<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::create([
            'buyer_id' => $request->buyer_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'total' => $request->total,
            'status' => 'pending'
        ]);
        return response()->json($order, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json($order);
    }
}

