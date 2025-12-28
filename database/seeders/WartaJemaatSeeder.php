<?php

namespace Database\Seeders;

use App\Models\WartaJemaat;
use Illuminate\Database\Seeder;

class WartaJemaatSeeder extends Seeder
{
    public function run(): void
    {
        WartaJemaat::query()->update(['is_active' => false]);

        // Warta aktif (1)
        WartaJemaat::factory()->create([
            'title' => 'Warta Jemaat Aktif',
            'is_active' => true,
        ]);

        WartaJemaat::factory()
            ->count(5)
            ->create();
    }
}
