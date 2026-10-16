<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * POST /api/register
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255', 'unique:users,email'],
            'identifier' => ['required', 'string', 'max:255', 'unique:users,identifier'],
            'password'   => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'identifier' => $validated['identifier'],
            'password'   => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $user,
        ], 201);
    }

    /**
     * POST /api/login
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string'],
            'password'   => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['identifier'])
            ->orWhere('identifier', $validated['identifier'])
            ->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
        ]);
    }
}
