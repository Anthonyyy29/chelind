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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('direction'); // 'in' (masuk) atau 'out' (keluar), relatif ke Chelsea
            $table->boolean('is_loan')->default(false);
            $table->string('player_name');
            $table->string('position'); // singkatan bebas: LW, DM, CB, dst
            $table->string('photo')->nullable();
            $table->string('club_from');
            $table->string('club_to');
            $table->decimal('fee', 8, 2)->nullable(); // dalam juta Euro; null = free transfer / fee tidak diketahui
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
