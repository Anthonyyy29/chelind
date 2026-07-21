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
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // e.g., 'twitter', 'instagram', 'facebook', 'youtube'
            $table->string('handle'); // e.g., '@chelindfc'
            $table->string('url'); // full URL
            $table->string('description')->nullable(); // optional description
            $table->integer('sort_order')->default(0); // untuk urutan tampil
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};
