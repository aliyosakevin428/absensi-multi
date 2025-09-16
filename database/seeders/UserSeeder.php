<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::factory(10)->create()->each(function($user){
            $positionId = Position::pluck('id')->random();
            $user->positions()->attach($positionId);

            $user->assignRole('User');
        });
        // User::factory()->create([
        $admin = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $admin->assignRole('Admin');

        $superadmin = User::factory()->create([
            'name' => 'Aliyosa Kevin',
            'email' => 'kevinpalulungan428@gmail.com',
        ]);

        $superadmin->assignRole('Superadmin');
    }
}
