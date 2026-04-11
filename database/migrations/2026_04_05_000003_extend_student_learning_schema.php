<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resources', function (Blueprint $table): void {
            $table->foreignId('lesson_id')
                ->nullable()
                ->after('course_id')
                ->constrained('lessons')
                ->nullOnDelete();
        });

        Schema::table('tasks', function (Blueprint $table): void {
            $table->boolean('allow_resubmission')->default(false)->after('due_date');
        });

        Schema::create('task_submission_revisions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('task_submission_id')->constrained('task_submissions')->cascadeOnDelete();
            $table->string('submission_file')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        Schema::table('exams', function (Blueprint $table): void {
            $table->unsignedTinyInteger('max_attempts')->default(1)->after('time_limit');
            $table->unsignedTinyInteger('allowed_tab_switches')->default(2)->after('max_attempts');
            $table->unsignedTinyInteger('pass_percentage')->default(60)->after('allowed_tab_switches');
            $table->boolean('randomize_questions')->default(true)->after('pass_percentage');
            $table->boolean('randomize_answers')->default(true)->after('randomize_questions');
        });

        Schema::table('student_exam_attempts', function (Blueprint $table): void {
            $table->string('status')->default('in_progress')->after('is_passed');
            $table->unsignedInteger('attempt_number')->default(1)->after('status');
            $table->unsignedInteger('time_taken_seconds')->default(0)->after('attempt_number');
            $table->unsignedTinyInteger('tab_switch_count')->default(0)->after('time_taken_seconds');
            $table->string('termination_reason')->nullable()->after('tab_switch_count');
            $table->json('question_order')->nullable()->after('termination_reason');
            $table->json('answer_order')->nullable()->after('question_order');
        });
    }

    public function down(): void
    {
        Schema::table('student_exam_attempts', function (Blueprint $table): void {
            $table->dropColumn([
                'status',
                'attempt_number',
                'time_taken_seconds',
                'tab_switch_count',
                'termination_reason',
                'question_order',
                'answer_order',
            ]);
        });

        Schema::table('exams', function (Blueprint $table): void {
            $table->dropColumn([
                'max_attempts',
                'allowed_tab_switches',
                'pass_percentage',
                'randomize_questions',
                'randomize_answers',
            ]);
        });

        Schema::dropIfExists('task_submission_revisions');

        Schema::table('tasks', function (Blueprint $table): void {
            $table->dropColumn('allow_resubmission');
        });

        Schema::table('resources', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('lesson_id');
        });
    }
};
