<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attempt_id' => ['required', 'exists:student_exam_attempts,id'],
            'question_id' => ['required', 'exists:questions,id'],
            'selected_option' => ['nullable', 'in:A,B,C,D'],
            'is_correct' => ['nullable', 'boolean'],
        ];
    }
}
