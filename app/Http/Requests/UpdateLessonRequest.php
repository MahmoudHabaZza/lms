<?php

namespace App\Http\Requests;

use App\Models\Lesson;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $lessonId = $this->route('lesson')?->id;

        return [
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_source' => ['required', Rule::in([
                Lesson::VIDEO_SOURCE_DRIVE,
                Lesson::VIDEO_SOURCE_UPLOAD,
                Lesson::VIDEO_SOURCE_YOUTUBE,
            ])],
            'video_url' => [
                'nullable',
                'url',
                Rule::requiredIf(in_array($this->input('video_source'), [
                    Lesson::VIDEO_SOURCE_DRIVE,
                    Lesson::VIDEO_SOURCE_YOUTUBE,
                ], true)),
            ],
            'video_file' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime',
                'max:204800',
                Rule::requiredIf(
                    $this->input('video_source') === Lesson::VIDEO_SOURCE_UPLOAD
                    && blank($this->route('lesson')?->video_path)
                ),
            ],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'order' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('lessons')
                    ->ignore($lessonId)
                    ->where(fn ($query) => $query->where('course_id', $this->integer('course_id'))),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'order.required' => 'يرجى إدخال ترتيب الدرس.',
            'order.min' => 'ترتيب الدرس يجب أن يبدأ من 1 أو أكثر.',
            'order.unique' => 'هذا الترتيب مستخدم بالفعل داخل الكورس المختار. اختر رقمًا آخر.',
            'video_source.required' => 'يرجى اختيار مصدر الفيديو.',
            'video_source.in' => 'مصدر الفيديو المختار غير مدعوم.',
            'video_url.required' => 'يرجى إدخال رابط الفيديو للمصدر المختار.',
            'video_url.url' => 'يرجى إدخال رابط صحيح.',
            'video_file.mimetypes' => 'نوع الفيديو غير مدعوم. استخدم mp4 أو webm أو mov.',
            'video_file.max' => 'حجم الفيديو يجب أن يكون أقل من 200MB.',
            'video_file.required' => 'يرجى رفع ملف فيديو عند اختيار الرفع.',
            'video_file.uploaded' => 'فشل رفع الفيديو. تأكد من إعدادات السيرفر وحجم الملف.',
        ];
    }
}
