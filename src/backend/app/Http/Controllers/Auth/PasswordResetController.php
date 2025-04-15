<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PasswordResetController extends Controller
{
  /**
   * パスワードリセットメールを送信
   */
  public function forgotPassword(Request $request)
  {
    Log::info('パスワードリセットリクエスト開始', ['email' => $request->email]);

    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
    ]);

    if ($validator->fails()) {
      Log::error('バリデーションエラー', ['errors' => $validator->errors()]);
      return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
      $status = Password::sendResetLink(
        $request->only('email')
      );

      Log::info('パスワードリセット結果', ['status' => $status]);

      if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'パスワードリセットリンクをメールで送信しました']);
      }

      if ($status === Password::INVALID_USER) {
        Log::warning('ユーザーが見つかりません', ['email' => $request->email]);
        return response()->json(['message' => 'メールアドレスに一致するユーザーが見つかりません'], 404);
      }

      Log::error('パスワードリセット失敗', ['status' => $status]);
      return response()->json(['message' => 'パスワードリセットリンクの送信に失敗しました'], 500);
    } catch (\Exception $e) {
      Log::error('パスワードリセット例外', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json(['message' => 'パスワードリセットリンクの送信に失敗しました: ' . $e->getMessage()], 500);
    }
  }

  /**
   * パスワードをリセット
   */
  public function resetPassword(Request $request)
  {
    Log::info('パスワードリセット処理開始');

    $validator = Validator::make($request->all(), [
      'token' => 'required',
      'email' => 'required|email',
      'password' => 'required|min:8|confirmed',
    ]);

    if ($validator->fails()) {
      Log::error('パスワードリセットバリデーションエラー', ['errors' => $validator->errors()]);
      return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
      $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
          $user->forceFill([
            'password' => Hash::make($password)
          ])->setRememberToken(Str::random(60));

          $user->save();

          event(new PasswordReset($user));
        }
      );

      Log::info('パスワードリセット結果', ['status' => $status]);

      if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => 'パスワードがリセットされました']);
      }

      // エラー状態の詳細ログ
      if ($status === Password::INVALID_TOKEN) {
        Log::warning('無効なトークン');
        return response()->json(['message' => 'トークンが無効です'], 400);
      }

      if ($status === Password::INVALID_USER) {
        Log::warning('ユーザーが見つかりません', ['email' => $request->email]);
        return response()->json(['message' => 'メールアドレスに一致するユーザーが見つかりません'], 404);
      }

      Log::error('パスワードリセット失敗', ['status' => $status]);
      return response()->json(['message' => 'パスワードのリセットに失敗しました'], 500);
    } catch (\Exception $e) {
      Log::error('パスワードリセット例外', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json(['message' => 'パスワードのリセットに失敗しました: ' . $e->getMessage()], 500);
    }
  }
}
