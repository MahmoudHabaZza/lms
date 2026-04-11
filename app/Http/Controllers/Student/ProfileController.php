<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\LessonProgress;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();

        $courses = Course::query()
            ->whereHas('enrollments', fn ($query) => $query->where('student_id', $user->id))
            ->with(['lessons', 'category:id,name'])
            ->orderBy('title')
            ->get()
            ->map(function (Course $course) use ($user): array {
                $thumbnail = null;
                if (! empty($course->thumbnail)) {
                    $thumbnail = str_starts_with($course->thumbnail, 'http')
                        ? $course->thumbnail
                        : Storage::disk('public')->url($course->thumbnail);
                }

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'short_description' => $course->description,
                    'drive_link' => null,
                    'thumbnail' => $thumbnail,
                    'age_group' => null,
                    'badge' => $course->category?->name,
                    'accent_color' => null,
                    'enrolled_at' => ($enrolledAt = $course->enrollments()->where('student_id', $user->id)->value('enrolled_at'))
                        ? Carbon::parse($enrolledAt)->format('Y-m-d')
                        : null,
                ];
            })
            ->values();

        return Inertia::render('Student/Profile', [
            'profileData' => [
                'stats' => [
                    'certificates' => Certificate::query()->where('student_id', $user->id)->count(),
                    'tasks' => TaskSubmission::query()->where('student_id', $user->id)->count(),
                    'lessons' => LessonProgress::query()->where('student_id', $user->id)->where('is_completed', true)->count(),
                    'courses' => $courses->count(),
                ],
                'courses' => $courses,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,'.$user->id,
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone_number' => 'nullable|string|max:25',
            'profile_picture' => 'sometimes|file|image|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = 'avatars/'.Str::random(12).'.'.$file->getClientOriginalExtension();
            $path = $file->storeAs('public', $filename);
            // Store relative path for display via storage symlink
            $user->profile_picture = str_replace('public/', '', $path);
        }

        $user->name = $data['name'];
        $user->username = $data['username'] ?? $user->username;
        $user->email = $data['email'];
        $user->phone_number = $data['phone_number'] ?? $user->phone_number;
        $user->save();

        return back()->with('success', 'تم تحديث بيانات الملف الشخصي بنجاح.');
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        if (! Hash::check($request->input('current_password'), $user->password)) {
            return back()->with('error', 'كلمة المرور الحالية غير صحيحة.');
        }

        $user->password = Hash::make($request->input('password'));
        $user->save();

        return back()->with('success', 'تم تحديث كلمة المرور بنجاح.');
    }
}
