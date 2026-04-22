<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert social media URLs if they don't exist
        $socialSettings = [
            ['key' => 'instagram_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'tiktok_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '', 'type' => 'string', 'group' => 'general'],
        ];

        foreach ($socialSettings as $setting) {
            DB::table('settings')->insertOrIgnore($setting);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['instagram_url', 'youtube_url', 'tiktok_url', 'whatsapp_number'])->delete();
    }
};
