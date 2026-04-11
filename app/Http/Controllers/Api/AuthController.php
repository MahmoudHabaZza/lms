<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username'],
            'name' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['student', 'instructor', 'admin'])],
            'phone_number' => ['nullable', 'string', 'max:25'],
            'avatar' => ['nullable', 'file', 'image', 'max:2048'],
            'instructor_code' => ['nullable', 'string'],
        ]);

        $expectedInstructorCode = (string) env('INSTRUCTOR_VERIFICATION_CODE', '');
        if ($data['role'] === 'instructor' && $expectedInstructorCode !== '' && ($data['instructor_code'] ?? '') !== $expectedInstructorCode) {
            return response()->json([
                'instructor_code' => ['Invalid instructor verification code.'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $username = $data['username'] ?? str($data['email'])->before('@')->value();
        $name = $data['name'] ?? $username;
        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create([
            'name' => $name,
            'username' => $username,
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'phone_number' => $data['phone_number'] ?? null,
            'avatar' => $avatarPath,
            'is_admin' => $data['role'] === 'admin',
            'is_staff' => in_array($data['role'], ['instructor', 'admin'], true),
            'is_superuser' => $data['role'] === 'admin',
            'is_verified' => false,
            'instructor_verified' => $data['role'] === 'instructor' && $expectedInstructorCode !== '',
        ]);

        $user->assignRole($data['role']);

        return response()->json($this->serializeUser($user), Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $identityField = filter_var($data['email'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $token = auth('api')->attempt([
            $identityField => $data['email'],
            'password' => $data['password'],
        ]);

        if (! $token) {
            return response()->json([
                'detail' => 'No active account found with the given credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth('api')->user();

        return response()->json([
            'access' => $token,
            // jwt-auth uses the same token value for refresh within refresh_ttl window.
            'refresh' => $token,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh', $request->bearerToken());

        if (! $refreshToken) {
            return response()->json([
                'detail' => 'Refresh token is required.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $access = JWTAuth::setToken($refreshToken)->refresh();
        } catch (\Throwable $exception) {
            return response()->json([
                'detail' => 'Token is invalid or expired',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json([
            'access' => $access,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($this->serializeUser($request->user()));
    }

    public function logout(Request $request)
    {
        try {
            auth('api')->logout();
        } catch (\Throwable $exception) {
            // ignore invalid/missing token on logout
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 500);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 500);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'phone_number' => $user->phone_number,
            'avatar' => $this->avatarUrl($user->avatar),
            'is_verified' => (bool) $user->is_verified,
            'instructor_verified' => (bool) $user->instructor_verified,
        ];
    }

    private function avatarUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
