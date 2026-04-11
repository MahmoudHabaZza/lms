<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmissionRevision extends Model
{
    protected $fillable = [
        'task_submission_id',
        'submission_file',
        'submission_text',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function submission()
    {
        return $this->belongsTo(TaskSubmission::class, 'task_submission_id');
    }
}
