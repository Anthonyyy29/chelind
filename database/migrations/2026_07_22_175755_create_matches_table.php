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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('external_id')->unique(); // id dari football-data.org, kunci upsert
            $table->string('competition'); // 'Premier League'
            $table->string('opponent'); // Chelsea sebagai tim sendiri tidak disimpan
            $table->boolean('is_home');
            $table->dateTime('kickoff_at');
            $table->string('status'); // SCHEDULED / FINISHED
            $table->unsignedTinyInteger('score_home')->nullable();
            $table->unsignedTinyInteger('score_away')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
