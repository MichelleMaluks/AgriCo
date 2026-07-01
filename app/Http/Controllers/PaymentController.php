<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

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
        $provider = $order->provider ?? $order->service->provider ?? null;
        if (!$provider) {
            return response()->json(['error' => 'Provider not found'], 404);
        }

        $merchantId = config('services.payfast.merchant_id');
        $payfastUrl = config('services.payfast.test_mode')
            ? config('services.payfast.sandbox_url')
            : config('services.payfast.live_url');

        $data = [
            'merchant_id' => $merchantId,
            'return_url' => route('payfast.success', $order->id),
            'cancel_url' => route('payfast.cancel', $order->id),
            'notify_url' => route('payfast.ipn'),
            'm_payment_id' => $order->id,
            'amount' => number_format($order->total, 2, '.', ''),
            'item_name' => 'Service Order #' . $order->id,
        ];

        ksort($data);
        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . urlencode($v))
            ->implode('&');
        $data['signature'] = md5($signatureString);

        return view('payfast.redirect', compact('payfastUrl', 'data'));
    }

    public function checkout(Request $request)
    {
        $merchantId = config('services.payfast.merchant_id');
        $payfastUrl = config('services.payfast.test_mode')
            ? config('services.payfast.sandbox_url')
            : config('services.payfast.live_url');

        $data = [
            'merchant_id' => $merchantId,
            'amount' => 100.00,
            'item_name' => 'Sandbox Test Transaction',
            'return_url' => url('/payfast/success'),
            'cancel_url' => url('/payfast/cancel'),
            'notify_url' => url('/payfast/ipn'),
            'm_payment_id' => uniqid(),
        ];

        ksort($data);
        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . urlencode($v))
            ->implode('&');
        $data['signature'] = md5($signatureString);

        return view('payfast.redirect', compact('payfastUrl', 'data'));
    }

    public function handlePayfastIPN(Request $request)
    {
        $data = $request->except('signature');
        ksort($data);

        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . urlencode($v))
            ->implode('&');

        $generatedSignature = md5($signatureString . config('services.payfast.merchant_key'));

        if ($generatedSignature !== $request->signature) {
            return response('Invalid signature', 400);
        }

        if (($data['payment_status'] ?? '') === 'COMPLETE') {
            Order::where('id', $data['m_payment_id'])->update(['status' => 'paid']);
        }

        return response('IPN received', 200);
    }

    public function pay($orderId)
    {
        $order = Order::with(['service.provider'])->findOrFail($orderId);
        $merchantId = config('services.payfast.merchant_id');

        $data = [
            'merchant_id' => $merchantId,
            'return_url' => route('payfast.success', $order->id),
            'cancel_url' => route('payfast.cancel', $order->id),
            'notify_url' => route('payfast.ipn'),
            'amount' => $order->total,
            'item_name' => 'Order #' . $order->id,
            'm_payment_id' => $order->id,
        ];

        ksort($data);
        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . urlencode($v))
            ->implode('&');
        $data['signature'] = md5($signatureString);

        return view('payfast.redirect', compact('data'));
    }

    public function notify(Request $request)
    {
        $orderId = str_replace('Order #', '', $request->item_name);
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $data = $request->except('signature');
        ksort($data);

        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . urlencode($v))
            ->implode('&');

        $generatedSignature = md5($signatureString . config('services.payfast.merchant_key'));

        if ($generatedSignature !== $request->signature) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $validIps = ['196.33.227.224', '196.33.227.225', '196.33.227.226', '196.33.227.227'];
        if (!in_array($request->ip(), $validIps)) {
            return response()->json(['error' => 'Invalid IP'], 403);
        }

        $order->status = 'paid';
        $order->save();

        return response()->json(['message' => 'Payment verified and order marked as paid']);
    }
}
