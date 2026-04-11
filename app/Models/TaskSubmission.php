<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = ['task_id', 'student_id', 'submission_file', 'submission_text', 'submitted_at', 'score', 'feedback', 'status', 'graded_at'];

    protected $casts = [
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'score' => 'decimal:2',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function revisions()
    {
        return $this->hasMany(TaskSubmissionRevision::class, 'task_submission_id');
    }
}
