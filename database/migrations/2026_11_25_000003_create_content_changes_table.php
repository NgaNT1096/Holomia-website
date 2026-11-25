<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_changes', function (Blueprint $table) {
            $table->id();
            $table->string('batch', 36)->index();      // one "Lưu" click
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // No foreign keys: history must outlive deleted items.
            $table->unsignedBigInteger('section_id')->nullable()->index();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('type');                    // text|removed|image|attr|item_added|item_deleted|order
            $table->string('field')->nullable();
            $table->string('locale', 5)->nullable();
            $table->string('place');                   // human readable location
            $table->json('old')->nullable();
            $table->json('new')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_changes');
    }
};
