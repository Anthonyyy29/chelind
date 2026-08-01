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
        Schema::table('articles', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('body');
            $table->text('quote_text')->nullable()->after('tags');
            $table->string('quote_author')->nullable()->after('quote_text');
            $table->json('match_stats')->nullable()->after('quote_author');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['tags', 'quote_text', 'quote_author', 'match_stats']);
        });
    }
};
