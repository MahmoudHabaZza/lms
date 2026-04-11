<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentExamAttempt extends Model
{
    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_AUTO_SUBMITTED = 'auto_submitted';

    public const STATUS_TERMINATED = 'terminated';

    protected $table = 'student_exam_attempts';

    protected $fillable = [
        'student_id',
        'exam_id',
        'score',
        'started_at',
        'finished_at',
        'is_passed',
        'status',
        'attempt_number',
        'time_taken_seconds',
        'tab_switch_count',
        'termination_reason',
        'question_order',
        'answer_order',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'is_passed' => 'boolean',
        'attempt_number' => 'integer',
        'time_taken_seconds' => 'integer',
        'tab_switch_count' => 'integer',
        'question_order' => 'array',
        'answer_order' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'attempt_id');
    }
}
