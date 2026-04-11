<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentExamAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'exists:users,id'],
            'exam_id' => ['required', 'exists:exams,id'],
            'score' => ['nullable', 'numeric', 'min:0'],
            'started_at' => ['nullable', 'date'],
            'finished_at' => ['nullable', 'date'],
            'is_passed' => ['nullable', 'boolean'],
        ];
    }
}
