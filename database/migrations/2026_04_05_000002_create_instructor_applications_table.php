<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('instructor_applications')) {
            Schema::create('instructor_applications', function (Blueprint $table): void {
                $table->id();
                $table->string('first_name');
                $table->string('last_name');
                $table->string('email');
                $table->string('phone')->nullable();
                $table->string('position');
                $table->string('cv_path');
                $table->text('notes')->nullable();
                $table->enum('status', ['new', 'reviewed', 'accepted', 'rejected'])->default('new');
                $table->timestamps();

                $table->index(['email', 'created_at'], 'instructor_applications_email_created_at_index');
                $table->index('status', 'instructor_applications_status_index');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('instructor_applications');
    }
};
