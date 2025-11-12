<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = fake()->sentence();
        $slug = str($title)->slug();

        return [
            'title' => $title,
            'slug' => $slug,
            'content' => fake()->paragraph(),
            'user_id' => User::pluck('id')->random(),
        ];
    }
}
