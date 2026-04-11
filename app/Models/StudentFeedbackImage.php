<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFeedbackImage extends Model
{
    protected $fillable = [
        'student_name',
        'caption',
        'image_path',
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
