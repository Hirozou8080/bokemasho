<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * メール確認リンクからのリクエストを処理
     */
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        // ハッシュが一致するか確認
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => '無効な確認リンクです。',
            ], 400);
        }

        // 既に確認済みの場合
        if ($user->hasVerifiedEmail()) {
            $frontendUrl = config('app.frontend_url');
            return redirect($frontendUrl . '/auth/complete?action=email-verification&already_verified=true');
        }

        // メール確認を実行
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // フロントエンドの完了画面にリダイレクト
        $frontendUrl = config('app.frontend_url');
        return redirect($frontendUrl . '/auth/complete?action=email-verification');
    }

    /**
     * 確認メールを再送信
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => '指定されたメールアドレスのユーザーが見つかりません。',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'このメールアドレスは既に確認済みです。',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => '確認メールを再送信しました。',
        ], 200);
    }
}
