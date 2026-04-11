<?php

namespace App\Http\Requests;

use App\Models\ProgrammingCourse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProgrammingCourseRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'age_group' => ProgrammingCourse::AGE_GROUP_5_TO_17,
            'category_id' => null,
        ]);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'age_group' => ['required', 'string', Rule::in(ProgrammingCourse::ageGroups())],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'short_description' => ['required', 'string'],
            'learning_outcome' => ['nullable', 'string', 'max:255'],
            'duration_months' => ['required', 'integer', 'min:1', 'max:60'],
            'sessions_count' => ['required', 'integer', 'min:1', 'max:300'],
            'sessions_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'badge' => ['nullable', 'string', 'max:60'],
            'accent_color' => ['nullable', 'regex:/^#(?:[A-Fa-f0-9]{3}){1,2}$/'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'instructor_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', 'instructor')),
            ],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'total_duration_minutes' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
