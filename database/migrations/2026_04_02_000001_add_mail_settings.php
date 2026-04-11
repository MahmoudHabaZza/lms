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

        $settings = [
            [
                'key' => 'admin_email',
                'value' => 'academy@example.com',
                'type' => 'string',
                'group' => 'general',
            ],
            [
                'key' => 'mail_mailer',
                'value' => 'smtp',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_host',
                'value' => 'smtp.gmail.com',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_port',
                'value' => '587',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_username',
                'value' => 'academy@example.com',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_password',
                'value' => '',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_encryption',
                'value' => 'tls',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_from_address',
                'value' => 'academy@example.com',
                'type' => 'string',
                'group' => 'mail',
            ],
            [
                'key' => 'mail_from_name',
                'value' => 'Kids Programming Academy',
                'type' => 'string',
                'group' => 'mail',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting,
            );
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        DB::table('settings')->whereIn('key', [
            'admin_email',
            'mail_mailer',
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_encryption',
            'mail_from_address',
            'mail_from_name',
        ])->delete();
    }
};
