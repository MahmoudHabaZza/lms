<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    public const AGE_GROUP_5_TO_17 = '5-17';
    public const AGE_GROUP_5_TO_17_LABEL = 'من 5 إلى 17 سنة';

    protected $fillable = [
        'instructor_id',
        'title',
        'description',
        'short_description',
        'learning_outcome',
        'category_id',
        'price',
        'thumbnail',
        'drive_link',
        'age_group',
        'badge',
        'accent_color',
        'status',
        'sort_order',
        'duration_months',
        'sessions_count',
        'sessions_per_week',
        'total_duration_minutes',
        'legacy_programming_course_id',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'status' => 'boolean',
            'sort_order' => 'integer',
            'duration_months' => 'integer',
            'sessions_count' => 'integer',
            'sessions_per_week' => 'integer',
            'total_duration_minutes' => 'integer',
            'legacy_programming_course_id' => 'integer',
        ];
    }

    public static function unifiedAudienceLabel(): string
    {
        return self::AGE_GROUP_5_TO_17_LABEL;
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'student_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlistUsers()
    {
        return $this->belongsToMany(User::class, 'wishlist_items', 'course_id', 'student_id');
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function reels()
    {
        return $this->hasMany(CourseReel::class);
    }

    public function totalDuration()
    {
        return $this->lessons()->sum('duration_minutes');
    }
}
