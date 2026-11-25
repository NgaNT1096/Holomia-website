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
        Schema::create('event_packages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('scale')->nullable();
            $table->string('capacity_per_day')->nullable();
            $table->string('staffing')->nullable();
            $table->text('content_included')->nullable();
            $table->string('two_day_price')->nullable();
            $table->string('extra_day_price')->nullable();
            $table->string('recommended_for')->nullable();
            $table->boolean('highlighted')->default(false);
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_packages');
    }
};
