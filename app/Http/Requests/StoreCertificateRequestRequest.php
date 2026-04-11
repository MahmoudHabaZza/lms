<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->is_admin ?? false;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'instructor_id' => ['required', 'integer', 'exists:users,id'],
            'course_title' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'in:pending,approved,rejected'],
        ];
    }
}
