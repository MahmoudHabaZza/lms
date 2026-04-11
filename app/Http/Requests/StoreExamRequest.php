<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'course_id' => ['required', 'exists:courses,id'],
            'description' => ['nullable', 'string'],
            'time_limit' => ['nullable', 'integer', 'min:0'],
            'total_marks' => ['nullable', 'integer', 'min:0'],
            'publish_date' => ['nullable', 'date'],
        ];
    }
}
