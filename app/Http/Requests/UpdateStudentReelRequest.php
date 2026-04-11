<?php

namespace App\Http\Requests;

use App\Models\StudentReel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentReelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_name' => ['required', 'string', 'max:120'],
            'student_title' => ['nullable', 'string', 'max:255'],
            'student_age' => ['nullable', 'integer', 'min:4', 'max:20'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'cover_image_file' => ['nullable', 'image', 'max:5120'],
            'video_source' => ['required', 'string', Rule::in(StudentReel::videoSources())],
            'video_file' => [
                Rule::requiredIf(function (): bool {
                    $reel = $this->route('student_reel');

                    return empty($reel?->video_path);
                }),
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime',
                'max:204800',
            ],
            'quote' => ['nullable', 'string', 'max:400'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'video_file.uploaded' => 'رفع الفيديو فشل. تأكد من حجم الملف (أقل من 200MB) ومن إعدادات upload_max_filesize/post_max_size في php.ini.',
            'video_file.max' => 'حجم الفيديو يجب أن يكون أقل من 200MB.',
            'video_file.mimetypes' => 'امتداد الفيديو غير مدعوم. استخدم mp4 أو webm أو quicktime.',
        ];
    }
}
