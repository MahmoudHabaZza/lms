<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['instructor_id', 'course_id', 'title', 'description', 'file', 'priority', 'due_date', 'allow_resubmission'];

    protected $casts = [
        'due_date' => 'datetime',
        'allow_resubmission' => 'boolean',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }
}
