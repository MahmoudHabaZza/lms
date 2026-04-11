<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('task_submissions', function (Blueprint $table): void {
            $table->text('submission_text')->nullable()->after('submission_file');
        });

        Schema::table('task_submission_revisions', function (Blueprint $table): void {
            $table->text('submission_text')->nullable()->after('submission_file');
        });
    }

    public function down(): void
    {
        Schema::table('task_submission_revisions', function (Blueprint $table): void {
            $table->dropColumn('submission_text');
        });

        Schema::table('task_submissions', function (Blueprint $table): void {
            $table->dropColumn('submission_text');
        });
    }
};
