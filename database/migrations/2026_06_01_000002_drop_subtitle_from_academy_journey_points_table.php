<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('academy_journey_points', function (Blueprint $table): void {
            $table->dropColumn('subtitle');
        });
    }

    public function down(): void
    {
        Schema::table('academy_journey_points', function (Blueprint $table): void {
            $table->string('subtitle', 255);
        });
    }
};
