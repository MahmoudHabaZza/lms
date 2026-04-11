<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'exists:users,id'],
            'task_id' => ['required', 'exists:tasks,id'],
            'file' => ['nullable', 'file', 'max:20480'],
            'feedback' => ['nullable', 'string'],
            'score' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:pending,graded,rejected'],
        ];
    }
}
