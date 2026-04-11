<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->is_admin ?? false;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
            'progress' => ['required', 'numeric', 'between:0,100'],
        ];
    }
}
