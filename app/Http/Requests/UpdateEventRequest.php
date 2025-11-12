<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'waktu_kegiatan' => 'required|date',
            'lokasi_kegiatan' => 'required|string',
            'event_types_id' => 'nullable|exists:event_types,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama Kegiatan harus diisi.',
            'waktu_kegiatan.required' => 'Waktu Kegiatan harus diisi.',
            'lokasi_kegiatan.required' => 'Lokasi Kegiatan harus diisi.',
        ];
    }
}
