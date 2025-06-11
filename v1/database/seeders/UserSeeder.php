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
            'name' => 'Ganesh Hs',
            'email' => 'admin@gullygroup.in',
            'country_code' => '+91',
            'mobile' => '9876543210',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Rajesh Kumar',
            'email' => 'manager@gullygroup.in',
            'country_code' => '+91',
            'mobile' => '9876543201',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Rohit Kumar',
            'email' => 'sales@gullygroup.in',
            'country_code' => '+91',
            'mobile' => '9876543202',
            'password' => Hash::make('password'),
            'role' => 'sales',
            'status' => 'active',
        ]);
    }
}
