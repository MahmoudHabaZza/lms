<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentTaskSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'nullable',
                'required_without:submission_text',
                'file',
                'mimes:pdf,doc,docx,ppt,pptx,zip,rar,txt,jpg,jpeg,png,webp',
                'max:10240',
            ],
            'submission_text' => [
                'nullable',
                'required_without:file',
                'string',
                'min:10',
                'max:5000',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'file' => 'ملف المهمة',
            'submission_text' => 'نص التسليم',
        ];
    }
}
