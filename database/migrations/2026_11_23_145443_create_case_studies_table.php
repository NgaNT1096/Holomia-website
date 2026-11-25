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
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('category_label');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('location')->nullable();
            $table->string('headline_metric')->nullable();
            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();
            $table->string('featured_span')->default('standard');
            $table->text('problem')->nullable();
            $table->text('solution')->nullable();
            $table->json('results')->nullable();
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
        Schema::dropIfExists('case_studies');
    }
};
