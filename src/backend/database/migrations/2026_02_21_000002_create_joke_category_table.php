<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('joke_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('joke_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['joke_id', 'category_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('joke_category');
    }
};
