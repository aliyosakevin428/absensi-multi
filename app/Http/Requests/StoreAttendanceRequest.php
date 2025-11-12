<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
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
            'users_id' => 'required|array',
            'users_id.*' => 'exists:users,id',
            'events_id' => 'required|exists:events,id',
            'status' => 'required|string|in:Rencana,Sedang Berlangsung,Sudah Terlaksana,Dibatalkan',
            'absent_reasons_id' => 'nullable|exists:absent_reasons,id',
        ];
    }
}
