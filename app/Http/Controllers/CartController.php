<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;

class CartController extends Controller
{

    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product.images')
            ->get();

        return response()->json($cartItems);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $cartItem = Cart::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $validated['product_id'],
            ],
            [
                'quantity' => $validated['quantity'] ?? 1,
            ]
        );

        return response()->json($cartItem, 201);
    }


    public function destroy(Request $request, $id)
    {
        Cart::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Item removed']);
    }


    public function checkout(Request $request, $cartId)
    {
        $cartItem = Cart::where('user_id', $request->user()->id)
            ->where('id', $cartId)
            ->with('product.provider.provider')
            ->firstOrFail();

        $order = Order::create([
            'buyer_id' => $request->user()->id,
            'product_id' => $cartItem->product_id,
            'quantity' => $cartItem->quantity,
            'total' => $cartItem->product->price * $cartItem->quantity,
            'status' => 'pending',
        ]);


        $cartItem->delete();

        $provider = $cartItem->product->provider->provider;

        if (!$provider || !$provider->payfast_merchant_id || !$provider->payfast_merchant_key) {
            return response()->json(['error' => 'Seller has not configured PayFast'], 400);
        }

        $data = [
            'merchant_id' => $provider->payfast_merchant_id,
            'merchant_key' => $provider->payfast_merchant_key,
            'return_url' => url('/payment/success'),
            'cancel_url' => url('/payment/cancel'),
            'notify_url' => url('/payment/notify'),
            'amount' => $order->total,
            'item_name' => 'Order #' . $order->id,
        ];
        return view('payfast.redirect', compact('data'));
    }
}