<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class InstructorApplication extends Model
{
    public const POSITIONS = [
        'instructor' => 'مدرب',
        'assistant_instructor' => 'مساعد مدرب',
        'content_creator' => 'صانع محتوى',
    ];

    public const STATUSES = ['new', 'reviewed', 'accepted', 'rejected'];

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'position',
        'cv_path',
        'notes',
        'status',
    ];

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function getPositionLabelAttribute(): string
    {
        return self::POSITIONS[$this->position] ?? $this->position;
    }

    public function getCvUrlAttribute(): ?string
    {
        if ($this->cv_path === null || $this->cv_path === '') {
            return null;
        }

        return url(Storage::disk('public')->url($this->cv_path));
    }
}
