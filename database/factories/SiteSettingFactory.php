<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiteSettingFactory extends Factory
{
    protected $model = SiteSetting::class;

    public function definition(): array
    {
        return [
            'site_name' => 'Kid Coder Arabic Academy',
            'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
            'favicon' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=128&q=80',
            'primary_color' => '#0f766e',
            'secondary_color' => '#f59e0b',
            'facebook_url' => 'https://www.facebook.com/kidcoderacademy',
            'linkedin_url' => 'https://www.linkedin.com/company/kidcoderacademy',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}