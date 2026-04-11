<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'order' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('lessons')->where(
                    fn ($query) => $query->where('course_id', $this->integer('course_id')),
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'order.required' => 'يرجى إدخال ترتيب الدرس.',
            'order.min' => 'ترتيب الدرس يجب أن يبدأ من 1 أو أكثر.',
            'order.unique' => 'هذا الترتيب مستخدم بالفعل داخل الكورس المختار. اختر رقمًا آخر.',
        ];
    }
}
