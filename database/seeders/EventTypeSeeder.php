<?php

namespace Database\Seeders;

use App\Models\EventType;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventType::create(['name' => 'Ibadah Hari Minggu']);
        EventType::create(['name' => 'Ibadah Pemberkatan Nikah']);
        EventType::create(['name' => 'Resepsi Pernikahan']);
        EventType::create(['name' => 'Kegiatan Sosialisasi']);
    }
}
