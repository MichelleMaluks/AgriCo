<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    public function store(Request $request, $providerId)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'buyer_id' => $request->user()->id,
            'provider_id' => $providerId,
            'content' => $request->input('content'),
            'from_buyer' => true,
        ]);

        return response()->json($message, 201);
    }

    public function reply(Request $request, $buyerId)
    {
        $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'buyer_id' => $buyerId,
            'provider_id' => $request->provider_id,
            'content' => $request->input('content'),
            'from_buyer' => false,
        ]);

        return response()->json($message, 201);
    }

    public function buyerMessages(Request $request)
    {
        $messages = Message::where('buyer_id', $request->user()->id)
            ->with('provider')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    public function providerMessages(Request $request, $providerId)
    {
        $messages = Message::where('provider_id', $providerId)
            ->with('buyer')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }
}
