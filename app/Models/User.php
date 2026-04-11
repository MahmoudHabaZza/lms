<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\TwoFactorAuthenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'profile_picture',
        'avatar',
        'phone_number',
        'role',
        'is_staff',
        'is_superuser',
        'is_active',
        'is_verified',
        'instructor_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin' => 'boolean',
            'is_staff' => 'boolean',
            'is_superuser' => 'boolean',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'instructor_verified' => 'boolean',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Roles relationship (many-to-many)
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Permissions relationship (many-to-many)
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function lessonsProgress()
    {
        return $this->hasMany(LessonProgress::class, 'student_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'student_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function certificateRequests()
    {
        return $this->hasMany(CertificateRequest::class, 'student_id');
    }

    public function receivedCertificateRequests()
    {
        return $this->hasMany(CertificateRequest::class, 'instructor_id');
    }

    public function examAttempts()
    {
        return $this->hasMany(StudentExamAttempt::class, 'student_id');
    }

    public function tasksCreated()
    {
        return $this->hasMany(Task::class, 'instructor_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id');
    }

    public function courseEnrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function assignedCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id')
            ->withPivot('enrolled_at')
            ->withTimestamps();
    }

    public function assignedProgrammingCourses()
    {
        return $this->assignedCourses();
    }

    public function wishlist()
    {
        return $this->belongsToMany(Course::class, 'wishlist_items', 'student_id', 'course_id');
    }

    public function tasksSubmissions()
    {
        return $this->hasMany(TaskSubmission::class, 'student_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'student_id');
    }

    /**
     * Check if user has a role by slug.
     */
    public function hasRole(string $slug): bool
    {
        if ($this->is_superuser ?? false) {
            return true;
        }

        return $this->roles()->where('slug', $slug)->exists();
    }

    /**
     * Check if user has a permission by slug.
     */
    public function hasPermission(string $slug): bool
    {
        if ($this->is_superuser ?? false) {
            return true;
        }

        if ($this->permissions()->where('slug', $slug)->exists()) {
            return true;
        }

        // check permissions via roles -> permissions (if pivot exists)
        return DB::table('role_permission')
            ->join('role_user', 'role_permission.role_id', '=', 'role_user.role_id')
            ->join('permissions', 'role_permission.permission_id', '=', 'permissions.id')
            ->where('role_user.user_id', $this->id)
            ->where('permissions.slug', $slug)
            ->exists();
    }

    /**
     * Assign a role to the user (id or slug).
     */
    public function assignRole($role): void
    {
        if (is_string($role)) {
            $role = \App\Models\Role::where('slug', $role)->first();
        }

        if ($role) {
            $this->roles()->syncWithoutDetaching([$role->id]);
        }
    }

    public function isInstructorLike(): bool
    {
        return in_array($this->role, ['instructor', 'admin'], true)
            || (bool) ($this->is_admin ?? false)
            || (bool) ($this->is_superuser ?? false);
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
