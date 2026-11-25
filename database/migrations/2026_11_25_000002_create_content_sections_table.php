<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->string('kind');                   // see config/section_templates.php
            $table->json('fields')->nullable();       // {key: {vi, en}}
            $table->json('images')->nullable();       // {key: {path, alt: {vi, en}}}
            $table->string('link')->nullable();
            $table->string('icon')->nullable();       // built-in partner mark
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_sections');
    }
};
