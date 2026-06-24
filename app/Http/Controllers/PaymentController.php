<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;

class PaymentController extends Controller
{

    public function success(Order $order)
    {
        $order->update(['status' => 'paid']);
        return redirect('/buyer/dashboard')->with('success', 'Payment successful!');
    }

    public function cancel(Order $order)
    {
        $order->update(['status' => 'cancelled']);
        return redirect('/buyer/dashboard')->with('error', 'Payment cancelled.');
    }

    public function redirect(Order $order)
    {
        // PayFast merchant details
        $merchantId = env('PAYFAST_MERCHANT_ID');
        $merchantKey = env('PAYFAST_MERCHANT_KEY');
        $returnUrl = route('payment.success', ['order' => $order->id]);
        $cancelUrl = route('payment.cancel', ['order' => $order->id]);
        $notifyUrl = route('payment.notify');

        // Build PayFast payload
        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'return_url' => $returnUrl,
            'cancel_url' => $cancelUrl,
            'notify_url' => $notifyUrl,
            'm_payment_id' => $order->id,
            'amount' => number_format($order->amount, 2, '.', ''),
            'item_name' => 'Service Order #' . $order->id,
        ];

        // Generate signature
        $signature = md5(http_build_query($data));
        $data['signature'] = $signature;

        // Auto-submit form to PayFast
        return response()->view('payfast.redirect', compact('data'));
    }

    public function pay($orderId)
    {
        $order = Order::with('product.provider')->findOrFail($orderId);

        $provider = $order->product->provider->provider;
        // product belongs to User, then User hasOne Provider

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

    public function notify(Request $request)
    {
        $orderId = str_replace('Order #', '', $request->item_name);
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        // Step 1: Get provider (seller) PayFast credentials
        $provider = $order->product->provider->provider;
        if (!$provider || !$provider->payfast_merchant_key) {
            return response()->json(['error' => 'Seller PayFast key missing'], 400);
        }

        // Step 2: Build signature string
        $data = $request->except('signature');
        ksort($data);
        $signatureString = '';
        foreach ($data as $key => $value) {
            $signatureString .= $key . '=' . urlencode($value) . '&';
        }
        $signatureString = rtrim($signatureString, '&');

        // Step 3: Generate signature with seller’s merchant key
        $generatedSignature = md5($signatureString . $provider->payfast_merchant_key);

        if ($generatedSignature !== $request->signature) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Step 4: Optional IP check (PayFast IP ranges)
        $validIps = ['196.33.227.224', '196.33.227.225', '196.33.227.226', '196.33.227.227'];
        if (!in_array($request->ip(), $validIps)) {
            return response()->json(['error' => 'Invalid IP'], 403);
        }

        // Step 5: Mark order as paid
        $order->status = 'paid';
        $order->save();

        return response()->json(['message' => 'Payment verified and order marked as paid']);
    }

}
