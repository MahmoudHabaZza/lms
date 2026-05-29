<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'gtm_container_id'],
            [
                'value' => null,
                'type' => 'string',
                'group' => 'integrations',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        Cache::forget('settings.all');
        Cache::forget('settings.grouped');
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'gtm_container_id')->delete();

        Cache::forget('settings.all');
        Cache::forget('settings.grouped');
    }
};
