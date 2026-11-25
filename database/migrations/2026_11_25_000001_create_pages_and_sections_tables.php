<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('template');
            $table->json('fields')->nullable();        // {key: {vi, en}}
            $table->json('images')->nullable();        // {key: {path, alt: {vi, en}}}
            $table->json('hidden_locales')->nullable(); // ["en"] = hidden on the English page only
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->unique(['page_id', 'template']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
        Schema::dropIfExists('pages');
    }
};
