<?php

namespace Database\Seeders;

use App\Models\AbsentReason;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AbsentReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AbsentReason::create(['name' => 'Hadir']);
        AbsentReason::create(['name' => 'Tidak Hadir']);
    }
}
