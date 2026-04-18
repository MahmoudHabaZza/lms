<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table): void {
            $table->index(['group', 'key'], 'settings_group_key_idx');
        });

        Schema::table('courses', function (Blueprint $table): void {
            $table->index(['status', 'sort_order', 'id'], 'courses_status_sort_id_idx');
        });

        Schema::table('academy_sections', function (Blueprint $table): void {
            $table->index(['status', 'sort_order', 'id'], 'academy_sections_status_sort_id_idx');
        });

        Schema::table('banner_slides', function (Blueprint $table): void {
            $table->index(['status', 'sort_order', 'id'], 'banner_slides_status_sort_id_idx');
        });

        Schema::table('lesson_progress', function (Blueprint $table): void {
            $table->index(['student_id', 'is_completed', 'completed_at'], 'lesson_progress_student_state_idx');
        });

        Schema::table('tasks', function (Blueprint $table): void {
            $table->index(['course_id', 'due_date'], 'tasks_course_due_idx');
        });

        Schema::table('task_submissions', function (Blueprint $table): void {
            $table->index(['student_id', 'submitted_at'], 'task_submissions_student_submitted_idx');
        });

        Schema::table('exams', function (Blueprint $table): void {
            $table->index(['course_id', 'publish_date'], 'exams_course_publish_idx');
        });

        Schema::table('student_exam_attempts', function (Blueprint $table): void {
            $table->index(['exam_id', 'student_id', 'id'], 'exam_attempts_exam_student_id_idx');
            $table->index(['student_id', 'finished_at'], 'exam_attempts_student_finished_idx');
        });

        Schema::table('reviews', function (Blueprint $table): void {
            $table->index(['course_id', 'created_at'], 'reviews_course_created_idx');
        });

        Schema::table('notifications', function (Blueprint $table): void {
            $table->index(['user_id', 'is_read', 'created_at'], 'notifications_user_read_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table): void {
            $table->dropIndex('notifications_user_read_created_idx');
        });

        Schema::table('reviews', function (Blueprint $table): void {
            $table->dropIndex('reviews_course_created_idx');
        });

        Schema::table('student_exam_attempts', function (Blueprint $table): void {
            $table->dropIndex('exam_attempts_student_finished_idx');
            $table->dropIndex('exam_attempts_exam_student_id_idx');
        });

        Schema::table('exams', function (Blueprint $table): void {
            $table->dropIndex('exams_course_publish_idx');
        });

        Schema::table('task_submissions', function (Blueprint $table): void {
            $table->dropIndex('task_submissions_student_submitted_idx');
        });

        Schema::table('tasks', function (Blueprint $table): void {
            $table->dropIndex('tasks_course_due_idx');
        });

        Schema::table('lesson_progress', function (Blueprint $table): void {
            $table->dropIndex('lesson_progress_student_state_idx');
        });

        Schema::table('banner_slides', function (Blueprint $table): void {
            $table->dropIndex('banner_slides_status_sort_id_idx');
        });

        Schema::table('academy_sections', function (Blueprint $table): void {
            $table->dropIndex('academy_sections_status_sort_id_idx');
        });

        Schema::table('courses', function (Blueprint $table): void {
            $table->dropIndex('courses_status_sort_id_idx');
        });

        Schema::table('settings', function (Blueprint $table): void {
            $table->dropIndex('settings_group_key_idx');
        });
    }
};
