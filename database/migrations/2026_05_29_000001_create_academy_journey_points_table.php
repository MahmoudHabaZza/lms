<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academy_journey_points', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 255);
            $table->string('subtitle', 255);
            $table->string('icon', 100);
            $table->string('bubble_color', 50);
            $table->string('bubble_style', 200);
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['status', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academy_journey_points');
    }
};
