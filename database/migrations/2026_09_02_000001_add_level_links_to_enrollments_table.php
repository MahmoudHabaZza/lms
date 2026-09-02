<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table): void {
            if (! Schema::hasColumn('enrollments', 'drive_link')) {
                $table->string('drive_link')->nullable()->after('enrolled_at');
            }

            if (! Schema::hasColumn('enrollments', 'telegram_link')) {
                $table->string('telegram_link')->nullable()->after('drive_link');
            }
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table): void {
            if (Schema::hasColumn('enrollments', 'telegram_link')) {
                $table->dropColumn('telegram_link');
            }

            if (Schema::hasColumn('enrollments', 'drive_link')) {
                $table->dropColumn('drive_link');
            }
        });
    }
};
