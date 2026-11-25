<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/** Rows replaced by the `sections` / `content_sections` tables; nothing reads them any more. */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('contents')
            ->where(fn ($q) => $q->where('key', 'like', 'home.%')
                ->orWhere('key', 'like', 'nav.%')
                ->orWhere('key', 'like', 'footer.%')
                ->orWhere('key', 'like', 'data.SOLUTION_PILLARS.%')
                ->orWhereIn('key', ['site.partners', 'site.trust_counters', 'slot.home.hero_scenes']))
            ->delete();
    }

    public function down(): void
    {
        // Data removal; restore from a database backup if ever needed.
    }
};
