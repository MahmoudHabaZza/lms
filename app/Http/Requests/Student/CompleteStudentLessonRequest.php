<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class CompleteStudentLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'time_spent_minutes' => ['nullable', 'integer', 'min:0', 'max:720'],
        ];
    }
}
