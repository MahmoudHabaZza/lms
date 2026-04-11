<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class SubmitStudentQuizAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'auto_submitted' => ['nullable', 'boolean'],
            'reason' => ['nullable', 'string', 'max:120'],
            'answers' => ['nullable', 'array'],
            'answers.*.question_id' => ['required_with:answers', 'integer', 'exists:questions,id'],
            'answers.*.selected_option' => ['nullable', 'string', 'in:A,B,C,D'],
        ];
    }
}
