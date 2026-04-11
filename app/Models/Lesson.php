<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'video_url', 'duration_minutes', 'order'];

    protected $casts = [
        'duration_minutes' => 'integer',
        'order' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function progressEntries()
    {
        return $this->hasMany(LessonProgress::class, 'lesson_id');
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }
}
