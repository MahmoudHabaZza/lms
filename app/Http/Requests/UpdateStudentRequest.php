<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($studentId)],
            'username' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('users', 'username')->ignore($studentId)],
            'phone_number' => ['nullable', 'string', 'max:25'],
            'drive_link' => ['nullable', 'url', 'max:255'],
            'telegram_link' => ['nullable', 'url', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'password_action' => ['required', Rule::in(['keep', 'manual', 'auto'])],
            'password' => ['nullable', 'string', Password::min(10), 'required_if:password_action,manual'],
            'course_ids' => ['nullable', 'array'],
            'course_ids.*' => ['integer', 'exists:courses,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'اسم الطالب',
            'email' => 'البريد الإلكتروني',
            'username' => 'اسم المستخدم',
            'phone_number' => 'رقم الهاتف',
            'drive_link' => 'رابط Google Drive',
            'telegram_link' => 'رابط التليجرام',
            'password_action' => 'إجراء كلمة المرور',
            'password' => 'كلمة المرور',
            'course_ids' => 'الكورسات المخصصة',
            'course_ids.*' => 'الكورس المخصص',
        ];
    }
}
