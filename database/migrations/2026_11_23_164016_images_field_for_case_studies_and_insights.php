<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('case_studies', fn (Blueprint $t) => $t->json('images')->nullable()->after('headline_metric'));
        Schema::table('insights', fn (Blueprint $t) => $t->json('images')->nullable()->after('summary'));

        // Carry the old single image (+ alt) over as the first item of the new set.
        foreach (DB::table('case_studies')->whereNotNull('image')->get() as $row) {
            DB::table('case_studies')->where('id', $row->id)->update([
                'images' => json_encode([['path' => $row->image, 'alt' => $row->image_alt]], JSON_UNESCAPED_UNICODE),
            ]);
        }

        Schema::table('case_studies', fn (Blueprint $t) => $t->dropColumn(['image', 'image_alt']));
    }

    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $t) {
            $t->string('image')->nullable();
            $t->string('image_alt')->nullable();
        });
        Schema::table('case_studies', fn (Blueprint $t) => $t->dropColumn('images'));
        Schema::table('insights', fn (Blueprint $t) => $t->dropColumn('images'));
    }
};
