<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        $gpsRequired = $this->boolean('require_gps');

        return [
            'name' => 'required|string|max:255',
            'waktu_kegiatan' => 'required|date',
            'lokasi_kegiatan' => 'required|string',
            'event_types_id' => 'nullable|exists:event_types,id',
            'require_gps' => 'nullable|boolean',
            'latitude' => [Rule::requiredIf($gpsRequired), 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => [Rule::requiredIf($gpsRequired), 'nullable', 'numeric', 'between:-180,180'],
            'radius_m' => [Rule::requiredIf($gpsRequired), 'nullable', 'integer', 'between:10,1000'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama Kegiatan harus diisi.',
            'waktu_kegiatan.required' => 'Waktu Kegiatan harus diisi.',
            'lokasi_kegiatan.required' => 'Lokasi Kegiatan harus diisi.',
            'latitude.required' => 'Pilih titik lokasi di peta dulu.',
            'longitude.required' => 'Pilih titik lokasi di peta dulu.',
            'radius_m.required' => 'Radius wajib diisi kalau GPS diaktifkan.',
            'radius_m.between' => 'Radius harus antara 10 sampai 1000 meter.',
        ];
    }
}
