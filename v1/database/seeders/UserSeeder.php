<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'vsrao@radiantsynage.com',
            'country_code' => '+91',
            'mobile' => '9876543210',
            'password' => Hash::make('Vsrao123'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Manager Dhanunjay',
            'email' => 'dhanunjay@radiantsynage.com',
            'country_code' => '+91',
            'mobile' => '9876543201',
            'password' => Hash::make('Dhanunjay123'),
            'role' => 'manager',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Manager Ajit Kumar',
            'email' => 'ajit.kumar@radiantsynage.com',
            'country_code' => '+91',
            'mobile' => '9876543202',
            'password' => Hash::make('Ajit123'),
            'role' => 'manager',
            'status' => 'active',
        ]);
    }
}
