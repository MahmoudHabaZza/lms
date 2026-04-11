<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Covers: student_reels (with youtube columns already removed — upload-only)
     *         + student_feedback_images
     */
    public function up(): void
    {
        Schema::create('student_reels', function (Blueprint $table): void {
            $table->id();

            // ── Student Info ────────────────────────────────────────────────
            $table->string('student_name', 120);
            $table->string('student_title')->nullable();
            $table->unsignedTinyInteger('student_age')->nullable();

            // ── Media — upload-only (video_source & video_url removed) ──────
            $table->string('cover_image')->nullable();
            $table->string('video_path')->nullable();

            // ── Content ─────────────────────────────────────────────────────
            $table->string('quote', 400)->nullable();

            // ── Display ─────────────────────────────────────────────────────
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index(['status', 'sort_order']);
        });

        Schema::create('student_feedback_images', function (Blueprint $table): void {
            $table->id();
            $table->string('student_name', 120);
            $table->string('caption', 255)->nullable();
            $table->string('image_path');
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['status', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_feedback_images');
        Schema::dropIfExists('student_reels');
    }
};
