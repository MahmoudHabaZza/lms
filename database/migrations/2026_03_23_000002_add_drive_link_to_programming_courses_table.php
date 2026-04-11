<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('programming_courses', 'drive_link')) {
            Schema::table('programming_courses', function (Blueprint $table): void {
                $table->string('drive_link')->nullable()->after('short_description');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('programming_courses', 'drive_link')) {
            Schema::table('programming_courses', function (Blueprint $table): void {
                $table->dropColumn('drive_link');
            });
        }
    }
};
