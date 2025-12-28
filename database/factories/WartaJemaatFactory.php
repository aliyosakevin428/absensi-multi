<?php

namespace Database\Factories;

use App\Models\WartaJemaat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WartaJemaatFactory extends Factory
{
    protected $model = WartaJemaat::class;

    public function definition(): array
    {
        return [
            'title' => 'Warta Jemaat ' . $this->faker->date('F Y'),
            'file_path' => 'warta/dummy.pdf',
            'is_active' => false,
            'created_by' => User::inRandomOrder()->value('id'),
        ];
    }
}
