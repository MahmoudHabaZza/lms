<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        $now = now();

        $settings = [
            ['key' => 'site_name', 'value' => 'Kid Coder', 'type' => 'string', 'group' => 'general'],
            ['key' => 'address', 'value' => '', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => '', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_phone', 'value' => '', 'type' => 'string', 'group' => 'general'],
            ['key' => 'facebook_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => '', 'type' => 'string', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '', 'type' => 'string', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting + ['created_at' => $now, 'updated_at' => $now],
            );
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        DB::table('settings')
            ->whereIn('key', [
                'site_name',
                'address',
                'contact_email',
                'contact_phone',
                'facebook_url',
                'instagram_url',
                'linkedin_url',
                'youtube_url',
                'whatsapp_number',
            ])
            ->delete();
    }
};
