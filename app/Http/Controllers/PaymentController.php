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
        $merchantId = trim(config('services.payfast.merchant_id'));
        $merchantKey = trim(config('services.payfast.merchant_key'));
        $payfastUrl = config('services.payfast.test_mode')
            ? config('services.payfast.sandbox_url')
            : config('services.payfast.live_url');

        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey, // required in form
            'return_url' => route('payfast.success', $order->id),
            'cancel_url' => route('payfast.cancel', $order->id),
            'notify_url' => route('payfast.ipn'),
            'm_payment_id' => $order->id,
            'amount' => number_format($order->total, 2, '.', ''),
            'item_name' => 'Service Order #' . $order->id,
        ];

        ksort($data);

        // Exclude merchant_key from signature string
        $signatureData = collect($data)
            ->reject(fn($v, $k) => $k === 'merchant_key')
            ->map(fn($v, $k) => $k . '=' . rawurlencode($v))
            ->implode('&');

        $data['signature'] = md5($signatureData);

        // Log for debugging
        \Log::info('PayFast redirect data', $data);
        \Log::info('Signature string', ['string' => $signatureData]);
        \Log::info('Generated signature', ['sig' => $data['signature']]);

        return view('payfast.redirect', compact('payfastUrl', 'data'));
    }

    public function checkout(Request $request)
    {
        $merchantId = trim(config('services.payfast.merchant_id'));
        $merchantKey = trim(config('services.payfast.merchant_key'));
        $payfastUrl = config('services.payfast.test_mode')
            ? config('services.payfast.sandbox_url')
            : config('services.payfast.live_url');

        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'amount' => 100.00,
            'item_name' => 'Sandbox Test Transaction',
            'return_url' => url('/payfast/success'),
            'cancel_url' => url('/payfast/cancel'),
            'notify_url' => url('/payfast/ipn'),
            'm_payment_id' => uniqid(),
        ];

        ksort($data);

        $signatureData = collect($data)
            ->reject(fn($v, $k) => $k === 'merchant_key')
            ->map(fn($v, $k) => $k . '=' . rawurlencode($v))
            ->implode('&');

        $data['signature'] = md5($signatureData);

        \Log::info('PayFast checkout data', $data);
        \Log::info('Signature string', ['string' => $signatureData]);
        \Log::info('Generated signature', ['sig' => $data['signature']]);

        return view('payfast.redirect', compact('payfastUrl', 'data'));
    }

    public function handlePayfastIPN(Request $request)
    {
        $data = $request->except('signature');
        ksort($data);

        $signatureString = collect($data)
            ->map(fn($v, $k) => $k . '=' . rawurlencode($v))
            ->implode('&');

        $generatedSignature = md5($signatureString . trim(config('services.payfast.merchant_key')));

        \Log::info('IPN data received', $data);
        \Log::info('IPN signature string', ['string' => $signatureString]);
        \Log::info('Generated IPN signature', ['sig' => $generatedSignature]);
        \Log::info('Submitted signature', ['sig' => $request->signature]);

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
        $merchantId = trim(config('services.payfast.merchant_id'));
        $merchantKey = trim(config('services.payfast.merchant_key'));

        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'return_url' => route('payfast.success', $order->id),
            'cancel_url' => route('payfast.cancel', $order->id),
            'notify_url' => route('payfast.ipn'),
            'amount' => number_format($order->total, 2, '.', ''),
            'item_name' => 'Order #' . $order->id,
            'm_payment_id' => $order->id,
        ];

        ksort($data);

        $signatureData = collect($data)
            ->reject(fn($v, $k) => $k === 'merchant_key')
            ->map(fn($v, $k) => $k . '=' . rawurlencode($v))
            ->implode('&');

        $data['signature'] = md5($signatureData);

        \Log::info('PayFast pay data', $data);
        \Log::info('Signature string', ['string' => $signatureData]);
        \Log::info('Generated signature', ['sig' => $data['signature']]);

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
            ->map(fn($v, $k) => $k . '=' . rawurlencode($v))
            ->implode('&');

        $generatedSignature = md5($signatureString . trim(config('services.payfast.merchant_key')));

        \Log::info('Notify data received', $data);
        \Log::info('Notify signature string', ['string' => $signatureString]);
        \Log::info('Generated notify signature', ['sig' => $generatedSignature]);
        \Log::info('Submitted signature', ['sig' => $request->signature]);

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
