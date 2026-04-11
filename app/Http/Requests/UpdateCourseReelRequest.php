<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseReelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['nullable', 'exists:courses,id'],
            'title' => ['nullable', 'string', 'max:120'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'cover_image_file' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:204800'],
            'video_url' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:400'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'video_file.uploaded' => 'رفع الفيديو فشل. تأكد من حجم الملف (أقل من 200MB) ومن إعدادات upload_max_filesize/post_max_size في php.ini.',
            'video_file.max' => 'حجم الفيديو يجب أن يكون أقل من 200MB.',
            'video_file.mimetypes' => 'امتداد الفيديو غير مدعوم. استخدم mp4 أو webm أو quicktime.',
        ];
    }
}
