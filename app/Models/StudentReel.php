<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentReel extends Model
{
    public const VIDEO_SOURCE_UPLOAD = 'upload';

    protected $fillable = [
        'student_name',
        'student_title',
        'student_age',
        'cover_image',
        'video_path',
        'quote',
        'status',
        'sort_order',
    ];

    /**
     * @return array<int, string>
     */
    public static function videoSources(): array
    {
        return [
            self::VIDEO_SOURCE_UPLOAD,
        ];
    }

    protected function casts(): array
    {
        return [
            'student_age' => 'integer',
            'status' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
