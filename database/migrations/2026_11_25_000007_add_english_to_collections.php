<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['case_studies', 'event_packages', 'insights'] as $name) {
            // {column: English value}; anything missing falls back to Vietnamese.
            Schema::table($name, fn (Blueprint $table) => $table->json('en')->nullable());
        }
    }

    public function down(): void
    {
        foreach (['case_studies', 'event_packages', 'insights'] as $name) {
            Schema::table($name, fn (Blueprint $table) => $table->dropColumn('en'));
        }
    }
};
