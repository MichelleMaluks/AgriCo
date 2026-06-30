<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Service;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $service = Service::findOrFail($request->service_id);

        $order = Order::create([
            'service_id' => $service->id,
            'buyer_id' => auth()->id(),
            'provider_id' => $service->provider_id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);


        $paymentUrl = route('payfast.redirect', ['order' => $order->id]);

        return response()->json([
            'message' => 'Order created successfully',
            'id' => $order->id,
            'payment_url' => route('payfast.redirect', $order->id),
        ]);
    }

    public function index(Request $request)
    {
        $orders = Order::with(['product', 'provider'])
            ->where('buyer_id', $request->user()->id)
            ->get();

        return response()->json($orders);
    }

}

