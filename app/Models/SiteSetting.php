<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $table = 'site_settings';

    protected $fillable = ['site_name', 'logo', 'favicon', 'primary_color', 'secondary_color', 'facebook_url', 'linkedin_url'];

    // Singleton helper (optional)
    public static function instance()
    {
        return static::first();
    }
}
