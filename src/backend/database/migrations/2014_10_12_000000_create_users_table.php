<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id'); // ユーザーID
            $table->string('username')->unique(); // ユーザー名
            $table->string('email')->unique(); // メールアドレス
            $table->timestamp('email_verified_at')->nullable(); // メールアドレス確認日時
            $table->string('icon_path')->nullable(); // アイコンパス
            $table->string('password'); // パスワード
            $table->rememberToken(); // リメンバートークン
            $table->text('bio')->nullable(); // 自己紹介
            $table->integer('role')->default(0); // ロール
            $table->timestamp('last_login_at')->nullable(); // 最終ログイン日時
            $table->boolean('is_blocked')->default(false); // ブロック状態
            $table->timestamp('blocked_until')->nullable(); // ブロック期限
            $table->softDeletes();
            $table->timestamps();

            // index
            $table->index('username');
            $table->index('email');
            $table->index('role');
            $table->index('is_blocked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
