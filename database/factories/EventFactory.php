<?php

namespace Database\Factories;

use App\Models\EventType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'tanggal_kegiatan' => $this->faker->date($format = 'Y-m-d', $max= 'now'),
            'waktu_kegiatan' => $this->faker->time($format ='H:i:s', $max = 'now'),
            'lokasi_kegiatan' => $this->faker->address(),
            'event_types_id' => EventType::pluck('id')->random(),
        ];
    }
}
