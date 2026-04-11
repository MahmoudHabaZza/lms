<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_reels', function (Blueprint $table): void {
            $table->id();

            // ── Relations ───────────────────────────────────────────────────
            $table->foreignId('programming_course_id')
                ->nullable()
                ->constrained('programming_courses')
                ->cascadeOnDelete();

            // ── Meta ────────────────────────────────────────────────────────
            $table->string('title')->nullable();
            $table->text('description')->nullable();

            // ── Media ───────────────────────────────────────────────────────
            $table->string('cover_image')->nullable();
            $table->string('video_source', 20)->default('upload');
            $table->string('video_url')->nullable();
            $table->string('video_path')->nullable();

            // ── Display ─────────────────────────────────────────────────────
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index(['status', 'sort_order']);
            $table->index('video_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_reels');
    }
};
