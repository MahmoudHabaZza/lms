<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademySection extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
}
