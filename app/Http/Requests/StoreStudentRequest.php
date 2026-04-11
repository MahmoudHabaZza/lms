<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'username' => ['nullable', 'string', 'max:255', 'alpha_dash', 'unique:users,username'],
            'phone_number' => ['nullable', 'string', 'max:25'],
            'is_active' => ['sometimes', 'boolean'],
            'password_mode' => ['required', Rule::in(['manual', 'auto'])],
            'password' => ['nullable', 'string', Password::default(), 'required_if:password_mode,manual'],
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
            'password_mode' => 'طريقة كلمة المرور',
            'password' => 'كلمة المرور',
            'course_ids' => 'الكورسات المخصصة',
            'course_ids.*' => 'الكورس المخصص',
        ];
    }
}
