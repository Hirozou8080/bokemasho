<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 暗号化されたメールアドレスを復号して平文に変換する
     */
    public function up(): void
    {
        $users = DB::table('users')->get();

        foreach ($users as $user) {
            try {
                // 暗号化されたメールアドレスを復号
                $decryptedEmail = Crypt::decryptString($user->email);

                // 復号したメールアドレスで更新
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['email' => $decryptedEmail]);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                // すでに平文の場合はスキップ（何もしない）
                continue;
            }
        }
    }

    /**
     * Reverse the migrations.
     * 注意: このマイグレーションは元に戻せません
     */
    public function down(): void
    {
        // 平文から暗号化に戻すことは可能だが、
        // APP_KEYの問題があったため元に戻さない
    }
};
