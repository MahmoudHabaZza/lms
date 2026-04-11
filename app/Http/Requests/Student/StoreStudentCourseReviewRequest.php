<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentCourseReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:1200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'rating' => 'التقييم',
            'comment' => 'نص المراجعة',
        ];
    }
}
