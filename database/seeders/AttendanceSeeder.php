<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = User::all();

         Attendance::factory()->count(10)->create()->each(function($attendance)use($users){
             $userIds = $users->random(rand(1,3))->pluck('id')->toArray();
             $attendance->users()->attach($userIds);
         });

         $events = Event::all();

         Attendance::factory()->count(10)->create()->each(function($attendance)use($events){
             $eventIds = $events->pluck('id')->toArray();
             $attendance->events()->attach($eventIds);
         });
    }
}
