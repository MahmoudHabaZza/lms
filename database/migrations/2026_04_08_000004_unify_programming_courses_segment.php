<?php

use App\Models\ProgrammingCourse;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('programming_courses')->update([
            'age_group' => ProgrammingCourse::AGE_GROUP_5_TO_17,
            'category_id' => null,
        ]);
    }

    public function down(): void
    {
        DB::table('programming_courses')
            ->whereNull('category_id')
            ->update([
                'age_group' => null,
            ]);
    }
};
