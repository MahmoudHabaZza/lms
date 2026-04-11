<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCertificateRequest extends FormRequest
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
            'attempt_id' => [
                'required',
                'exists:student_exam_attempts,id',
                Rule::unique('certificates', 'attempt_id')->ignore($this->route('certificate')?->id),
            ],
            'certificate_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('certificates', 'certificate_code')->ignore($this->route('certificate')?->id),
            ],
            'verification_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('certificates', 'verification_code')->ignore($this->route('certificate')?->id),
            ],
            'issued_at' => ['nullable', 'date'],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }
}
