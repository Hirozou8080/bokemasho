<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;

use Illuminate\Http\{
  Request,
  Response
};
use Illuminate\Support\Facades\{
  Auth,
  Hash,
  Log
};

class AuthController extends Controller
{
  // ユーザー登録
  public function register(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8',
    ]);

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

    // ユーザー登録後にトークンを発行
    $token = $user->createToken("register:user{$user->id}")->plainTextToken;

    $json = [
      'token' => $token,
      'user' => $user,
    ];
    return response()->json($json, Response::HTTP_CREATED);
  }

  // ログイン
  public function login(Request $request)
  {
    try {
      if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
        $user = User::whereEmail($request->email)->first();
        $user->tokens()->delete();
        $token = $user->createToken("login:user{$user->id}")->plainTextToken;
        //ログインが成功した場合はトークンを返す
        return response()->json(['token' => $token], Response::HTTP_OK);
      }
      return response()->json('Can Not Login.', Response::HTTP_INTERNAL_SERVER_ERROR);
    } catch (Exception $e) {
      Log::error($e);
    }
  }

  public function logout(Request $request)
  {
    /** @var \App\Models\User $user */
    $user = $request->user();
    if ($user) {
      // 現在のアクセストークンのみを削除
      /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
      $token = $user->currentAccessToken();
      if ($token) {
        $token->delete();
      }
    }
    return response()->json(['message' => 'Logged out'], Response::HTTP_OK);
  }

  // 現在ログイン中のユーザー情報を返す
  public function user(Request $request)
  {
    return response()->json(['user' => $request->user()], Response::HTTP_OK);
  }
}
