<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('votes', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('joke_id')->constrained()->onDelete('cascade');
      $table->timestamps();

      // ユーザーごとに1つのジョークに1回だけ投票可能
      $table->unique(['user_id', 'joke_id']);
    });
  }

  public function down()
  {
    Schema::dropIfExists('votes');
  }
};
