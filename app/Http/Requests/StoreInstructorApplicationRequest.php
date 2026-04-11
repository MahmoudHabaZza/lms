<?php

namespace App\Http\Requests;

use App\Models\InstructorApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInstructorApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'first_name' => trim((string) $this->input('first_name')),
            'last_name' => trim((string) $this->input('last_name')),
            'email' => mb_strtolower(trim((string) $this->input('email'))),
            'phone' => $this->filled('phone') ? trim((string) $this->input('phone')) : null,
            'notes' => $this->filled('notes') ? trim((string) $this->input('notes')) : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\s().-]{8,20}$/'],
            'position' => ['required', Rule::in(array_keys(InstructorApplication::POSITIONS))],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'يرجى إدخال الاسم الأول.',
            'last_name.required' => 'يرجى إدخال الاسم الأخير.',
            'email.required' => 'يرجى إدخال البريد الإلكتروني.',
            'email.email' => 'يرجى إدخال بريد إلكتروني صحيح.',
            'phone.regex' => 'يرجى إدخال رقم هاتف صحيح.',
            'position.required' => 'يرجى اختيار الوظيفة المتاحة.',
            'position.in' => 'الوظيفة المختارة غير متاحة حاليًا.',
            'cv.required' => 'يرجى رفع السيرة الذاتية.',
            'cv.file' => 'ملف السيرة الذاتية غير صالح.',
            'cv.mimes' => 'يجب أن تكون السيرة الذاتية بصيغة PDF أو DOC أو DOCX.',
            'cv.max' => 'حجم ملف السيرة الذاتية يجب ألا يتجاوز 5 ميجابايت.',
            'notes.max' => 'الملاحظات الإضافية طويلة جدًا.',
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'الاسم الأول',
            'last_name' => 'الاسم الأخير',
            'email' => 'البريد الإلكتروني',
            'phone' => 'رقم الهاتف',
            'position' => 'الوظيفة',
            'cv' => 'السيرة الذاتية',
            'notes' => 'الملاحظات الإضافية',
        ];
    }
}
