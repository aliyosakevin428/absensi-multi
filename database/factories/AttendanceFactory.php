<?php

namespace Database\Factories;

use App\Models\AbsentReason;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'events_id' => Event::pluck('id')->random(),
            'Status' => $this->faker->word(),
            'absent_reasons_id' => AbsentReason::pluck('id')->random()
        ];
    }
}
