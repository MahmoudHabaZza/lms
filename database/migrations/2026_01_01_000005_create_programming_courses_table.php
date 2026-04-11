<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Covers: programming_courses base table + drive_link column
     */
    public function up(): void
    {
        Schema::create('programming_courses', function (Blueprint $table): void {
            $table->id();

            // ── Relations ───────────────────────────────────────────────────
            $table->foreignId('instructor_id')->nullable()->constrained('users')->nullOnDelete();
            // category relation: store id but avoid FK here to prevent ordering issues
            $table->unsignedBigInteger('category_id')->nullable();

            // ── Meta ────────────────────────────────────────────────────────
            $table->string('title');
            $table->string('age_group', 20)->nullable();
            $table->string('thumbnail')->nullable();
            $table->text('short_description')->nullable();
            $table->string('learning_outcome')->nullable();
            $table->string('drive_link')->nullable();
            $table->string('badge', 60)->nullable();
            $table->string('accent_color', 20)->default('#f97316');

            // ── Pricing & Duration ──────────────────────────────────────────
            $table->decimal('price', 8, 2)->default(0);
            $table->unsignedInteger('total_duration_minutes')->default(0);
            $table->unsignedSmallInteger('duration_months')->default(0);
            $table->unsignedSmallInteger('sessions_count')->default(0);
            $table->unsignedTinyInteger('sessions_per_week')->default(0);

            // ── Display ─────────────────────────────────────────────────────
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index(['age_group', 'status']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programming_courses');
    }
};
