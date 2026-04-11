<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseReel extends Model
{
    public const VIDEO_SOURCE_UPLOAD = 'upload';

    protected $fillable = [
        'course_id',
        'title',
        'cover_image',
        'video_source',
        'video_url',
        'video_path',
        'description',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * @return array<int, string>
     */
    public static function videoSources(): array
    {
        return [
            self::VIDEO_SOURCE_UPLOAD,
        ];
    }
}
