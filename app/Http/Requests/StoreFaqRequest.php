<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFaqRequest extends FormRequest
{
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
            'question' => ['required', 'string', 'max:255'],
            'answer_type' => ['required', Rule::in(['text', 'video'])],
            'answer_text' => ['nullable', 'string', 'max:5000', 'required_if:answer_type,text'],
            'video_url' => ['nullable', 'string', 'max:2048'], // fallback if needed
            'video_path' => ['nullable', 'string', 'max:2048'],
            'video_file' => ['required_if:answer_type,video', 'nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:204800'],
            'video_cover_image' => ['nullable', 'string', 'max:2048'],
            'cover_image_file' => ['nullable', 'image', 'max:5120'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
