<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'time_limit',
        'total_marks',
        'publish_date',
        'max_attempts',
        'allowed_tab_switches',
        'pass_percentage',
        'randomize_questions',
        'randomize_answers',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'max_attempts' => 'integer',
        'allowed_tab_switches' => 'integer',
        'pass_percentage' => 'integer',
        'randomize_questions' => 'boolean',
        'randomize_answers' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function attempts()
    {
        return $this->hasMany(StudentExamAttempt::class);
    }
}
