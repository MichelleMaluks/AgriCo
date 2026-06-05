<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Order;

class PaymentController extends Controller
{
    public function pay($orderId)
    {
        $order = Order::findOrFail($orderId);

        $data = [
            'merchant_id' => env('PAYFAST_MERCHANT_ID'),
            'merchant_key' => env('PAYFAST_MERCHANT_KEY'),
            'return_url' => url('/payment/success'),
            'cancel_url' => url('/payment/cancel'),
            'notify_url' => url('/payment/notify'),
            'total' => $order->total,
            'item_name' => 'Order #' . $order->id,
        ];

        return view('payfast.redirect', compact('data'));
    }

    public function notify(Request $request)
    {
        $orderId = str_replace('Order #', '', $request->item_name);
        $order = Order::find($orderId);
        if ($order) {
            $order->status = 'paid';
            $order->save();
        }
    }
}

