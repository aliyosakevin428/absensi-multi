<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Position::create([ 'name' => 'Kamera 1' ]);
        Position::create([ 'name' => 'Kamera 2' ]);
        Position::create([ 'name' => 'Kamera 3' ]);
        Position::create([ 'name' => 'Operator OBS' ]);
        Position::create([ 'name' => 'Operator Slide' ]);
        Position::create([ 'name' => 'Operator Sound' ]);
        Position::create([ 'name' => 'Operator Atem' ]);
    }
}
