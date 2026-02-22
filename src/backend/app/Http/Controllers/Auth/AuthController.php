<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\{
    Auth,
    Hash
};

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['認証情報が記録と一致しません。'],
            ]);
        }

        Auth::login($user);

        // メールアドレスが確認されているかチェック
        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            return response()->json([
                'message' => 'メールアドレスが確認されていません。メールに送信された確認リンクをクリックしてください。',
                'email_verified' => false,
            ], 403);
        }

        // 既存トークンを削除（多重ログインを許可しない場合）
        $user->tokens()->delete();

        // 新しいパーソナルアクセストークンを発行
        $token = $user->createToken("login:user{$user->id}")->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if ($user) {
            // 現在のトークンのみを無効化
            /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
            $token = $user->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }

        return response()->json(['message' => 'ログアウトしました'], 200);
    }

    public function user(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // メール確認用の通知を送信
        $user->sendEmailVerificationNotification();

        // トークンは発行しない（メール確認後にログインしてもらう）
        return response()->json([
            'message' => '登録が完了しました。メールアドレスに送信された確認リンクをクリックしてください。',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
        ], 201);
    }
}
