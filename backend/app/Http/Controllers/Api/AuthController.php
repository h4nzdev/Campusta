<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->identifier)
            ->orWhere('identifier', $request->identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid Credentials'], 403);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'identifier' => $user->identifier,
            'role' => $user->role,
            'status' => $user->status
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8'
        ]);

        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->identifier = $request->email;
        $user->password = $request->password;
        $user->role = "Student";
        $user->status = "Active";

        $user->save();

        return response()->json(
            $user,
            201
        );
    }
}
