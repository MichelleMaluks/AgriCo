<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Provider;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:buyer,seller',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        $providerId = null;

        if ($user->role === 'seller') {
            $provider = Provider::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'description' => null,
                'phone' => null,
                'location' => null,
            ]);

            $providerId = $provider->id;
        }

        return response()->json([
            'user' => $user,
            'provider_id' => $providerId,
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'provider_id' => $user->provider?->id,
            'token' => $token,
        ], 200);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}

