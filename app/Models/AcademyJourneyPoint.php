<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademyJourneyPoint extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'icon',
        'bubble_color',
        'bubble_style',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
