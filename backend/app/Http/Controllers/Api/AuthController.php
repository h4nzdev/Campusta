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
            ->orWhere('school_id', $request->identifier)
            ->orWhere('username', $request->identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid Credentials'], 403);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'school_id' => $user->school_id,
            'username' => $user->username,
            'role' => $user->role,
            'department' => $user->department,
            'course' => $user->course,
            'year_level' => $user->year_level,
            'contact' => $user->contact,
            'profile_pic' => $user->profile_pic,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'school_id' => 'nullable|string',
            'username' => 'nullable|string',
            'role' => 'nullable|string',
            'department' => 'nullable|string',
            'course' => 'nullable|string',
            'year_level' => 'nullable|string',
            'contact' => 'nullable|string',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->school_id = $request->school_id;
        $user->username = $request->username;
        $user->role = $request->role ?? 'Student';
        $user->department = $request->department;
        $user->course = $request->course;
        $user->year_level = $request->year_level;
        $user->contact = $request->contact;
        $user->profile_pic = $request->profile_pic;
        $user->save();

        return response()->json($user, 201);
    }
}
