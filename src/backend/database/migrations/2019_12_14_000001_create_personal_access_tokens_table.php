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
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable'); // トークンの所有者
            $table->string('name'); // トークンの名前   
            $table->string('token', 64)->unique(); // トークンの値
            $table->text('abilities')->nullable(); // トークンの権限
            $table->timestamp('last_used_at')->nullable(); // トークンの最後の使用時間
            $table->timestamp('expires_at')->nullable(); // トークンの有効期限
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
