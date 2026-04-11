<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTopStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_name' => ['required', 'string', 'max:120'],
            'achievement_title' => ['nullable', 'string', 'max:180'],
            'image_path' => ['nullable', 'string', 'max:255', 'required_without:image_file'],
            'image_file' => ['nullable', 'image', 'max:5120', 'required_without:image_path'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
