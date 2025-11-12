<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $events = Event::all();

        // Buat 10 attendance dengan relasi ke Event (one-to-many) dan User (many-to-many)
        Attendance::factory()->count(10)->create([
            'events_id' => $events->random()->id, // Set random event_id
        ])->each(function ($attendance) use ($users) {
            // Attach 1-3 user random ke attendance (many-to-many)
            $userIds = $users->random(rand(1, 3))->pluck('id')->toArray();
            $attendance->users()->attach($userIds);
        });
    }
}
