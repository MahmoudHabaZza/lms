<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Covers: users base table + password_reset_tokens + sessions
     *         + two_factor columns (Fortify/Jetstream)
     *         + is_admin
     *         + profile_picture + username
     *         + first_name, last_name, is_staff, is_superuser, is_active,
     *           date_joined, role, phone_number, avatar,
     *           is_verified, instructor_verified
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->id();

            // ── Identity ────────────────────────────────────────────────────
            $table->string('name');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('username')->unique()->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();

            // ── Auth ────────────────────────────────────────────────────────
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->rememberToken();

            // ── Role & Status ───────────────────────────────────────────────
            $table->enum('role', ['student', 'instructor', 'admin'])->default('student');
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_staff')->default(false);
            $table->boolean('is_superuser')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->boolean('instructor_verified')->default(false);

            // ── Profile ─────────────────────────────────────────────────────
            $table->string('phone_number')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('avatar')->nullable();

            // ── Timestamps ──────────────────────────────────────────────────
            $table->timestamp('date_joined')->useCurrent();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table): void {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
