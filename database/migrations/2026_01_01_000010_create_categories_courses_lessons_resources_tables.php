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
        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique()->nullable();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table): void {
            $table->id();

            // ── Relations ───────────────────────────────────────────────────
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();

            // ── Meta ────────────────────────────────────────────────────────
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();

            // ── Pricing & Duration ──────────────────────────────────────────
            $table->decimal('price', 8, 2)->default(0);
            $table->integer('total_duration_minutes')->default(0);

            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table): void {
            $table->id();

            // ── Relations ───────────────────────────────────────────────────
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();

            // ── Content ─────────────────────────────────────────────────────
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->unsignedInteger('order')->default(0);

            $table->timestamps();

            $table->unique(['course_id', 'order']);
        });

        Schema::create('resources', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title');
            $table->string('file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('categories');
    }
};
